const webtoken = require('jsonwebtoken');

const validate = (req, res, next) => {
    const token = req.header('auth');
    
    if(!token){
        res.status(401).send('Access Denied: No Authentication');
        return;
    }

    try{
        const valid = webtoken.verify(token, process.env.AUTH_KEY);
        req.auth = valid;
        next();
    }catch(err){
        res.status(400).send('Access Denied: Invalid Authentication');
        console.log(err);
    }
}

module.exports = validate;