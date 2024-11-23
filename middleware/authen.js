const jwt = require('jsonwebtoken');

const authen = (roles) => async (req, res, next) => {
    try {
      // Kiểm tra xem có header authorization không
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        
        // Xác minh token bằng "access_token_secret"
        const data = jwt.verify(token, "access_token_secret");
  
        // Gán thông tin user từ token vào request
        req.user = data;
  
        // Kiểm tra xem role của user có nằm trong các role được phép không
        if (!roles || roles.includes(data.role)) {
          next();
        } else {
          return res.status(403).json({ error: "Forbidden: Access denied" });
        }
      } else {
        res.status(401).json({ error: "Unauthorized: No token provided" });
      }
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
  

module.exports = authen;