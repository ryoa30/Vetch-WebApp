const jwt = require('jsonwebtoken');

class AuthController {
    generateAccessToken = ({
        userId,
        email,
        role
    }) => {
        const payload = {
            userId,
            email,
            role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "8h",
        });

        return token;
    };

    generateRefreshToken = ({
        userId,
        email,
        role,
        rememberMe
    }) => {
        const payload = {
            userId,
            email,
            role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: rememberMe ? "30d" : "1d",
        });

        return token;
    };

    authorize = (req, res, next) => {
        try {
            const header = req.header("Authorization");
            let token = "";

            if (header) {
            const split = header.split(" ")

            if (split.length > 0)
                token = header.split(" ")[1];
            }
            if (!header || !token) {
            return res.status(401).json(
                apiResponse({
                status: 0,
                message: "You are not authorize.",
                errors: ["header/token is empty"],
                statusCode: 401,
                })
            );
            }
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = user;
            next();
        } catch (error) {
            console.log('error', error.message);
            const errors = [error];
            return res.status(401).json(
            apiResponse({
                status: 0,
                message: "You are not authorize.",
                errors: errors,
                statusCode: 401,
            })
            );
        }
    };
}

module.exports = new AuthController();