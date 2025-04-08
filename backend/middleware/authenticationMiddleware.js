const jwt = require('jsonwebtoken');

function validateUser (req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        res.json({ message: 'Acceso permitido', user: user.username });
    });
}

module.exports = validateUser;