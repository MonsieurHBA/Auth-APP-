// hne n7ot les call back function mtaa routes eli fi authrout

const jwt = require('jsonwebtoken') ;
const User = require('../models/User') ;

// catch err eli 3malthom f User.js
const HandelErr = (err) => {
console.log(err.message , err.code) ;   //err.message t5alini ne5eé les message d'erreur eli mawjoudin f User.js
let error = {Email: '' , Password: '' } ;  // hedhom ferghyn bech n7ot fyhom el erreur o nab3athhom lel user sous forme JSON

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
    Object.values(err.errors).forEach(({properties})=>{  // Object.values(err.errors) : hedhom el valeur mtaa error eli fyh error email o erreur password
        // tawa bech nekh2o juste el message d'error o n7otouhom f error eli fyh Email o password ferghyn (forEach)
        error[properties.path] = properties.message ;   //properties.path = Email o Password , properties.message : heya el message d'erreur
    })

    

}
return error ;
}

// create Token
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) =>{
    return jwt.sign({ id } , 'Pizza' , {
        expiresIn: maxAge  // toufa les cookies fi 3 day
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
    // tawa bech naamlo new user f data base bel proprity Email , Password
    try {
       const user = await User.create({Email , Password }) ;  // a3meli user jdid 7aseb el schema eli 3malto ena deja f User.js
      const token = createToken(user._id);
      res.cookie('jwt' ,  token , {httpOnly: true , maxAge: maxAge * 1000})
       res.status(201).json({user: user._id}) ;   // raja3li el user eli 3malto f data base
    } 
    
    catch(err) {
        const errors = HandelErr(err) ;
        res.status(400).json({ errors });

    }
}

module.exports.login_post = async function (req , res) {
    //console.log(req.body)   najem n'affichi eli b3aththom fi postman avec el midelware **** app.use(express.json()) ;
    const { Email , Password  } = req.body ;
    try {
        const user = await User.login(Email , Password);
        const token = createToken(user._id);
        res.cookie('jwt' ,  token , {httpOnly: true , maxAge: maxAge * 1000})
        res.status(200).json({user: user._id}) ;
    }catch(err) {
        const errors = HandelErr(err) ;    //throw Error('Incorrect Password') ;     throw Error ('Incorrect Email') ; hedhom ki nheb n'affichehom f console ki na3mel ghalta f email wala password<  
         res.status(400).json({errors}) ;
    }
}


module.exports.logout_get = (req , res) =>{
    res.cookie('jwt' , '' , {maxAge: 1}) ;
    res.redirect('/') ;
}