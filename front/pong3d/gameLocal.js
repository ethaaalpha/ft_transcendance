import * as THREE from 'three';
import { TessellateModifier } from 'three/module/modifiers/TessellateModifier.js';
import { TextGeometry } from 'three/module/geometries/TextGeometry.js';
import { sleep, loadShader, status } from '/static/pong3d/utilsPong.js'

class GameLocal {
	constructor(status, resolve, statusCallback, gameData, returnValue) {
		this.gltfLoader = gameData.gltfLoader;
		this.fontLoader = gameData.fontLoader;
		this.textureLoader = gameData.textureLoader;
		this.renderer = gameData.rendererGameLocal;
		this.loaded = gameData.loaded;
		this.camera = gameData.camera;
		this.appli = gameData.appli;
		this.status = status;
		this.resolve = resolve;
		this.scene = gameData.sceneGameLocal;
		this.directionalLight = gameData.directionalLight;
		this.directionalLight2 = gameData.directionalLight2;
		this.directionalLight3 = gameData.directionalLight3;
		this.directionalLight4 = gameData.directionalLight4;
		this.returnValue = returnValue
		this.statusCallback = statusCallback;
		this.movementP1 = new THREE.Vector3(0, 0, 0);
		this.movementP2 = new THREE.Vector3(0, 0, 0);
		this.speed = 0.4;
		this.speedBall = 0.2;
		this.cycleScore = 0.5;
		this.goalP = false;
		this.sign = true;
		this.explode = false;
		this.p1Score = 0;
		this.p2Score = 0;
		this.ballMovement = new THREE.Vector3(0, -0.2, 0);
		this.isCollision = false;
		this.cameraRotation = new THREE.Euler();
		this.uniforms = {
			amplitude: {value: 0.0},
		};
		this.itemTexture = this.textureLoader.load('/static/pong3d/assets/paddle.jpg');
		this.ballTexture = this.textureLoader.load('/static/pong3d/assets/cube/textures/Sphere_emissive.png');
		this.controls = gameData.controlsGameLocal;
		this.init()
			
	}

	allLoaded(){
		this.appli.appendChild(this.renderer.domElement);
		this.animate();
		this.lastTime = performance.now();
		this.update();
	}
	
	init() {
		this.camera.position.set(0, 0, 60);
		this.directionalLight.position.set(20, 0, 0).normalize();
		this.scene.add(this.directionalLight);
		this.directionalLight2.position.set(-20, 0, 0).normalize();
		this.scene.add(this.directionalLight2);
		this.directionalLight3.position.set(0, 13, 0).normalize();
		this.scene.add(this.directionalLight3);
		this.directionalLight4.position.set(0, -13, 0).normalize();
		this.scene.add(this.directionalLight4);
		this.ball = this.addBall(0, 0, 1, 1, 1, 0);
		this.player1 = this.addCube(0, -13, 4.5, 1.3, 4.5, 0, {transparent: false, map: this.itemTexture}, 0);
		this.player2 = this.addCube(0, 13, 4.5, 1.3, 4.5, 0, {transparent: false, map: this.itemTexture}, 0);
		this.walls = [
			this.addCube(15, 0, 1, 30, 29, 0, { color: 0x05ff00, transparent: true, opacity: 0}),
			this.addCube(0, 0, 31, 30, 1, 15, { color: 0x05ff00, transparent: true, opacity: 0}),
			this.addCube(0, 0, 31, 30, 1, -15, { color: 0x05ff00, transparent: true, opacity: 0}),
			this.addCube(-15, 0, 1, 30, 29, 0, { color: 0x05ff00, transparent: true, opacity: 0})
		];
		this.laser = this.createLaser();
		this.keyU = (event) => this.onKeyUp(event)
		this.keyD = (event) => this.onKeyDown(event)
		this.onResize = () => this.onWindowResize()
		document.addEventListener('keydown', this.keyD);
		document.addEventListener('keyup', this.keyU);
		window.addEventListener('resize',  this.onResize);
		this.load3d();
	}

	load3d(){
		this.gltfLoader.load( '/cub2/scene.gltf', (gltf) => {this.createobj(gltf)} );
		this.fontLoader.load( '/static/pong3d/fonts/default2.json', (font) => this.scoreInit(font))
		this.allLoaded()
	}

