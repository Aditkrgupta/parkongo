const jwt = require('jsonwebtoken');

exports.identifier = (req, res, next) => {
  let token;

  // If token is sent via header (API clients)
  if (req.headers['authorization']) {
    token = req.headers['authorization'].split(' ')[1];
  }

  // If token is sent via cookie (browser)
  else if (req.cookies && req.cookies.Authorization) {
    token = req.cookies.Authorization.split(' ')[1]; // "Bearer <token>"
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
