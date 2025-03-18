// backend/jwt.js
const jwt = require('jsonwebtoken');

const secretKey = 'sua_chave_secreta_aqui'; // Substitua por uma chave forte

function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: '1h' }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };