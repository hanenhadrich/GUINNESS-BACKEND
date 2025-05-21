import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ error: 'Authorization header must be in the format "Bearer <token>"' });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

 
    const { default: User } = await import("../models/userModel.js");

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid token, user does not exist" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired, please login again" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token, authorization denied" });
    }

    console.error(error);
    return res.status(500).json({ error: "Something went wrong with the authentication" });
  }
};

export default checkAuth;
