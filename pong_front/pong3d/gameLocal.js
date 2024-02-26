import * as THREE from 'three';
import { OrbitControls } from 'three/module/controls/OrbitControls';

import { TessellateModifier } from 'three/module/modifiers/TessellateModifier.js';
import { TextGeometry } from 'three/module/geometries/TextGeometry.js';
import { FontLoader } from 'three/module/loaders/FontLoader.js';

let sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

async function loadShader(url) {
    const response = await fetch(url);
    return response.text();
}

class GameLocal {
	constructor(status, resolve, appli, scene, statusCallback) {
		this.appli = appli
		this.status = status;
		this.resolve = resolve;
		this.scene = scene;
		this.statusCallback = statusCallback
		this.messageInterval = 100
		this.movementP1 = new THREE.Vector3(0, 0, 0);
		this.movementP2 = new THREE.Vector3(0, 0, 0);
		this.speed = 0.8;
		this.speedBall = 0.25;
		this.player1 = null;
		this.player2 = null;
		this.p1Score = 0;
		this.p2Score = 0;
		this.ball = null;
		this.walls = [];
		this.laser = null;
		this.ballMovement = new THREE.Vector3(0, -1, 0);
		this.isCollision = null;
		this.cameraRotation = new THREE.Euler();
		this.controls = null;
		this.texture = null;
		this.uniforms = {
			time: {value: 0.0},
			amplitude: {value: 0.5},
		};
		this.directionalLight = new THREE.DirectionalLight(0x87CEEB, 10);
		this.directionalLight2 = new THREE.DirectionalLight(0x87CEEB, 10);
		this.textureLoader = new THREE.TextureLoader();
		this.itemTexture = this.textureLoader.load('static/assets/pokeball-texture.jpg');
		this.init().then(() => {
			this.appli.appendChild(this.renderer.domElement);
			this.animate();
			this.update();
		});
	}

	init() {
		return new Promise((resolve, reject) => {
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(window.innerWidth , window.innerHeight);
			this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableZoom = false;
			this.camera.position.z = 50;
			this.directionalLight.position.set(30, -20, 100).normalize();
			this.scene.add(this.directionalLight);
			this.directionalLight2.position.set(-30, 20, -100).normalize();
			this.scene.add(this.directionalLight2);
			this.ball = this.addBall(0, 0, 1, 1, 1, 0);
			this.player1 = this.addCube(0, -13, 5, 0.8, 5, 0, {transparent: false, map: this.itemTexture}, 0);
			this.player2 = this.addCube(0, 13, 5, 0.8, 5, 0, {transparent: false, map: this.itemTexture}, 0);
			this.walls = [
				this.addCube(15, 0, 1, 30, 29, 0, { color: 0xe4f2f7, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.1, depthTest: true}),
				this.addCube(0, 0, 31, 30, 1, 15, { color: 0xe4f2f7, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.1, depthTest: true}),
				this.addCube(0, 0, 31, 30, 1, -15, { color: 0xe4f2f7, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.1, depthTest: true}),
				this.addCube(-15, 0, 1, 30, 29, 0, { color: 0xe4f2f7, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.1, depthTest: true})
			];
			this.laser = this.createLaser();
			this.keyU = (event) => this.onKeyUp(event)
			this.keyD = (event) => this.onKeyDown(event)
			this.onResize = () => this.onWindowResize()
			document.addEventListener('keydown', this.keyD);
			document.addEventListener('keyup', this.keyU);
			window.addEventListener('resize',  this.onResize);
			this.load3d();
			resolve();
			});
	}

	load3d(){
		const loader = new FontLoader();
		loader.load( 'static/fonts/helvetiker_regular.typeface.json', (font) => this.scoreInit(font))
	}

