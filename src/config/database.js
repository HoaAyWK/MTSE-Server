const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
    
        await mongoose.connect(process.env.MONGODB_URL)

        console.log("Connected to database")
    } catch (error) {
        console.log(error.message);
    }
};

const disconnectDatabase = async () => {
    await mongoose.connection.close();
    console.log('Disconnected database');
};

module.exports = { connectDatabase, disconnectDatabase };