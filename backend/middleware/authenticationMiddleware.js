const jwt = require('jsonwebtoken');

function validateUser (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user
        next()
    });
}

module.exports = validateUser;