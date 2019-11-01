const mongoose = require('mongoose');
const config = require('config');
const dbURI = config.get('mongoURI');
const MongoClient = require('mongodb').MongoClient

const connectDB = () => {
    MongoClient.connect(dbURI, { 
        useUnifiedTopology: true
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
