import * as THREE from 'three';
import { status } from './utilsPong.js';

class Menu {
	constructor(status ,resolve, statusCallback, gameData) {
		this.status = status
		this.loader = gameData.fontLoader;
		this.loaded = gameData.loaded;
		console.log(this.loaded);
		this.loadergl = gameData.gltfLoader;
		this.renderer = gameData.rendererMenu;
		this.camera = gameData.camera;
		this.scene = gameData.sceneMenu;
		this.resolve = resolve;
		this.statusCallback = statusCallback;
		this.directionalLight = gameData.directionalLight;
		this.directionalLight2 = gameData.directionalLight2;
		this.raycaster = gameData.raycaster;
		this.clock = gameData.clock;
		this.appli = gameData.appli
		this.parent = gameData.appliParent
		this.button = [];
		this.animMixer = null;
		this.load3D();
		this.controls = gameData.controlsMenu;
		this.init();
	}

	waitForSocketNLoad(){
		setTimeout(
			function () {
				if (this.loaded.instance == 0) {
						this.allLoaded();
				} else {
					console.log(this.loaded);
					this.waitForSocketNLoad();
				}
	
			}.bind(this), 500);
	}
	allLoaded(){
		this.appli.appendChild(this.renderer.domElement);
		this.update();
		this.animate();
	}
	init() {
		
		this.directionalLight.position.set(100, 100, 500).normalize();
		this.scene.add(this.directionalLight);
		this.directionalLight2.position.set(-100, 100, -500).normalize();
		this.scene.add(this.directionalLight2);
		this.camera.position.z = 500;
		this.selected = 0;
		this.mainButton = this.button[0];
		this.onResize = () => this.onWindowResize();
		this.keyD = (event) => this.onKeyDown(event);
		this.focus = () => this.onFocus();
		this.nfocus = () => this.notOnFocus()
		document.addEventListener('keydown', this.keyD);
		window.addEventListener('resize', this.onResize);
		this.waitForSocketNLoad()
	}

	createTxt(font){
		let i = 0;
		const color = [0x05FF00, 0x05FF00, 0xDADADA];
		const message = ["☢Matchmaking☢", "☢Tournament☢", "☢Training☢"]
		const yPos = [0, -100, -200] 
		while (i < 3){
			this.matDark = new THREE.LineBasicMaterial({
				color: color[i],
				side: 2
			});
			this.matLite = new THREE.MeshBasicMaterial({
				color: color[i],
				transparent: true,
				opacity: 0.9,
				side: 2
			});
			const shapes = font.generateShapes(message[i], 50);
			const geometry = new THREE.ShapeGeometry(shapes);
			geometry.computeBoundingBox();
			const center = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
			geometry.translate(center, 0, 0);
			this.text = new THREE.Mesh(geometry, this.matLite);
			geometry.dispose();
			this.text.position.z = 80;
			this.text.position.y = yPos[i];
			const holeShapes = [];
			for (let i = 0; i < shapes.length; i ++) {
				const shape = shapes[i];
				if (shape.holes && shape.holes.length > 0) {
					for (let j = 0; j < shape.holes.length; j ++) {
						const hole = shape.holes[j];
						holeShapes.push(hole);
					}
				}
			}
			shapes.push.apply(shapes, holeShapes);
			this.lineText = new THREE.Object3D();
			for (let i = 0; i < shapes.length; i ++) {
				const shape = shapes[i];
				const points = shape.getPoints();
				const geometry = new THREE.BufferGeometry().setFromPoints(points);
				geometry.translate(center, 0, 0);
				this.lineMesh = new THREE.Line(geometry, this.matDark);
				this.lineText.add(this.lineMesh);
				geometry.dispose();
			}
			this.lineText.position.set(0, 0, 40);
			this.lineText.position.y += i * 6;
			this.text.add(this.lineText);
			this.textContainer = new THREE.Object3D();
    		this.textContainer.add(this.text);
			this.button[i] = this.textContainer;
			this.scene.add(this.button[i]);
			i++;
		}
	}

	load3D () {
		
		//this.loadergl.load( '/cube/scene.gltf', (gltf) => {this.createobj(gltf)} );
		this.loader.load( '/static/pong3d/fonts/default2.json', (font) => { this.createTxt(font);});
	}
	async createobj (gltf) {
		this.animMixer = new THREE.AnimationMixer(gltf.scene);
		for (let i = 0; i < gltf.animations.length; i++) {
			const animation = gltf.animations[i];
			this.animMixer.clipAction(animation).play();
		}
		gltf.scene.scale.set(3, 3, 3);
		gltf.scene.rotation.set(0.7853982, 0.7853982, 0);
		gltf.scene.position.set(0, 200, 110);  
		this.scene.add(gltf.scene);
		this.renderer.render(this.scene, this.camera);
	}
	animate() {
		if (this.animMixer) {
			this.animMixer.update(this.clock.getDelta());
		}
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		if (this.status['status'] === 0)
			requestAnimationFrame(() => this.animate())
		else
			this.destroy();
	}
	select(buttonSelect){
		const size = 0.13;
		const sizeFreq = 0.1;
		const time = performance.now() * 0.1;
		const scaleValue = Math.sin(time * sizeFreq) * size + 1.0;
    	buttonSelect.scale.set(scaleValue, scaleValue, scaleValue);
	}

	update() {
		if(this.button[this.selected])
			this.select(this.button[this.selected]);
		if(this.status['status'] === 0)
			requestAnimationFrame(() => this.update())
	}

	onKeyDown(event) {
		console.log(event.keyCode)
		if (status.action == true){
			switch (event.keyCode) {
				case 83:
					if (this.selected == 2){
						this.mainButton = this.button[0];
						this.selected = 0;
					}
					else
						this.mainButton = this.button[++this.selected];
					break;
				case 87:
					if (this.selected == 0){
						this.selected = 2;
						this.mainButton = this.button[2];
					}
					else
						this.mainButton = this.button[--this.selected];
					break;
				case 13:
					this.stop()
					break;
			}
		}
	}
	destroy() {
		document.removeEventListener('keydown',this.keyD);
    	window.removeEventListener('resize',this.onResize);
		this.appli.removeChild(this.renderer.domElement);
		this.directionalLight.dispose();
		this.directionalLight2.dispose();
		this.scene.clear();
		this.matDark.dispose();
		this.matLite.dispose();
		this.button.forEach(mesh => {
			this.scene.remove(mesh);
			mesh.traverse(child => {
				if (child instanceof THREE.Mesh) {
					child.material.dispose();
				}
			});
		});
		this.appli = null;
    	this.renderer = null;
    	this.camera = null;
    	this.controls = null;
    	this.directionalLight = null;
    	this.directionalLight2 = null;
    	this.animMixer = null;
    	this.clock = null;
    	this.RGBELoad = null;
		this.loadergl = null;
    	this.loader = null;
    	this.RGBELoad = null;
		this.button.length = 0;
		this.statusCallback(this.status)
		this.resolve(this.status);
	}
	stop(){
		this.status = {
			status: this.selected+1
		};
	}
	onWindowResize() {
		this.camera.aspect = this.parent.clientWidth / this.parent.clientHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.parent.clientWidth, this.parent.clientHeight);
	}
	getStatus(){
		return this.status
	}
}
export default Menu;
