class EnemyBullet {
	constructor(x=0, y=0, type=1, map) {
		x -= 10; // half of bullet size
		y -= 60;

		this.positionX = x;
		this.positionY = y;
		this.isEnabled = true;
		this.map = map;

		this.element = this.createElement(x, y, type);
		this.map.appendChild(this.element);
	}

	createElement(x=0, y=0, type=1) {
		let element = document.createElement('div');
		element.setAttribute('class', 'game-enemy-bullet game-enemy-bullet' + type);
		element.style.left = x + 'px';
		element.style.bottom = y + 'px';

		return element;
	}

	move(y) {
		let speed = 1;

		this.positionY -= speed * y;

		let bulletHeight = this.element.getBoundingClientRect().height;
		let mapHeight = this.map.getBoundingClientRect().height;

		if (this.positionY < 0) {
			this.isEnabled = false;
			this.element.remove();
		}

		this.element.style.bottom = this.positionY + 'px';
	}

	update(delta) {
		this.move(delta);
	}
}


class Enemy {
	constructor(type, map) {
		let mapWidth = map.getBoundingClientRect().width-60;
		let mapHeight = map.getBoundingClientRect().height;

		let x =  Math.floor(Math.random() * mapWidth);
		let y = mapHeight-150;

		this.positionX = x;
		this.positionY = y;
		this.isEnabled = true;
		this.map = map;
		this.type = type;
		this.bullets = [];
		this.killPlayer = false;

		this.element = this.createElement(x, y, type);
		this.map.appendChild(this.element);
	}

	createElement(x=0, y=0, type=1) {
		let element = document.createElement('div');
		element.setAttribute('class', 'game-enemy game-enemy' + type);
		element.style.left = x + 'px';
		element.style.bottom = y + 'px';

		return element;
	}

	move(x, y) {
		let speed = 1;

		if (Math.floor(Math.random() * 3) == 2)
			this.positionX -= speed * x;
		else
			this.positionX += speed * x;

		this.positionY = speed * y;

		let enemyWidth = this.element.getBoundingClientRect().width;
		let mapHeight = this.map.getBoundingClientRect().height;

		if (this.positionX < 0)
			this.positionX = 0
		else if (this.positionX > mapHeight-enemyWidth)
			this.positionX = mapHeight-enemyWidth;

		if (this.positionY < 0)
			this.killPlayer = true;

		this.element.style.left = this.positionX + 'px';
	}

	shoot() {
		let enemyWidth = this.element.getBoundingClientRect().width;
		let enemyHeight = this.element.getBoundingClientRect().height;

		let bullet = new EnemyBullet(this.positionX+enemyWidth/2, this.positionY, this.type, this.map);
		this.bullets.push(bullet);
	}

	update(delta) {
		this.move(delta, delta);

		for (let i in this.bullets)
			this.bullets[i].update(delta);

		if (Math.floor(Math.random() * 20) == 4)
			this.shoot();
	}
}

class PlayerBullet {
	constructor(x=0, y=0, map) {
		x -= 5; // half of bullet size

		this.positionX = x;
		this.positionY = y;
		this.isEnabled = true;
		this.map = map;

		this.element = this.createElement(x, y);
		this.map.appendChild(this.element);
	}

	createElement(x=0, y=0) {
		let element = document.createElement('div');
		element.setAttribute('class', 'game-player-bullet');
		element.style.left = x + 'px';
		element.style.bottom = y + 'px';

		return element;
	}

	move(y) {
		let speed = 1;

		this.positionY += speed * y;

		let bulletHeight = this.element.getBoundingClientRect().height;
		let mapHeight = this.map.getBoundingClientRect().height;

		if (this.positionY > mapHeight-bulletHeight) {
			this.isEnabled = false;
			this.element.remove();
		}

		this.element.style.bottom = this.positionY + 'px';
	}

	update(delta) {
		this.move(delta);
	}
}

class Player {
	constructor(x=0, y=0, map) {
		this.positionX = x;
		this.positionY = y;
		this.isAlive = true;
		this.map = map;
		this.bullets = [];

		this.element = this.createElement(x, y);
		this.map.appendChild(this.element);
	}

	createElement(x=0, y=0) {
		let element = document.createElement('div');
		element.setAttribute('id', 'game-player');
		element.style.left = x + 'px';
		element.style.bottom = y + 'px';

		return element;
	}

	move(x, y) {
		let speed = 10;

		this.positionX += speed * x;
		this.positionY += speed * y;

		let playerWidth = this.element.getBoundingClientRect().width;
		let playerHeight = this.element.getBoundingClientRect().height;

		let mapWidth = this.map.getBoundingClientRect().width;
		let mapHeight = this.map.getBoundingClientRect().height;

		if (this.positionX < 0)
			this.positionX = 0;
		else if (this.positionX > mapWidth-playerWidth)
			this.positionX = mapWidth-playerWidth;

		if (this.positionY < 0)
			this.positionY = 0;
		else if (this.positionY > mapHeight-playerHeight)
			this.positionY = mapHeight-playerHeight;


		this.element.style.left = this.positionX + 'px';
		this.element.style.bottom = this.positionY + 'px';
	}

	shoot() {
		let playerWidth = this.element.getBoundingClientRect().width;
		let playerHeight = this.element.getBoundingClientRect().height;

		let bullet = new PlayerBullet(this.positionX+playerWidth/2, this.positionY+playerHeight, this.map);
		this.bullets.push(bullet);
	}

	update(delta) {
		for (let i in this.bullets)
			this.bullets[i].update(delta);
	}
}

class Game {
	constructor() {
		this.map = document.getElementById('game-map');
		this.isActive = true;

		let mapSize = this.map.getBoundingClientRect();
		this.player = new Player(mapSize.width/2, 10, this.map);

		this.enemies = [];

		this.setHandlers();
	}

	setHandlers() {
		// document.getElementById('game-button-left').onclick  = () => {this.player.move(-1, 0);}
		// document.getElementById('game-button-up').onclick    = () => {this.player.move(0, 1);}
		// document.getElementById('game-button-right').onclick = () => {this.player.move(1, 0);}
		// document.getElementById('game-button-down').onclick  = () => {this.player.move(0, -1);}

		document.onkeydown = (e) => {
			e = e || window.event;

			if (e.keyCode == '37') // Left
				this.player.move(-1, 0);
			else if (e.keyCode == '38') // Up
				this.player.move(0, 1);
			else if (e.keyCode == '39') // Right
				this.player.move(1, 0);
			else if (e.keyCode == '40') // Down
				this.player.move(0, -1);
			else if (e.keyCode == '32') // Space
				this.player.shoot();
		}
	}

	update(delta) {
		this.player.update(delta);

		for (let i in this.enemies)
			this.enemies[i].update(delta);

		if (this.enemies.length < 15 && Math.floor(Math.random() * 15) == 4) {
			let type = Math.floor(Math.random() * 4);
			this.enemies.push(new Enemy(type, this.map));
		}
	}

	start() {
		let timer = setInterval(() => {
			this.update(1000/100);
			if (!this.isActive) {
				clearInterval(timer);

			}
		}, 200);
	}

	clear() {
		
	}
}

document.addEventListener("DOMContentLoaded", () => {
	let start = document.getElementById('start-button');

	start.onclick = () => {
		document.getElementById('start').style.display = 'none';
		document.getElementById('game').style.display = 'flex';

		let game = new Game();
		game.start();
	}
});