const jwt = require('jsonwebtoken');

class AuthController {
    generateAccessToken = ({ userId, email, role }) => {
        const payload = { userId, email, role, tokenType: 'access' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "8h",
        });
        return token;
    };

    generateRefreshToken = ({ userId, email, role, rememberMe }) => {
        const payload = { userId, email, role, tokenType: 'refresh' };
        const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
            expiresIn: rememberMe ? "30d" : "1d",
        });
        return token;
    };

    // Verify access token on protected routes
    authorize = (req, res, next) => {
        try {
            const header = req.header("Authorization");
            let token = "";

            if (header) {
                const split = header.split(" ");
                if (split.length > 1) token = split[1];
            }

            if (!header || !token) {
                return res.status(401).json({
                    status: 0,
                    message: "You are not authorize.",
                    errors: ["header/token is empty"],
                    statusCode: 401,
                });
            }

            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            next();
        } catch (error) {
            // Distinguish expired access token so client can trigger refresh
            if (error?.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 0,
                    message: "Access token expired.",
                    code: "ACCESS_TOKEN_EXPIRED",
                    statusCode: 401,
                });
            }
            return res.status(401).json({
                status: 0,
                message: "You are not authorize.",
                errors: [error?.message || "invalid_token"],
                statusCode: 401,
            });
        }
    };

    // POST /auth/refresh
    refreshAccessToken = (req, res) => {
        try {
            // Accept refresh token from:
            // 1) Authorization: Bearer <refreshToken>
            // 2) X-Refresh-Token header
            // 3) Cookie named refreshToken
            const auth = req.header("Authorization");
            const bearer = auth && auth.startsWith("Bearer ") ? auth.split(" ")[1] : undefined;
            const headerToken = req.header("X-Refresh-Token");
            const cookieToken = req.cookies?.refreshToken;

            const refreshToken = bearer || headerToken || cookieToken;
            if (!refreshToken) {
                return res.status(401).json({
                    ok: false,
                    message: "No refresh token provided. Please login again.",
                    statusCode: 401,
                });
            }

            const payload = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
            );

            if (payload?.tokenType && payload.tokenType !== 'refresh') {
                return res.status(401).json({
                    ok: false,
                    message: "Invalid token type.",
                    statusCode: 401,
                });
            }

            const accessToken = this.generateAccessToken({
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            });

            return res.status(200).json({
                ok: true,
                message: "Access token refreshed.",
                accessToken,
                statusCode: 200,
            });
        } catch (error) {
            const expired = error?.name === 'TokenExpiredError';
            return res.status(401).json({
                ok: false,
                message: expired
                    ? "Refresh token expired. Please login again."
                    : "Invalid refresh token. Please login again.",
                statusCode: 401,
            });
        }
    };
}

module.exports = new AuthController();