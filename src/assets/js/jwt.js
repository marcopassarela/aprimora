// jwt.js
const jwt = require('jsonwebtoken');

const secretKey = 'sua_chave_secreta_aqui'; // Substitua por uma chave secreta forte

function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: '1h' } // Token expira em 1 hora
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