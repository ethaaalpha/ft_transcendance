import * as THREE from 'three';
import menu from './menu.js'

class Game {
	constructor() {
		this.movement = new THREE.Vector3(0, 0, 0);
		this.speed = 0.3;
		this.speedBall = 1;
		this.player1 = null;
		this.player2 = null;
		this.ball = null;
		this.walls = [];
		this.targets = [];
		this.laser = null;
		this.ballMovement = new THREE.Vector3(0, -1, 0);
		this.isCollision = null;
		this.cameraRotation = new THREE.Euler();
		this.controls = null;
		this.texture = null;
		this.directionalLight = new THREE.DirectionalLight(0x87CEEB, 10);
		this.directionalLight2 = new THREE.DirectionalLight(0x87CEEB, 10);
		this.textureLoader = new THREE.TextureLoader();
		this.itemTexture = this.textureLoader.load('static/assets/pokeball-texture.jpg');
	}

	init(renderer, camera, controls, scene) {
		this.renderer = renderer;
		this.camera = camera;
		this.controls = controls;
		this.controls.enableZoom = false;
		this.scene = scene;
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
		this.targets = [
			this.addCube(0, 13.1, 29, 1, 29, 0, { color: 0xe4f2f7, transparent: true, opacity: 0, metalness: 0, roughness: 1, flatShading: true}),
			this.addCube(0, -13.1, 29, 1, 29, 0, { color: 0xe4f2f7, transparent: true, opacity: 0, metalness: 0, roughness: 1, flatShading: true})
		];
		this.laser = this.createLaser();
		this.renderer.domElement.style.display = 'none';
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

	animate() {
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
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
		console.log("Ball Movement After Collision:", this.ballMovement.x, this.ballMovement.y, this.ballMovement.z);
	}

	update() {
		let collision;
		this.cameraRotation.copy(this.camera.rotation);
		this.laser.position.copy(this.ball.position);
		const laserVertices = this.laser.geometry.attributes.position;
		laserVertices.setXYZ(1, 0, -13 - this.ball.position.y, 0);
		laserVertices.needsUpdate = true;
		this.checkCollisionWithY(this.player1, collision);
		this.checkCollisionWithY(this.player2, collision);
		this.ballMovement.x = this.checkCollisionTarget(this.walls[0], this.ballMovement.x);
		this.ballMovement.x = this.checkCollisionTarget(this.walls[3], this.ballMovement.x);
		this.ballMovement.z = this.checkCollisionTarget(this.walls[2], this.ballMovement.z);
		this.ballMovement.z = this.checkCollisionTarget(this.walls[1], this.ballMovement.z);
		this.ballMovement.y = this.checkCollisionTarget(this.targets[0], this.ballMovement.y);
		this.ballMovement.y = this.checkCollisionTarget(this.targets[1], this.ballMovement.y);
		this.moveBallY(collision);

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
		this.player1.position.add(this.movement);
		if (!this.moveUp && !this.moveDown && !this.moveLeft && !this.moveRight) {
			this.movement.set(0, 0, 0);
		}
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
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth/ 1.8, window.innerHeight / 1.8);
	}

	run(renderer, camera, controls, scenes) {
		this.init(renderer, camera, controls, scenes);
	}
}
const game = new Game()
export default game;
