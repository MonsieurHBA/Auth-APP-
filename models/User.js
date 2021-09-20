// import same package

const { model } = require('mongoose');
const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt') ;
const { isEmail } = require('validator') ;  



// New user ADD

const userSchema = new mongoose.Schema({
    Email: {
        type : String ,
        required: [true , 'Please enter an Email'],
        unique : true,
        lowercase : true ,
        validate : [isEmail , 'Please enter a valid Email ' ]
    } ,
    Password : {
        type : String ,
        required: [true , 'Please enter an Password'],
        minlength : [6 , 'Minimum password length is 6 characters'],
    } ,
})

// Schema mongo DB

userSchema.post('save' , (doc , next)=>{
console.log('New user was created and saved' , doc) ;
next();
})
// crypt password

userSchema.pre('save' , async function(next){       
    const salt = await bcrypt.genSalt() ;        
    this.Password = await bcrypt.hash(this.Password , salt) ;
next();
})

// static methos to login user
userSchema.statics.login = async function(Email , Password) {
    const user = await this.findOne({ Email }) ; 
    if(user) {
        const auth = await bcrypt.compare(Password , user.Password) ; // compare old password in data base and new input
        if(auth) {
            return user ;
        }
        throw Error('Incorrect Password') ;
    } 
    throw Error ('Incorrect Email') ;
}

//  collection

const User = new mongoose.model('user_pizza' , userSchema ) ;

module.exports = User ;
