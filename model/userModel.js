const mongoose=require('mongoose');
const validator = require('validator');
const bcrypt=require('bcryptjs');
const JWT =require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [30, "Name cannot exceed 30characters"],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "please Enter a Valid Email"]
    },
    password:{
        type:String,
        required: [true, "Please Enter your Password"],
        minLength:[4,"Password Greater then 8 characters"],
        select:true
    },
    location: {
        type: String,
        required: [true, "Please Enter your name"],
        default:'India'
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
      type:String,
      default:Date.now
    },
},{timestamps:true})


// save se phle password hash 
userSchema.pre('save',async function(){
    if(!this.isModified){
            return ;
    }
    const salt=await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};
// json web token
userSchema.methods.createJwt = function(){
    return JWT.sign({userId : this._id},process.env.JWT_SECRET,{ expiresIn:'1d' });
}
module.exports = mongoose.model('User', userSchema);