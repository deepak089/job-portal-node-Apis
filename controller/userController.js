const userModel=require('../model/userModel');

exports.updateUserController = async(req,res,next)=>{
    const {name,email,password, location} = req.body;

    if(!name || !email || !password || !location){
        next('Please provide all details');
    }
    const user = userModel.findOne({_id:req.user.userId});
    user.name=name;
    user.email=email;
    user.location=location;
    await  user.save();    
    const token=user.createJwt();
    res.status(200).send({
        user,
        message:"updated successfully",
        token
    })
} 