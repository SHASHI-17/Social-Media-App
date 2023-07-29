const mongoose=require('mongoose')


module.exports=async ()=>{
    const mongoUri="mongodb+srv://shashi:PVlx8yMCT6DkTZPR@cluster0.z5jnbqh.mongodb.net/?retryWrites=true&w=majority"
try{
   const connect= await mongoose.connect(mongoUri,{useNewUrlParser: true, useUnifiedTopology: true });

   console.log(`MongoDb connected :${connect.connection.host}`);

}catch(e){
    console.log(e);
    process.exit(1);
}
}