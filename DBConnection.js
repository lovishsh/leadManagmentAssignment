const mongoose=require('mongoose');
const connectDB=async()=>{
    const url=process.env.MONGODB_URL;
    try {
        await mongoose.connect(url);
        console.log(`connection established`);
    } catch (error) {
        console.log(`connectin failed : ${error}`);
    }
}
module.exports=connectDB;