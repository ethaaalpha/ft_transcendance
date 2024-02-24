import * as THREE from 'three';
import { OrbitControls } from 'three/module/controls/OrbitControls';
import { FontLoader } from 'three/module/loaders/FontLoader';
import { GLTFLoader } from 'three/module/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';

class Menu {
	constructor(status, resolve, appli, scene, statusCallback) {
		this.status = status
		this.scene = scene
		this.resolve = resolve;
		this.statusCallback = statusCallback
		this.appli = appli
		this.button = [];
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 8);
		this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
		this.animMixer = null;
		this.clock = new THREE.Clock();
		this.app = null;
		this.load3D();
		this.init();
	}
	
	init() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth , window.innerHeight);
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.appli.appendChild(this.renderer.domElement);
		this.controls.enableZoom = false;
		this.directionalLight.position.set(100, 100, 500).normalize();
		this.scene.add(this.directionalLight);
		this.directionalLight2.position.set(-100, 100, -500).normalize();
		this.scene.add(this.directionalLight2);
		this.camera.position.z = 620;
		this.controls.minZoom = 1
		this.controls.maxZoom = 50
		this.raycaster = new THREE.Raycaster();
		this.selected = 0;
		this.mainButton = this.button[0];
		this.onResize = () => this.onWindowResize();
		this.keyD = (event) => this.onKeyDown(event);
		document.addEventListener('keydown', this.keyD);
		window.addEventListener('resize', this.onResize);
		this.update();
		this.animate();
	}

	createTxt (font) {
		let i = 0;
		const color = 0xED7D31;
		const message = ["Play", "Setting", "Other"]
		const yPos = [0, -140, -280] 
		while (i < 3){
			this.matDark = new THREE.LineBasicMaterial({
				color: color,
				side: 2
			});
			this.matLite = new THREE.MeshBasicMaterial({
				color: color,
				transparent: true,
				opacity: 0.6,
				side: 2
			});
			const shapes = font.generateShapes(message[i], 100);
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
		this.loadergl = new GLTFLoader().setPath( 'static/assets/' );
		this.loadergl.load( '/witcher/scene.gltf', (gltf) => {this.createobj(gltf)} );
		this.loader = new FontLoader();
		this.loader.load( 'static/fonts/helvetiker_regular.typeface.json', (font) => { this.createTxt(font);});
	}
	createobj (gltf) {
		this.animMixer = new THREE.AnimationMixer(gltf.scene);
		for (let i = 0; i < gltf.animations.length; i++) {
			const animation = gltf.animations[i];
			this.animMixer.clipAction(animation).play();
		}
		gltf.scene.scale.set(80, 80, 80);
		gltf.scene.rotation.set(0, 4.7, 0);
		gltf.scene.position.set(0, 200, 20);  
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
			case 65:
				this.moveLeft = true;
				break;
			case 68:
				this.moveRight = true;
				break;
			case 13:
				this.stop()
				break;
		}
	}
	destroy() {
		document.removeEventListener('keydown',this.keyD);
		console.log("coucou");
    	window.removeEventListener('resize',this.onResize);
		this.appli.removeChild(this.renderer.domElement);
		this.directionalLight.dispose();
		this.directionalLight2.dispose();
		this.renderer.dispose();
		this.controls.dispose();
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
    	this.animMixer = null;
    	this.clock = null;
    	this.RGBELoad = null;
    	this.app = null;
    	this.texture = null;
		this.loadergl = null;
    	this.loader = null;
    	this.RGBELoad = null;
		this.animMixer = null;
		this.button.length = 0;
		this.statusCallback(this.status)
		this.resolve(this.status);
	}
	stop(){
		this.status = {
			status: this.selected+1
		};
		console.log (this.status);
	}
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	getStatus(){
		return this.status
	}
}
export default Menu;