	async scoreInit(font){
		let geometry = new TextGeometry( `${this.p1Score}  -  ${this.p2Score}`, {
			font: font,
			size: 40,
			height: 5,
			curveSegments: 5,
			bevelThickness: 5,
		} );
		geometry.center();
		const tessellateModifier = new TessellateModifier(10, 3);
		geometry = tessellateModifier.modify(geometry);
		const numFaces = geometry.attributes.position.count / 3;

		const colors = new Float32Array( numFaces * 3 * 3 );
		const displacement = new Float32Array( numFaces * 3 * 3 );
		const color = new THREE.Color();
		let table = [0.2, 0.5, 0.7, 0.9]
		for ( let f = 0; f < numFaces; f ++ ) {
			const index = 9 * f;
			const h = 80 * table[numFaces % 4];
			const s = table[numFaces % 4];
			const l = table[numFaces % 4];
			color.setHSL( h, s, l );
			const d = 0.7 * ( 0.8 - Math.random() );
			for ( let i = 0; i < 3; i ++ ) {
				colors[ index + ( 3 * i ) ] = color.r;
				colors[ index + ( 3 * i ) + 1 ] = color.g;
				colors[ index + ( 3 * i ) + 2 ] = color.b;
				displacement[ index + ( 3 * i ) ] = d;
				displacement[ index + ( 3 * i ) + 1 ] = d;
				displacement[ index + ( 3 * i ) + 2 ] = d;
			}
		}
		geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
		geometry.setAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
		//
		const shaderMaterial = new THREE.ShaderMaterial( {
		 	uniforms: this.uniforms,
		 	vertexShader: await loadShader('static/pong3d/shader.vert'),
		 	fragmentShader: await loadShader('static/pong3d/shader.frag'),
		});
		this.score = new THREE.Mesh(geometry, shaderMaterial);
		this.score.scale.set(0.5, 0.5, 0.5)
		this.scene.add(this.score);
		this.score.position.set(0, 22, 0);
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
		cube.scale.set(w, h, zsize);
		this.scene.add(cube);
		return cube;
	}

