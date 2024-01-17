const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userModel = mongoose.Schema({
    name: {
        type: String,
        required : true
    },

    email: {
        type: String,
        unique : true,
        required : true,  
    },

    pic : {
        type: String,
        default : "",
    },

    password: {
        type: String,
        required : true
    }
},

{
    timestamps : true,
})

userModel.pre('save', async function (next) {
    if(!this.isModified) {
        next()
    }
    
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()

})

userModel.methods.matchPassword = async function(password){
    const val = await bcrypt.compare(password, this.password);
    return val
}


const User = mongoose.model("User", userModel)

module.exports = User