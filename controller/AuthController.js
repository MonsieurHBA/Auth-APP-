

const jwt = require('jsonwebtoken') ;
const User = require('../models/User') ;

// catch err eli 3malthom f User.js
const HandelErr = (err) => {
console.log(err.message , err.code) ;   
let error = {Email: '' , Password: '' } ;  

// incorrect email not registred
if(err.message === 'Incorrect Email') {
    error.Email = 'That Email is nor Registred' ;
}
if(err.message === 'Incorrect Password') {
    error.Password = 'That Password is FALSE' ;
}

// error unique email
if(err.code ===11000) {
    error.Email = 'This Email is already created  :('
    return error ;
}





// validation error
if(err.message.includes('user_pizza validation failed')){
    Object.values(err.errors).forEach(({properties})=>{  
       
        error[properties.path] = properties.message ;  
    })

    

}
return error ;
}

// create Token
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) =>{
    return jwt.sign({ id } , 'Pizza' , {
        expiresIn: maxAge  
    })
}

module.exports.signup_get = (req , res) =>{
    res.render('signup') ;
}

module.exports.login_get = (req , res) =>{
    res.render('login') ;
}

module.exports.signup_post = async (req , res) =>{

    const { Email , Password  } = req.body ;
    
    try {
       const user = await User.create({Email , Password }) ;  
      const token = createToken(user._id);
      res.cookie('jwt' ,  token , {httpOnly: true , maxAge: maxAge * 1000})
       res.status(201).json({user: user._id}) ;   
    } 
    
    catch(err) {
        const errors = HandelErr(err) ;
        res.status(400).json({ errors });

    }
}

module.exports.login_post = async function (req , res) {
   
    const { Email , Password  } = req.body ;
    try {
        const user = await User.login(Email , Password);
        const token = createToken(user._id);
        res.cookie('jwt' ,  token , {httpOnly: true , maxAge: maxAge * 1000})
        res.status(200).json({user: user._id}) ;
    }catch(err) {
        const errors = HandelErr(err) ;    
         res.status(400).json({errors}) ;
    }
}


module.exports.logout_get = (req , res) =>{
    res.cookie('jwt' , '' , {maxAge: 1}) ;
    res.redirect('/') ;
}
