const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io')
const userRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messagesRoute");


const app = express();
require("dotenv").config();


app.use(cors());
app.use(express.json());

// ** setup Routes **// 
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)


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

const io = socket(server, {
    cors:{
        origin:"http://localhost:3000",
        credential:true
    }
})
global.onlineUsers = new Map();
io.on("connection",(socket) =>{
    global.chatSocket = socket;
    socket.on("add-user",(userId) => {
        onlineUsers.set(userId, socket.id)
    });
    // send message to all users except the sender
    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-recieve', data.message);
        }
    })
})