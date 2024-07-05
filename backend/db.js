const mongoose = require('mongoose');

const url = 'mongodb+srv://mohit1502:pCAWZsiL567D97Et@mak.4zerk6q.mongodb.net/?retryWrites=true&w=majority&appName=Mak';

let connectToDB = () => {
    mongoose.connect(url).then(() => {
        console.log("Connected to Database Successfully");
    })
}

module.exports = connectToDB;