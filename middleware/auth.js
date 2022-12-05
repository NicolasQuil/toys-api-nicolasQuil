const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {

        return res.status(401).json({ msg: "you must send token to this endpoint" })
    }
    try {

        let decodeToken = jwt.verify(token, "monkeysSecret");
        req.tokenData = decodeToken
        next();
    }
    catch (err) {
        return res.status(401).json({ msg: "Token invalid or expired" })
    }
}