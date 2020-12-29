//window onload//
window.onload = function() {
	document.addEventListener('keydown', changeDirection);
	setInterval(render, 1000/60);
}

//variables//
var canvas       = document.getElementById('canvas'),
	gameStart    = keyPressed = false,
	ctx          = canvas.getContext('2d'),
	directionX   = directionY = 0,
	positionX    = ~~(canvas.width) / 2,
	positionY    = ~~(canvas.height) / 2,
	playerWidth  = playerHeight = 20,
	appleWidth   = appleHeight  = 20,
	speed        = baseSpeed = 3,
	apples       = [],
	trail        = [],
	cooldown     = false,
	tail         = 100,
	safeZone     = playerWidth,
	score        = 0;

//game rendering//
function render() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	//logic//
	positionX += directionX;
	positionY += directionY;

	if(positionX > canvas.width){positionX = 0;};
	if(positionY > canvas.height){positionY = 0;};
	if(positionX + playerWidth < 0){positionX = canvas.width;};
	if(positionY + playerHeight < 0){positionY = canvas.height;};

	ctx.fillStyle = 'lime';
	for (let i = 0; i < trail.length; i++) {
		ctx.fillStyle = trail[i].color || 'lime';
		ctx.fillRect(trail[i].x, trail[i].y, playerWidth, playerHeight);
	}

	trail.push({x: positionX, y: positionY, color: ctx.fillStyle});

	if(trail.length > tail) {trail.shift();}
	if(trail.length > tail) {trail.shift();}

	if(trail.length >= tail && gameStart) {
		for (let i = trail.length - safeZone; i >= 0; i--) {
			if(positionX < (trail[i].x + playerWidth) && positionX + playerWidth > trail[i].x && positionY < (trail[i].y + playerHeight) && positionY + playerHeight > trail[i].y) {
				tail = playerWidth;
				score = 0;
				document.getElementById('score').innerHTML = score;
				speed = baseSpeed;
				for (let j = 0; j < trail.length; j++) {
					trail[j].color = 'red';
					if(j >= trail.length - tail){break;}
				}
			}
		}
	}

	//paint apple//
	for (let i = 0; i < apples.length; i++) {
		ctx.fillStyle = 'red';
		ctx.fillRect(apples[i].x, apples[i].y, appleWidth, appleHeight);
	}

	for(let i = 0; i < apples.length; i++) {
		if(positionX < (apples[i].x + playerWidth) && positionX + playerWidth > apples[i].x && positionY < (apples[i].y + playerHeight) && positionY + playerHeight > apples[i].y) {
			score +=1;
			document.getElementById('score').innerHTML = score;
			apples.splice(i, 1); 
			tail += 10;
			speed += 0;
			createApple();
			break;
		}
	}
}

//create new apple//
function createApple() {
	let newApple = {
		x: ~~(Math.random() * canvas.width),
		y: ~~(Math.random() * canvas.height),
		color: 'red'
	}

	if((newApple.x < appleWidth || newApple.x > canvas.width - appleWidth) || (newApple.y < appleHeight || newApple.y > canvas.height - appleHeight)) {
		createApple();
		return;
	}

	for(let i = 0; i < tail.length; i++) {
		if(newApple.x < (trail[i].x + playerWidth) || newApple.x + appleWidth > trail[i].x || newApple.y < (trail[i].y + playerHeight) || newApple.y + appleHeight > trail[i].y) {
			spawnApple();
			return;
		}
	}

	apples.push(newApple);

	if(apples.length < 500 && ~~(Math.random() * 1000) > 950) {
		createApple();
	}
}

function changeDirection(evt)
{
	if(!keyPressed && [37,38,39,40].indexOf(evt.keyCode) > -1) {
		setTimeout(function() {gameStart = true;}, 1000);
		keyPressed = true;
		createApple();
	}

	if(cooldown){return false;}

	if(evt.keyCode == 37 && !(directionX > 0)) {directionX = -speed; directionY = 0;}
	if(evt.keyCode == 38 && !(directionY > 0)) {directionX = 0; directionY = -speed;}
	if(evt.keyCode == 39 && !(directionX < 0)) {directionX = speed; directionY = 0;}
	if(evt.keyCode == 40 && !(directionY < 0)) {directionX = 0; directionY = speed;}

	cooldown = true;
	setTimeout(function() {cooldown = false;}, 100);
}