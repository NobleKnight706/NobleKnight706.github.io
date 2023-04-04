const chatbox = document.getElementById('chatbox');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const submitButton = document.getElementById('submit');

// WebSocket connection
const socket = new WebSocket('wss://noblesocket.onrender.com');

socket.addEventListener('open', (event) => {
  console.log('WebSocket connection established');
	const messageElement = createMessageElement("Connected to servers.");
  chatbox.appendChild(messageElement)
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
  const messageElement = createMessageElement(message);
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
});

let canSendMessage = true;

submitButton.addEventListener('click', (event) => {
  if (canSendMessage) {
    const username = usernameInput.value;
    const messageText = messageInput.value;

    if (username.length <= 20 && messageText) {
      const message = {
        username,
        messageText,
        timestamp: new Date().toLocaleTimeString(),
      };

      socket.send(JSON.stringify(message));
      messageInput.value = "";
      // Display message on sender's screen
      const messageElement = createMessageElement(message);
      chatbox.appendChild(messageElement);
      chatbox.scrollTop = chatbox.scrollHeight;

      // Disable submit button
      submitButton.disabled = true;
      canSendMessage = false;
      setTimeout(() => {
        submitButton.disabled = false;
        canSendMessage = true;
      }, 1000);
    }
  }
});

messageInput.addEventListener('keypress', (event) => {
	const username = usernameInput.value;
    const messageText = messageInput.value;
if((username.length <= 20 && messageText)){
  if (event.key === "Enter") {
    // Simulate button click
    submitButton.click();
  }
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
window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();

document.onselectstart = function() {
  return false;
};
var c = document.querySelector("canvas")

var ctx = c.getContext('2d');
var dpr = window.devicePixelRatio;
var cw = window.innerWidth;
var ch = window.innerHeight;
c.width = cw * dpr;
c.height = ch * dpr;
ctx.scale(dpr, dpr);
var rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);}
ctx.lineCap = 'round';
var orbs = [];
var orbCount = 3000;
var radius;


var trail = true

function createOrb(mx,my){
  var dx = (cw/2) - mx;
	var dy = (ch/2) - my;
	var dist = Math.sqrt(dx * dx + dy * dy);
	var angle = Math.atan2(dy, dx);
	orbs.push({
		x: mx,
		y: my,
		lastX: mx,
		lastY: my,
		hue: 0,
		colorAngle: 0,
		angle: angle + Math.PI/2,
		//size: .5+dist/250,
		size: rand(1,3)/2,
		centerX: cw/2,
		centerY: ch/2,		
		radius: dist,
		speed: (rand(5,10)/1000)*(dist/750)+.015 * 0.15,
		alpha: 1 - Math.abs(dist)/cw,
		draw: function() {			
			ctx.strokeStyle = 'hsla('+this.colorAngle+',100%,50%,1)';	
			ctx.lineWidth = this.size;			
			ctx.beginPath();
			ctx.moveTo(this.lastX, this.lastY);
			ctx.lineTo(this.x, this.y);
			ctx.stroke();
		},	
		update: function(){
			var mx = this.x;
			var my = this.y;	
			this.lastX = this.x;
			this.lastY = this.y;
			var x1 = cw/2;
			var y1 = ch/2;
			var x2 = mx;
			var y2 = my;		
			var rise = y1-y2;
			var run = x1-x2;
			var slope = -(rise/run);
			var radian = Math.atan(slope);
			var angleH = Math.floor(radian*(180/Math.PI));		
			if(x2 < x1 && y2 < y1){angleH += 180;}		
			if(x2 < x1 && y2 > y1){angleH += 180;}		
			if(x2 > x1 && y2 > y1){angleH += 360;}		
			if(y2 < y1 && slope =='-Infinity'){angleH = 90;}		
			if(y2 > y1 && slope =='Infinity'){angleH = 270;}		
			if(x2 < x1 && slope =='0'){angleH = 180;}
			if(isNaN(angleH)){angleH = 0;}
			
			this.colorAngle = angleH;
			this.x = this.centerX + Math.sin(this.angle*-1) * this.radius;
			this.y = this.centerY + Math.cos(this.angle*-1) * this.radius;
			this.angle += this.speed;
		
		}
	});
}

function orbGo(e){
	var mx = e.pageX - c.offsetLeft;
	var my = e.pageY - c.offsetTop;		
	createOrb(mx,my);
}

function turnOnMove(){
	c.addEventListener('mousemove', orbGo, false);	
}

function turnOffMove(){
	c.removeEventListener('mousemove', orbGo, false);	
}

function toggleTrails(){
	trail = true
}

function clear(){
 orbs = []; 
}

c.addEventListener('mousedown', orbGo, false);
c.addEventListener('mousemove', turnOnMove, false);
c.addEventListener('mouseup', turnOffMove, false);

var count = 100;
while(count--){
		createOrb(cw/2, ch/2+(count*2));
}

var loop = function(){
  window.requestAnimFrame(loop);
	if(trail){
		ctx.fillStyle = 'rgba(0,0,0,.1)';
		ctx.fillRect(0,0,cw,ch);
	} else {
		ctx.clearRect(0,0,cw,ch);
	}
	var i = orbs.length;
	while(i--){	
		var orb = orbs[i];	
		var updateCount = 3;
		while(updateCount--){
		orb.update();		
		orb.draw(ctx);
		}
		
	}
}
            
loop();
