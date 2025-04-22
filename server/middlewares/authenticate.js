const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    // console.log("Req");
    // console.log("req.cookies", req.cookies);
    const token = req.cookies.token;

    // console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded", decoded);

    // Attach user ID to request object
    req.userId = decoded._id;

    next();
  } catch (error) {
    console.log("Error in middleware", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
