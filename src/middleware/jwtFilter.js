const jwt = require('jsonwebtoken');


class JwtFiler{
    verifyToken(req, res, next){
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token)
            return res.json({success: false, message: 'Invalid token'});
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
            req.userId = decoded.userId;

            next();
            
        }
        catch(error){
            return res.json({success: false, message: error.message});
        }
    }
    
    generateToken(userId){
        const accessToken = jwt.sign(
            {userId},
            process.env.JWT_SECRET
        )
    
        return accessToken
    }
}

module.exports = new JwtFiler