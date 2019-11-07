const mongoose = require('mongoose');
const config = require('config');
const dbURI = config.get('mongoURI');

const connectDB = () => {
    mongoose.connect(dbURI, { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (error, db) => {
        if(error){
            console.error(error.message); 
            process.exit(1)
        }else{
            console.log("MongoDB connected"); 
        }
    })
}

module.exports = connectDB;
