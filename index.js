const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
require("dotenv").config();


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useUnifiedTopology: true

}).then(()=>{
    console.log("MongoDB connected");
}).catch((err) =>{
    console.error(`Connection failed!! ${err}`);
})
// mongoose.connect(process.env.MONGO_URL)
// .then(()=>{
//     console.log("mongodb connected");
// })
// .catch(()=> {
//     console.log("Connection failed!!");
// })

const server = app.listen(PORT,()=>{
    console.log(`Chat Server is running  http://localhost:${PORT}`);
})