	createLaser() {
		const geometry = new THREE.BufferGeometry();
		const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

		const points = [];
		points.push(new THREE.Vector3(0, 0, 0));
		points.push(new THREE.Vector3(0, -13, 0));

		geometry.setFromPoints(points);

		const laser = new THREE.Line(geometry, material);
		this.scene.add(laser);
		return laser;
	}

	
	checkCollisionWithY(element, collision) {
		const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
		const elementBoundingBox = new THREE.Box3().setFromObject(element);
		
		collision = ballBoundingBox.intersectsBox(elementBoundingBox);
		if (collision) {
			this.ballMovement.set(0, this.ballMovement.y, 0);
			this.isCollision = element;
			const relativeCollision = new THREE.Vector3();
			relativeCollision.subVectors(this.ball.position, element.position);
			const dotProduct = this.ballMovement.dot(relativeCollision);
			this.ballMovement.sub(relativeCollision.multiplyScalar(2 * dotProduct));
			this.ballMovement.reflect(relativeCollision.normalize());
			this.ballMovement.multiplyScalar 
			this.ballMovement.y *= -1;
			this.ballMovement.x *= -1;
			this.ballMovement.z *= -1;
		}
	}
	
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
		this.ballMovement.normalize();
		this.ballMovement.multiplyScalar(this.speedBall);
		this.ball.position.add(this.ballMovement);
		while (this.isCollision) {
			const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
			const elementBoundingBox = new THREE.Box3().setFromObject(this.isCollision);
			collision = ballBoundingBox.intersectsBox(elementBoundingBox);
			if (!collision)
			this.isCollision = null;
		this.ball.position.add(this.ballMovement);
		}
	}

	async animate() {
		const time = Date.now() * 0.001;
		this.uniforms.amplitude.value = 1.0 + Math.sin(time * 0.5)
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		if (this.status['status'] === 2)
			requestAnimationFrame(() => this.animate());
	}

	moveP1(){
		const directionZ = new THREE.Vector3(0, 0, 1).applyEuler(this.cameraRotation);
		directionZ.y = 0;
		const directionX = new THREE.Vector3(1, 0, 0).applyEuler(this.cameraRotation);
		directionX.y = 0;
		if (this.moveUpP1) {
			this.movementP1.sub(directionZ);
		}
		if (this.moveDownP1) {
			this.movementP1.add(directionZ);
		}
		if (this.moveLeftP1) {
			this.movementP1.sub(directionX);
		}
		if (this.moveRightP1) {
			this.movementP1.add(directionX);
		}
		this.movementP1.normalize();
		this.movementP1.multiplyScalar(this.speed);
		this.player1.position.add(this.movementP1);
		if (!this.moveUpP1 && !this.moveDownP1 && !this.moveLeftP1 && !this.moveRightP1) {
			this.movementP1.set(0, 0, 0);
		}
	}

	moveP2(){
		const directionZ = new THREE.Vector3(0, 0, 1).applyEuler(this.cameraRotation);
		directionZ.y = 0;
		const directionX = new THREE.Vector3(1, 0, 0).applyEuler(this.cameraRotation);
		directionX.y = 0;
		if (this.moveUpP2) {
			this.movementP2.sub(directionZ);
		}
		if (this.moveDownP2) {
			this.movementP2.add(directionZ);
		}
		if (this.moveLeftP2) {
			this.movementP2.sub(directionX);
		}
		if (this.moveRightP2) {
			this.movementP2.add(directionX);
		}
		this.movementP2.normalize();
		this.movementP2.multiplyScalar(this.speed);
		this.player2.position.add(this.movementP2);
		if (!this.moveUpP2 && !this.moveDownP2 && !this.moveLeftP2 && !this.moveRightP2) {
			this.movementP2.set(0, 0, 0);
		}
	}

	async checkPoint(){
		let changed = false
		if (this.ball.position.y <= -13){
			this.p2Score++;
			this.ball.position.set(0, 0, 0);
			this.player1.position.set(0, -13, 0)
			this.player2.position.set(0, 13, 0)
			this.laser.position.copy(this.ball.position);
			changed = true
		}
		else if (this.ball.position.y >= 13){
			this.p1Score++;
			this.ball.position.set(0, 0, 0);
			this.player1.position.set(0, -13, 0)
			this.player2.position.set(0, 13, 0)
			this.laser.position.copy(this.ball.position);
			changed = true
		}
		if (changed){
			//updateScoreDisplay(this.p1Score, this.p2Score, this.hudScore);
			await sleep(1500)
		}
	}

	async update() {
		let collision;
		this.cameraRotation.copy(this.camera.rotation);
		this.laser.position.copy(this.ball.position);
		const laserVertices = this.laser.geometry.attributes.position;
		laserVertices.setXYZ(1, 0, -13 - this.ball.position.y, 0);
		laserVertices.needsUpdate = true;
		this.ballMovement.x = this.checkCollisionTarget(this.walls[0], this.ballMovement.x);
		this.ballMovement.x = this.checkCollisionTarget(this.walls[3], this.ballMovement.x);
		this.ballMovement.z = this.checkCollisionTarget(this.walls[2], this.ballMovement.z);
		this.ballMovement.z = this.checkCollisionTarget(this.walls[1], this.ballMovement.z);
		// this.ballMovement.y = this.checkCollisionTarget(this.targets[0], this.ballMovement.y);
		// this.ballMovement.y = this.checkCollisionTarget(this.targets[1], this.ballMovement.y);
		this.moveBallY(collision);
		this.checkCollisionWithY(this.player1, collision);
		this.checkCollisionWithY(this.player2, collision);
		await this.checkPoint();
		
		this.moveP1();
		this.moveP2();
		await sleep(16);
		if (this.status['status'] === 2)
			requestAnimationFrame(() => this.update())
	}
	onKeyDown(event) {
		console.log(event.code)
		switch (event.code) {
			case 'KeyW':
			case 'KeyZ':
				this.moveUpP1 = true;
				break;
			case 'KeyS':
				this.moveDownP1 = true;
				break;
			case 'KeyA':
			case 'KeyQ':
				this.moveLeftP1 = true;
				break;
			case 'KeyD':
				this.moveRightP1 = true;
				break;
			case 'ArrowUp':
				this.moveUpP2 = true;
				break;
			case 'ArrowDown':
				this.moveDownP2 = true;
				break;
			case 'ArrowLeft':
				this.moveLeftP2 = true;
				break;
			case 'ArrowRight':
				this.moveRightP2 = true;
				break;
		}
	}

	onKeyUp(event) {
		switch (event.code) {
			case 'KeyW':
			case 'KeyZ':
				this.moveUpP1 = false;
				break;
			case 'KeyS':
				this.moveDownP1 = false;
				break;
			case 'KeyA':
			case 'KeyQ':
				this.moveLeftP1 = false;
				break;
			case 'KeyD':
				this.moveRightP1 = false;
				break;
			case 'ArrowUp':
				this.moveUpP2 = false;
				break;
			case 'ArrowDown':
				this.moveDownP2 = false;
				break;
			case 'ArrowLeft':
				this.moveLeftP2 = false;
				break;
			case 'ArrowRight':
				this.moveRightP2 = false;
				break;
		}
	}

	async sendMessageToServer(message) {
		return new Promise((resolve, reject) => {
			const jsonMessage = JSON.stringify(message);
			this.socket.send(jsonMessage);
			//add error
			}
		);
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	destroy(){
		document.removeEventListener('keydown', this.keyD);
		document.removeEventListener('keyup', this.keyU);
		window.removeEventListener('resize',  this.onResize);
		this.statusCallback(this.status);
		this.resolve(this.status);
	}
}
export default GameLocal;
