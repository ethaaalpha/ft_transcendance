import * as THREE from 'three';
import { TessellateModifier } from 'three/module/modifiers/TessellateModifier.js';
import { TextGeometry } from 'three/module/geometries/TextGeometry.js';
import { FontLoader } from 'three/module/loaders/FontLoader.js';
import { sleep, loadShader } from './utilsPong.js'

class GameInv {
	constructor(status, resolve,statusCallback, gameData, invited) {
		this.renderer = gameData.rendererGameLocal;
		this.camera = gameData.camera;
		this.appli = gameData.appli;
		this.invited = invited
		this.status = status;
		this.resolve = resolve;
		this.scene = gameData.sceneGameInv;
		this.directionalLight = gameData.directionalLight;
		this.directionalLight2 = gameData.directionalLight2;
		this.statusCallback = statusCallback;
		this.lastMessageSentTime = 0;
		this.messageInterval = 10;
		this.movement = new THREE.Vector3(0, 0, 0);
		this.speed = 0.8;
		this.speedBall = 0.45;
		this.frame = 0;
		this.cycleScore = 0.5;
		this.sign = true
		this.explode = false;
		this.player1 = null;
		this.player2 = null;
		this.p1Score = 0;
		this.p2Score = 0;
		this.score = null;
		this.ball = null;
		this.walls = [];
		this.laser = null;
		this.ballMovement = new THREE.Vector3(0, -0.45, 0);
		this.isCollision = null;
		this.cameraRotation = new THREE.Euler();
		this.controls = null;
		this.texture = null;
		this.uniforms = {
			amplitude: {value: 0.0},
		};
		this.textureLoader = new THREE.TextureLoader();
		this.itemTexture = this.textureLoader.load('/static/assets/pokeball-texture.jpg');
		this.controls = gameData.controlsGameLocal;
		this.controls.rotateSpeed = -1;
		this.init().then(() => {
			this.appli.appendChild(this.renderer.domElement);
			this.animate();
			this.update();
		});
	}
	
	init() {
		return new Promise((resolve, reject) => {
			this.socket = new WebSocket('wss://' + window.location.host +'/api/game/');
			this.camera.position.set(0, 0, 60);
			this.directionalLight.position.set(0, -18, 0).normalize();
			this.scene.add(this.directionalLight);
			this.directionalLight2.position.set(0, 18, 0).normalize();
			this.scene.add(this.directionalLight2);
			this.ball = this.addBall(0, 0, 1, 1, 1, 0);
			this.player1 = this.addCube(0, -13, 5, 0.8, 5, 0, {transparent: false, map: this.itemTexture}, 0);
			this.player2 = this.addCube(0, 13, 5, 0.8, 5, 0, {transparent: false, map: this.itemTexture}, 0);
			this.walls = [
				this.addCube(15, 0, 1, 30, 29, 0, { color: 0x05ff00, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.1, depthTest: true}),
				this.addCube(0, 0, 31, 30, 1, 15, { color: 0x05ff00, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.1, depthTest: true}),
				this.addCube(0, 0, 31, 30, 1, -15, { color: 0x05ff00, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.1, depthTest: true}),
				this.addCube(-15, 0, 1, 30, 29, 0, { color: 0x05ff00, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.1, depthTest: true})
			];
			this.laser = this.createLaser();
			this.keyU = (event) => this.onKeyUp(event)
			this.keyD = (event) => this.onKeyDown(event)
			this.onResize = () => this.onWindowResize()
			document.addEventListener('keydown', this.keyD);
			document.addEventListener('keyup', this.keyU);
			window.addEventListener('resize',  this.onResize);
			this.load3d();
			this.socketInit(this.socket);
			resolve();
			});
	}

	load3d(){
		const loader = new FontLoader();
		loader.load( '/static/fonts/helvetiker_regular.typeface.json', (font) => this.scoreInit(font))
	}

