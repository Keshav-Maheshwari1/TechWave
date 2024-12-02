export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the role of the user is included in the allowedRoles array
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Access denied. Insufficient permissions." });
    }
    // Proceed to the next middleware or route handler if the user is authorized
    next();
  };
};

export const mockUserMiddleware = (req, res, next) => {
    // Fetch user role from the request headers (x-user-role)
    const userRole = req.headers["x-user-role"];

    // If the x-user-role header is missing, respond with an error
    if (!userRole) {
      return res
        .status(400)
        .json({ msg: "Missing required headers: x-user-role." });
    }

    // Attach the user role to the request object (req.user)
    req.user = {
      role: userRole, // The role of the user (e.g., "gp", "phed")
    };

  // Continue to the next middleware or route handler
  next();
};
