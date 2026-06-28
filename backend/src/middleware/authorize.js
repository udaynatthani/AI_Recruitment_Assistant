const authorize = (...roles) => {
    return (req, res, next) => {
      // req.user is added by authenticate middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access Denied",
        });
      }
  
      next();
    };
  };
  
  module.exports = authorize;