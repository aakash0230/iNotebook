const mongoose = require("mongoose")
const mongoURI = "mongodb://127.0.0.1/inotebook"

const connectDb = async () => {
    mongoose.set('strictQuery', false)
    try{
        const con = await mongoose.connect(mongoURI)
        console.log(`Connected with database : ${con.connection.host}`)
    }
    catch(err){
        console.log(err);
        process.exit(1);

    }
    
}

module.exports = connectDb;