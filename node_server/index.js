// Node server which will handle socket io connections

const io = require("socket.io")(8000)

const users = {};

io.on('connection', socket =>{

    //If someone joins the chat show it to others.
    socket.on('new-user-joined', name =>{
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    //If someone sends a message show the message to others
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });
    //If someone leaves the chat show it to others.
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})