	async createobj (gltf) {
		this.animMixer = new THREE.AnimationMixer(gltf.scene);
		for (let i = 0; i < gltf.animations.length; i++) {
			const animation = gltf.animations[i];
			this.animMixer.clipAction(animation).play();
		}
		gltf.scene.scale.set(0.95, 0.95, 0.95);
		gltf.scene.rotation.set(0, 0, 0);
		gltf.scene.position.set(0, -19, 0);  
		this.scene.add(gltf.scene);
		this.renderer.render(this.scene, this.camera);
	}

	async scoreInit(font){
		if (this.score) {
			this.scene.remove(this.score);
			this.score.geometry.dispose();
			this.score.material.dispose();
			this.score = null;
		}
		let geometry = new TextGeometry( `${this.p1Score}   ${this.p2Score}`, {
			font: font,
			size: 40,
			height: 5,
			curveSegments: 5,
			bevelThickness: 5,
		} );
		geometry.center();
		const tessellateModifier = new TessellateModifier(4, 10);
		geometry = tessellateModifier.modify(geometry);
		const numFaces = geometry.attributes.position.count / 3;

		const colors = new Float32Array(numFaces * 3 * 3);
		const displacement = new Float32Array(numFaces * 3 * 3);
		const color = new THREE.Color();
		for (let f = 0; f < numFaces; f ++) {
			const index = 9 * f;
			const h = Math.random() * 0.17 + 0.25;
			const s = 1
			const l = 0.45;
			color.setHSL(h, s, l);
			const dx = Math.random() * 2 - 1;
			const dy = Math.random() * 2 - 1;
			const dz = Math.random() * 2 - 1;
			for (let i = 0; i < 3; i ++) {
				colors[index + ( 3 * i )] = color.r;
				colors[index + ( 3 * i ) + 1] = color.g;
				colors[index + ( 3 * i ) + 2] = color.b;
				displacement[index + ( 3 * i )] = dx;
				displacement[index + ( 3 * i ) + 1] = dy;
				displacement[index + ( 3 * i ) + 2] = dz;
			}
		}
		geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
		geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));
		const shaderMaterial = new THREE.ShaderMaterial({
		 	uniforms: this.uniforms,
		 	vertexShader: await loadShader('/static/pong3d/shader.vert'),
		 	fragmentShader: await loadShader('/static/pong3d/shader.frag'),
		});
		this.score = new THREE.Mesh(geometry, shaderMaterial);
		this.score.scale.set(0.5, 0.5, 0.5)
		this.scene.add(this.score);
		this.score.position.set(1, 27, 0);
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
		const material = new THREE.MeshBasicMaterial({map: this.ballTexture});
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

	
	checkCollisionWithP2(element, collision) {
		const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
		const elementBoundingBox = new THREE.Box3().setFromObject(element);
		collision = ballBoundingBox.intersectsBox(elementBoundingBox);
		if (collision && this.ballMovement.y > 0) {
			if (this.ball.position.y < 12 && this.ball.position.y > -12)
				this.ball.position.y = 11.5;
			this.ballMovement.set(0, this.ballMovement.y, 0);
			const relativeCollision = new THREE.Vector3();
			relativeCollision.subVectors(this.ball.position, element.position);
			const dotProduct = this.ballMovement.dot(relativeCollision);
			this.ballMovement.sub(relativeCollision.multiplyScalar(2 * dotProduct));
			this.ballMovement.reflect(relativeCollision.normalize());
			this.ballMovement.multiplyScalar 
			this.ballMovement.y *= -1;
			this.ballMovement.x *= -1;
			this.ballMovement.z *= -1;
			this.ballMovement.normalize();
			this.ballMovement.multiplyScalar(this.speedBall)
		}
	}

	checkCollisionWithP1(element, collision) {
		const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
		const elementBoundingBox = new THREE.Box3().setFromObject(element);
		collision = ballBoundingBox.intersectsBox(elementBoundingBox);
		if (collision && this.ballMovement.y < 0) {
			if (this.ball.position.y < 12 && this.ball.position.y > -12)
				this.ball.position.y = -12;
			this.ballMovement.set(0, this.ballMovement.y, 0);
			const relativeCollision = new THREE.Vector3();
			relativeCollision.subVectors(this.ball.position, element.position);
			const dotProduct = this.ballMovement.dot(relativeCollision);
			this.ballMovement.sub(relativeCollision.multiplyScalar(2 * dotProduct));
			this.ballMovement.reflect(relativeCollision.normalize());
			this.ballMovement.y *= -1;
			this.ballMovement.x *= -1;
			this.ballMovement.z *= -1;
			this.ballMovement.normalize();
			this.ballMovement.multiplyScalar(this.speedBall);
		}
	}
	
	checkCollisionTarget(element, axes , type) {
		const ballBoundingBox = new THREE.Box3().setFromObject(this.ball);
		const elementBoundingBox = new THREE.Box3().setFromObject(element);
		
		let testAxes;
		if (type == true)
			testAxes = axes < 0;
		else
			testAxes = axes > 0;
		const collision = ballBoundingBox.intersectsBox(elementBoundingBox);
		if (collision && testAxes) {
			axes *= -1;
		}
		return axes;
	}

	async animate() {
		if(this.explode == true){
			this.uniforms.amplitude.value = 1.0 * this.cycleScore;
			this.cycleScore += 7;
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
		this.renderer.render(this.scene, this.camera);
		if (this.status['status'] === 3)
			requestAnimationFrame(() => this.animate());
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
			this.explode = true;
			this.ballMovement.x = 0;
			this.ballMovement.z = 0;
			await sleep(1500)
			if (this.p1Score < 5 && this.p2Score < 5)
				this.fontLoader.load( '/static/pong3d/fonts/default2.json', (font) => this.scoreInit(font));
			this.lastTime = performance.now();
			this.explode = false;
			this.uniforms.amplitude.value = 0.0;
			this.cycleScore = 0.1

		}
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
		this.movementP1.multiplyScalar(this.deltaTime);
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
		this.movementP2.multiplyScalar(this.deltaTime);
		this.player2.position.add(this.movementP2);
		if (!this.moveUpP2 && !this.moveDownP2 && !this.moveLeftP2 && !this.moveRightP2) {
			this.movementP2.set(0, 0, 0);
		}
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

	async update() {
		const time = performance.now();
		let collision;
		this.cameraRotation.copy(this.camera.rotation);
		this.laser.position.copy(this.ball.position);
		const laserVertices = this.laser.geometry.attributes.position;
		laserVertices.setXYZ(1, 0, -13 - this.ball.position.y, 0);
		laserVertices.needsUpdate = true;
		this.ballMovement.x = this.checkCollisionTarget(this.walls[0], this.ballMovement.x, false);
		this.ballMovement.x = this.checkCollisionTarget(this.walls[3], this.ballMovement.x, true);
		this.ballMovement.z = this.checkCollisionTarget(this.walls[2], this.ballMovement.z, true);
		this.ballMovement.z = this.checkCollisionTarget(this.walls[1], this.ballMovement.z, false);
		this.moveBallY(collision);
		this.checkCollisionWithP1(this.player1, collision);
		this.checkCollisionWithP2(this.player2, collision);
		const directionZ = new THREE.Vector3(0, 0, 1).applyEuler(this.cameraRotation);
		directionZ.y = 0;
		const directionX = new THREE.Vector3(1, 0, 0).applyEuler(this.cameraRotation);
		directionX.y = 0;
		this.deltaTime = this.speed * ((time - this.lastTime) * 0.05);
  		this.lastTime = time;
		this.moveP1();
		this.moveP2();
		if (this.p1Score >= 5 || this.p2Score >= 5){
			this.status.status = 0
		}
		await this.checkPoint();
		await sleep(16);
		if (this.status['status'] === 3)
			requestAnimationFrame(() => this.update())
		else {
			await sleep(500);
			this.destroy()
		}
	}
	onKeyDown(event) {
		if (status.action == true){
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
	}

	onKeyUp(event) {
		if (status.action == true){
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
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	
	destroy() {
		document.removeEventListener('keydown',this.keyD);
		document.removeEventListener('keyup',this.keyU);
		window.removeEventListener('resize',this.onResize);
		this.appli.removeChild(this.renderer.domElement);
		this.scene.clear();
		this.appli = null;
		this.p1Score = 0;
		this.p2Score = 0;
		this.renderer = null;
		this.camera = null;
		this.controls = null;
		this.scene = null;
		this.directionalLight = null;
		this.directionalLight2 = null;
		this.directionalLight3 = null;
		this.clock = null;
		this.cameraRotation = null;
		this.statusCallback(this.status)
		this.resolve(this.status);
	}
}
export default GameLocal;
