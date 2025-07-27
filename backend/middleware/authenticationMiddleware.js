const jwt = require('jsonwebtoken');

function validateUser (req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Auth header recibido:', authHeader); // Debug log

    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) {
        console.log('No se encontró token en la petición');
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    console.log('Token extraído:', token.substring(0, 20) + '...'); // Debug log (solo primeros 20 chars por seguridad)

    jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
        if (err) {
            console.error('Error al verificar token:', err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado. Por favor, inicia sesión nuevamente.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ error: 'Token inválido' });
            } else {
                return res.status(403).json({ error: 'Error de autenticación' });
            }
        }

        console.log('Token válido para usuario:', user.user_id); // Debug log
        req.user = user
        next()
    });
}

module.exports = validateUser;