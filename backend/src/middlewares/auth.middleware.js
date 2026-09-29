import jwt from "jsonwebtoken";
import httpStatus from "http-status";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "Authentication token is missing"
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "Token is invalid or expired"
    });
}
};