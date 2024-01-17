const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const { notFound, errorHandler } = require("./middleWare/errorMiddleWare")

const userRoutes = require("./routes/userRoutes");
const chatRouts = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

const app = express();
dotenv.config();
connectDB()

app.use(express.json())



app.get('/', (req,res) => {
    res.send("connected to the server")
})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRouts)
app.use("/api/message" , messageRoutes)


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT_NUMBER || 8000

const server = app.listen(PORT, console.log(`server has started at port ${PORT}`));


const io = require('socket.io')(server, {
    pingTimeout : 6000,
    cors: {
        origin : "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket");

    socket.on("setup", (userData) => {
        console.log(userData._id)
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (chatId) => {
        socket.join(chatId)
        console.log("user joined the room ",chatId)
    })

    socket.on("new message", (newMessage) => {
        const chat = newMessage.chat

        if (!chat) {
            console.log("no chat is selected");
            return;
        }

        chat.users.forEach((user) => {
            if (user._id === newMessage.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessage)  
        });
    })

    socket.off("setup", () => {
        console.log("left the socket")
       socket.leave(userData._id)
   })
})

