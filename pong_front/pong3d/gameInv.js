import * as THREE from 'three';
import { TessellateModifier } from 'three/module/modifiers/TessellateModifier.js';
import { TextGeometry } from 'three/module/geometries/TextGeometry.js';
import { sleep, loadShader } from './utilsPong.js'

class GameInv {
	constructor(status, resolve,statusCallback, gameData, invited) {
		this.gltfLoader = gameData.gltfLoader;
		this.fontLoader = gameData.fontLoader;
		this.textureLoader = gameData.textureLoader;
		this.renderer = gameData.rendererGameLocal;
		this.loaded = gameData.loaded;
		this.camera = gameData.camera;
		this.appli = gameData.appli;
		this.invited = invited
		this.status = status;
		this.resolve = resolve;
		this.scene = gameData.sceneGameInv;
		this.directionalLight = gameData.directionalLight;
		this.directionalLight2 = gameData.directionalLight2;
		this.directionalLight3 = gameData.directionalLight3;
		this.directionalLight4 = gameData.directionalLight4;
		this.statusCallback = statusCallback;
		this.lastMessageSentTime = 0;
		this.messageInterval = 10;
		this.movement = new THREE.Vector3(0, 0, 0);
		this.speed = 0.4;
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
		this.cameraRotation = new THREE.Euler();
		this.controls = null;
		this.texture = null;
		this.uniforms = {
			amplitude: {value: 0.0},
		};
		this.itemTexture = this.textureLoader.load('/static/assets/cube/textures/Sphere_emissive.png');
		this.controls = gameData.controlsGameLocal;
		this.controls.rotateSpeed = -1;
		this.init()
	}
	
	waitForSocketNLoad(socket, callback){
		setTimeout(
			function () {
				if (socket.readyState === 1 && this.loaded.instance == 0) {
					if (callback != null){
						this.allLoaded();
					}
				} else {
					this.waitForSocketNLoad(socket, callback);
				}
	
			}.bind(this), 500);
	}

	allLoaded(){
		this.appli.appendChild(this.renderer.domElement);
		this.sendMessageToServer({event : "ready"});
		this.animate();
		this.update();
	}

	init() {
		this.socket = new WebSocket('wss://' + window.location.host +'/api/game/');
		this.socketInit(this.socket);
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
		this.fontLoader.load( '/static/fonts/default2.json', (font) => this.scoreInit(font))
		this.waitForSocketNLoad(this.socket, this.allLoaded);
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
		let geometry = new TextGeometry( `${this.p2Score}   ${this.p1Score}`, {
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

		const colors = new Float32Array( numFaces * 3 * 3 );
		const displacement = new Float32Array( numFaces * 3 * 3 );
		const color = new THREE.Color();
		for ( let f = 0; f < numFaces; f ++ ) {
			const index = 9 * f;
			const h = Math.random() * 0.17 + 0.25;
			const s = 1
			const l = 0.45;
			color.setHSL(h, s, l);
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
			this.status.status = 0;
	}

	socketInit(socket){
		socket.onopen = function(event) {
			console.log('WebSocket connection established');
		};
		
		this.socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			if (response.event == 'end'){
				console.log(response.event);
				this.status.status = 0;
			}
			else 
				this.data = response.data;
				if (this.data.p1Pos && this.data.p1Pos.length === 3)
					this.player1.position.set(this.data.p1Pos[0],this.data.p1Pos[1],this.data.p1Pos[2])
				if (this.data.ballPos && this.data.ballPos.length === 3)
					this.ball.position.set(this.data.ballPos[0], this.data.ballPos[1], this.data.ballPos[2])
				if (this.data.score && this.data.score.length === 2){
					if (this.p1Score + 1 == this.data.score[0])
						this.p1Score = this.data.score[0];
					if (this.p2Score + 1 == this.data.score[1])
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
	
	async animate() {
		if(this.explode == true){
			this.uniforms.amplitude.value = 1.0 * this.cycleScore
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
		this.camera.rotation.z += Math.PI;
		this.renderer.render(this.scene, this.camera);
		if (this.status['status'] === 1 || this.status['status'] === 2)
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
			await sleep(1500)
			if (this.p1Score < 5 && this.p2Score < 5)
				this.fontLoader.load( '/static/fonts/default2.json', (font) => this.scoreInit(font));
			this.explode = false;
			this.uniforms.amplitude.value = 0.0;
			this.cycleScore = 0.1
			this.sendMessageToServer({event : "ready"})
			this.goalP = false
		}
	}
	async update() {
		if (this.goalP == false){
			this.cameraRotation.copy(this.camera.rotation);
			this.laser.position.copy(this.ball.position);
			const laserVertices = this.laser.geometry.attributes.position;
			laserVertices.setXYZ(1, 0, 13 - this.ball.position.y, 0);
			laserVertices.needsUpdate = true;			
			const directionZ = new THREE.Vector3(0, 0, 1).applyEuler(this.cameraRotation);
			directionZ.y = 0;
			const directionX = new THREE.Vector3(1, 0, 0).applyEuler(this.cameraRotation);
			directionX.y = 0;
			if (this.moveUp)
				this.movement.sub(directionZ);
			if (this.moveDown)
				this.movement.add(directionZ);
			if (this.moveLeft)
				this.movement.sub(directionX);
			if (this.moveRight)
				this.movement.add(directionX);
			this.movement.normalize();
			this.movement.multiplyScalar(this.speed);
			this.player2.position.add(this.movement);
			if (!this.moveUp && !this.moveDown && !this.moveLeft && !this.moveRight)
				this.movement.set(0, 0, 0);
			this.data = {
				score: [this.p1Score, this.p2Score],
				ballPos: [this.ball.position.x, this.ball.position.y, this.ball.position.z],
				p1Pos: null,
				p2Pos: [this.player2.position.x,this.player2.position.y,this.player2.position.z],
				id: this.id,
			};
			this.sendMessageToServer({event : "move", data :this.data});
		}
		else
			await this.checkPoint();
		await sleep(18);
		if (this.status['status'] === 1 || this.status['status'] === 2)
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
			if (this.socket.readyState === WebSocket.OPEN){
				const jsonMessage = JSON.stringify(message);
				this.socket.send(jsonMessage);
				}
			});
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
		this.socket.close();
		this.appli = null;
		this.renderer = null;
		this.camera = null;
		this.controls = null;
		this.scene = null;
		this.directionalLight = null;
		this.directionalLight2 = null;
		this.directionalLight3 = null;
		this.clock = null;
		this.statusCallback(this.status)
		this.resolve(this.status);
	}
}
export default GameInv;
