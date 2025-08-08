const jwt = require('jsonwebtoken');
const userRepository = require('../repository/UserRepository');

class AuthController {
    login(req, res) {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = userRepository.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // 2. Check the password (in a real app, use bcrypt.compare)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        // 3. User is valid, create a JWT
        const payload = { userId: user.id, email: user.email };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // 4. Send the token to the client
        res.status(200).json({
            message: 'Logged in successfully!',
            token: token
        });
    }
}

module.exports = new AuthController();