	async scoreInit(font){
		if (this.score) {
			this.scene.remove(this.score);
			this.score.geometry.dispose();
			this.score.material.dispose();
			this.score = null;
		}
		let geometry = new TextGeometry( `${this.p2Score} - ${this.p1Score}`, {
			font: font,
			size: 40,
			height: 5,
			curveSegments: 5,
			bevelThickness: 5,
		} );
		geometry.center();
		const tessellateModifier = new TessellateModifier(0.8, 1500);
		geometry = tessellateModifier.modify(geometry);
		const numFaces = geometry.attributes.position.count / 3;

		const colors = new Float32Array( numFaces * 3 * 3 );
		const displacement = new Float32Array( numFaces * 3 * 3 );
		const color = new THREE.Color();
		for ( let f = 0; f < numFaces; f ++ ) {
			const index = 9 * f;
			const choice = Math.random();
			let r;
			if (choice <= 0.5)
				r = Math.random() * 0.05 + 0.335;
			else
				r = Math.random() * 0.05 + 0.075;
			const g = Math.random() * 0.1 + 0.9;
			const b = 0.5;
			color.setHSL(r, g, b);
			const dx = Math.random() * 2 - 1;
			const dy = Math.random() * 2 - 1;
			const dz = Math.random() * 2 - 1;
			for ( let i = 0; i < 3; i ++ ) {
				colors[ index + ( 3 * i ) ] = color.r;
				colors[ index + ( 3 * i ) + 1 ] = color.g;
				colors[ index + ( 3 * i ) + 2 ] = color.b;
				displacement[ index + ( 3 * i ) ] = dx;
				displacement[ index + ( 3 * i ) + 1 ] = dy;
				displacement[ index + ( 3 * i ) + 2 ] = dz;
			}
		}
		geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
		geometry.setAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
		//
		const shaderMaterial = new THREE.ShaderMaterial( {
		 	uniforms: this.uniforms,
		 	vertexShader: await loadShader('/static/pong3d/shader.vert'),
		 	fragmentShader: await loadShader('/static/pong3d/shader.frag'),
		});
		this.score = new THREE.Mesh(geometry, shaderMaterial);
		this.score.rotation.z += Math.PI;
		this.score.scale.set(0.5, 0.5, 0.5)
		this.scene.add(this.score);
		this.score.position.set(-1, -22, 0);
	}
	socketClose(event){
		console.log('WebSocket connection closed');
			this.status.status = 2;
	}

	socketInit(socket){
		socket.onopen = function(event) {
			console.log('WebSocket connection established');
		};
		
		this.socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			if (response.event == 'end'){
				this.status.status = 0;
			}
			else 
				this.data = response.data;
				if (this.data.p1Pos && this.data.p1Pos.length === 3)
					this.player1.position.set(this.data.p1Pos[0],this.data.p1Pos[1],this.data.p1Pos[2])
				if (this.data.ballPos && this.data.ballPos.length === 3)
					this.ball.position.set(this.data.ballPos[0], this.data.ballPos[1], this.data.ballPos[2])
				if (this.data.score && this.data.score.length === 2){
					this.p1Score = this.data.score[0];
					this.p2Score = this.data.score[1];
				}
				this.goalP = this.data.goalP
		};
		
