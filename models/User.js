// hedha leli bech ya3mel signup *** bech naamlo New user model

const { model } = require('mongoose');
const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt') ;
const { isEmail } = require('validator') ;  // hedhy function mawjouda fi validator taamlk validation mta3 email


// 3malt kifeh el user bech ykoun f data base el model mta3o


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

// appel function ba3ed mansajel new user jdid
userSchema.post('save' , (doc , next)=>{
console.log('New user was created and saved' , doc) ;
next();
})

// appel d'une function 9bal mana3mel new user bech najem n5abi el password
userSchema.pre('save' , async function(next){       
    const salt = await bcrypt.genSalt() ;        //  nrakab haja lel password baaed naamelo HAshing
    this.Password = await bcrypt.hash(this.Password , salt) ;
next();
})

// static methos to login user
userSchema.statics.login = async function(Email , Password) {
    const user = await this.findOne({ Email }) ; // lawejli 3la email hedha f data base : this ki nabda saye el model 7adher ma5doum
    if(user) {
        const auth = await bcrypt.compare(Password , user.Password) ; // comparision byn el password eli f data base o eli f input besh naaref naaml login wale
        if(auth) {
            return user ;
        }
        throw Error('Incorrect Password') ;
    } 
    throw Error ('Incorrect Email') ;
}

// tawa bech na3mel el collection

const User = new mongoose.model('user_pizza' , userSchema ) ;

module.exports = User ;