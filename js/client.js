const socket = io('http://localhost:8000');

//Get DOM elements in respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving the message.
var audio = new Audio('ting.mp3');

//Function which will append to the container.
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left' || position == 'center'){
        audio.play();
    }
}


//Ask new user for his or her name and let the server know.
const name = prompt("Enter your name to join.");
socket.emit('new-user-joined', name);

//If a new user joins, receive his or her name and send to the server.
socket.on('user-joined', name => {
    append(`${name} joined the chat.`,'center');
})

//If server sends a message receive it.
socket.on('receive', data => {
    append(`${data.name} : ${data.message}`,'left');
})

//If user leaves the chat append the info to the container.
socket.on('left', name => {
    append(`${name} left the chat`, 'center');
})

//If the form is submitted send the message to the server.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = " ";
})