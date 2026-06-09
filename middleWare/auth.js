import { errorHandling } from "../utils/errorHandling.js";
import { httpError } from "../utils/httpError.js";
import jwt from "jsonwebtoken";
export const auth = errorHandling(async (req, res, next) => {
  // authentication :
const token = req.headers.authorization?.split(" ")[1];console.log(token);

  if (!token) return next(new httpError(401, "You must login first"));
  try {
    let decoded = jwt.verify(token, process.env.LOGIN_KEY);
    req.userId = decoded.id;
    req.role = decoded.role;    
    next();
  } catch (error) {
    next(new httpError(401, "token expired"));
  }
});


// authorization :
export const authorize = (...roles) => {
  return errorHandling( (req, res, next) => {
    if (!roles.includes(req.role))
      return next(new httpError(403, "You have no permission to doing that"));
    next();
  });
};
