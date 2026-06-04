const jwt = require("jsonwebtoken");

function createToken(user) {
    return jwt.sign(
        { id: user.userID, email: user.email },
        "SECRET_KEY",
        { expiresIn: "1d" }
    );
}

module.exports = { createToken };