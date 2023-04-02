const chatbox = document.getElementById('chatbox');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const submitButton = document.getElementById('submit');

// WebSocket connection
const socket = new WebSocket('wss://noblesocket.onrender.com');

socket.addEventListener('open', (event) => {
  console.log('WebSocket connection established');
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
  const messageElement = createMessageElement(message);
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
});

submitButton.addEventListener('click', (event) => {
  const username = usernameInput.value;
  const messageText = messageInput.value;

  if (username && messageText) {
    const message = {
      username,
      messageText,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.send(JSON.stringify(message));

    // Display message on sender's screen
    const messageElement = createMessageElement(message);
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;

    // Clear input fields
  }
});

function createMessageElement(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  const usernameElement = document.createElement('span');
  usernameElement.classList.add('username');
  usernameElement.textContent = message.username;

  const textElement = document.createElement('span');
  textElement.textContent = `: ${message.messageText}`;

  const timestampElement = document.createElement('span');
  timestampElement.classList.add('timestamp');
  timestampElement.textContent = `(${message.timestamp})`;

  messageElement.appendChild(usernameElement);
  messageElement.appendChild(textElement);
  messageElement.appendChild(timestampElement);

  return messageElement;
}