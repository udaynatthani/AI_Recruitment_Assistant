const jwt = require("jsonwebtoken");


const authenticate= (req,res,next)=>{
    const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid"
    });
}

    const token = req.headers.authorization.split(" ")[1];

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user={id:decoded.id,role:decoded.role};
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"invalid or expired token"});
    }
};

module.exports={authenticate};