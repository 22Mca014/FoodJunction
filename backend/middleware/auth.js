import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    console.log('entering middleware');
    
    const { token } = req.headers;
    console.log(token);
    
    if (!token) {
        return res.json({success:false,message:'Not Authorized Login Again'});
    }
    try {
        const token_decode =  jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log("middleware error");
        
        return res.json({success:false,message:error.message});
    }
}

export default authMiddleware;