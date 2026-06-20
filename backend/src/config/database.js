const mongoose= require('mongoose')

 async function connectToDb() {
   if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required")
   }

   await mongoose.connect(process.env.MONGO_URI)
   console.log("Connected to db")
}


module.exports = connectToDb
