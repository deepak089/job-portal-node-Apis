const mongoose=require('mongoose');

const connetionDatabase=()=>{
    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then((data)=>{
        console.log(`mongo db working per with server ${data.connection.host}`)
    })
}
module.exports=connetionDatabase;