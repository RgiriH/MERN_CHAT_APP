const mongoose = require('mongoose');
const URI =
  "mongodb+srv://Girish:TheBest%40123@cluster0.pmqqfr9.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async() => {
     try {
         const conn = await mongoose.connect(process.env.MONGO_URI, {
             
         });
         console.log(`connected to mongodb at ${conn.connection.host}`)
     } catch (error) {
         console.log(error)
         process.exit
     }
}

module.exports = connectDB