		socket.onclose = (event) => this.socketClose(event);
		socket.onerror = (event) => this.socketClose(event);
	}

	addCube(x, y, w, h, zsize, z, color) {
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshStandardMaterial(color);
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(x, y, z);
		cube.scale.set(w, h, zsize);
		this.scene.add(cube);
		return cube;
	}

	addBall(x, y, w, h, zsize, z) {
		const geometry = new THREE.SphereGeometry(1, 10, 10, -1.5);
		const material = new THREE.MeshBasicMaterial({map: this.itemTexture});
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(x, y, z);
		cube.rotation.z += Math.PI;
		cube.scale.set(w, h, zsize);
		this.scene.add(cube);
		return cube;
	}

	createLaser() {
		const geometry = new THREE.BufferGeometry();
		const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

		const points = [];
		points.push(new THREE.Vector3(0, 0, 0));
		points.push(new THREE.Vector3(0, 13, 0));

		geometry.setFromPoints(points);

		const laser = new THREE.Line(geometry, material);
		this.scene.add(laser);
		return laser;
	}

	
	// checkCollisionWithY(element, collision) {
	// 	const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
	// 	const elementBoundingBox = new THREE.Box3().setFromObject(element);
		
	// 	collision = ballBoundingBox.intersectsBox(elementBoundingBox);
	// 	if (collision) {
	// 		this.ballMovement.set(0, this.ballMovement.y, 0);
	// 		this.isCollision = element;
	// 		const relativeCollision = new THREE.Vector3();
	// 		relativeCollision.subVectors(this.ball.position, element.position);
	// 		const dotProduct = this.ballMovement.dot(relativeCollision);
	// 		this.ballMovement.sub(relativeCollision.multiplyScalar(2 * dotProduct));
	// 		this.ballMovement.reflect(relativeCollision.normalize());
	// 		this.ballMovement.multiplyScalar 
	// 		this.ballMovement.y *= -1;
	// 		this.ballMovement.x *= -1;
	// 		this.ballMovement.z *= -1;
	// 	}
	// }
	
	checkCollisionTarget(element, axes) {
		const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
		const elementBoundingBox = new THREE.Box3().setFromObject(element);
		
		const collision = ballBoundingBox.intersectsBox(elementBoundingBox);
		if (collision && !this.isCollision) {
			this.isCollision = element;
			axes *= -1;
		}
		return axes;
	}
	
	moveBallY(collision) {
		// this.ballMovement.normalize();
		// this.ballMovement.multiplyScalar(this.speedBall);
		//this.ball.position.add(this.ballMovement);
		while (this.isCollision) {
			const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
			const elementBoundingBox = new THREE.Box3().setFromObject(this.isCollision);
			collision = ballBoundingBox.intersectsBox(elementBoundingBox);
			if (!collision)
				this.isCollision = null;
			//this.ball.position.add(this.ballMovement);
		}
	}

	async animate() {
		if(this.explode == true){
			this.uniforms.amplitude.value = 1.0 * this.cycleScore
			this.cycleScore += 0.1;
		}
		else{
			if (this.cycleScore >= 0.35)
				this.sign = false
			if(this.cycleScore <= 0.15)
				this.sign = true
			if (this.sign)
				this.cycleScore += 0.0025;
			else 
				this.cycleScore -= 0.0025;
			this.uniforms.amplitude.value = 1.0 * this.cycleScore
		}
		this.controls.update();
		this.camera.rotation.z += Math.PI;
		this.renderer.render(this.scene, this.camera);
		if (this.status['status'] === 1)
			requestAnimationFrame(() => this.animate());
		else
			this.destroy()
	}

	async checkPoint(){
		let changed = false
		if (this.goalP){
			this.player1.position.set(0, -13, 0)
			this.player2.position.set(0, 13, 0)
			this.laser.position.copy(this.ball.position);
			changed = true
		}
		if (changed){
			this.explode = true;
			this.ballMovement.x = 0;
			this.ballMovement.z = 0;
			await sleep(1500)
			this.load3d();
			this.explode = false;
			this.uniforms.amplitude.value = 0.0;
			this.cycleScore = 0.1
			this.sendMessageToServer({event : "ready"})
			this.goalP = false
		}
	}
	async update() {
		if (this.goalP == false){
			let collision;
			this.cameraRotation.copy(this.camera.rotation);
			this.laser.position.copy(this.ball.position);
			const laserVertices = this.laser.geometry.attributes.position;
			laserVertices.setXYZ(1, 0, 13 - this.ball.position.y, 0);
			laserVertices.needsUpdate = true;
			this.ballMovement.x = this.checkCollisionTarget(this.walls[0], this.ballMovement.x);
			this.ballMovement.x = this.checkCollisionTarget(this.walls[3], this.ballMovement.x);
			this.ballMovement.z = this.checkCollisionTarget(this.walls[2], this.ballMovement.z);
			this.ballMovement.z = this.checkCollisionTarget(this.walls[1], this.ballMovement.z);
			//this.moveBallY(collision);
			//this.checkCollisionWithY(this.player1, collision);
			//this.checkCollisionWithY(this.player2, collision);
			
			const directionZ = new THREE.Vector3(0, 0, 1).applyEuler(this.cameraRotation);
			directionZ.y = 0;
			const directionX = new THREE.Vector3(1, 0, 0).applyEuler(this.cameraRotation);
			directionX.y = 0;
			if (this.moveUp) {
				this.movement.sub(directionZ);
			}
			if (this.moveDown) {
				this.movement.add(directionZ);
			}
			if (this.moveLeft) {
				this.movement.sub(directionX);
			}
			if (this.moveRight) {
				this.movement.add(directionX);
			}
			this.movement.normalize();
			this.movement.multiplyScalar(this.speed);
			this.player2.position.add(this.movement);
			if (!this.moveUp && !this.moveDown && !this.moveLeft && !this.moveRight) {
				this.movement.set(0, 0, 0);
			}
			this.data = {
				score: [this.p1Score, this.p2Score],

				speedBall: this.speedBall,
				ballVec: [this.ballMovement.x, this.ballMovement.y, this.ballMovement.z],
				ballPos: [this.ball.position.x, this.ball.position.y, this.ball.position.z],
				p1Pos: null,
				p2Pos: [this.player2.position.x,this.player2.position.y,this.player2.position.z],
				id: this.id,
			};
			const currentTime = Date.now();
			if(currentTime - this.lastMessageSentTime >= this.messageInterval){
				this.sendMessageToServer({event : "move", data :this.data});
				this.lastMessageSentTime = currentTime;
			}
		}
		else
			await this.checkPoint();
		await sleep(16);
		if (this.status['status'] === 1)
			requestAnimationFrame(() => this.update())
	}
	onKeyDown(event) {
		switch (event.code) {
			case 'KeyW':
			case 'KeyZ':
				this.moveUp = true;
				break;
			case 'KeyS':
				this.moveDown = true;
				break;
			case 'KeyA':
			case 'KeyQ':
				this.moveLeft = true;
				break;
			case 'KeyD':
				this.moveRight = true;
				break;
		}
	}

	onKeyUp(event) {
		switch (event.code) {
			case 'KeyW':
			case 'KeyZ':
				this.moveUp = false;
				break;
			case 'KeyS':
				this.moveDown = false;
				break;
			case 'KeyA':
			case 'KeyQ':
				this.moveLeft = false;
				break;
			case 'KeyD':
				this.moveRight = false;
				break;
		}
	}

	async sendMessageToServer(message) {
		return new Promise((resolve, reject) => {
			const jsonMessage = JSON.stringify(message);
			this.socket.send(jsonMessage);
			}
		);
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	
	destroy() {
		document.removeEventListener('keydown',this.keyD);
		document.removeEventListener('keydown',this.keyU);
		window.removeEventListener('resize',this.onResize);
		this.appli.removeChild(this.renderer.domElement);
		this.scene.clear();
		this.socket.CLOSING;
		if (this.texture) {
			this.texture.dispose();
		}
		this.appli = null;
		this.renderer = null;
		this.camera = null;
		this.controls = null;
		this.scene = null;
		this.directionalLight = null;
		this.directionalLight2 = null;
		this.clock = null;
		this.RGBELoad = null;
		this.app = null;
		this.texture = null;
		this.loadergl = null;
		this.loader = null;
		this.RGBELoad = null;
		this.statusCallback(this.status)
		this.resolve(this.status);
	}
}
export default GameInv;
