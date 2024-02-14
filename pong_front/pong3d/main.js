import * as THREE from 'three';
import { OrbitControls } from 'three/module/controls/OrbitControls';
import { FontLoader } from 'three/module/loaders/FontLoader';
import { GLTFLoader } from 'three/module/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/module/loaders/RGBELoader.js';
import menu from './menu.js'
import game from './game.js'



const toggleSwitch = document.getElementById('toggle');

  toggleSwitch.addEventListener('change', function() {
    if (this.checked) {
      // If toggle is on (checked), user is a host
      app.id = 'host';
      // Perform host-related actions here
    } else {
      // If toggle is off (unchecked), user is a guest
      app.id = 'guest';
      // Perform guest-related actions here
    }
  });

let sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

class App {
	constructor() {
		this.id = 'guest'
		this.lastFrameTime = performance.now();
		this.settings = null;
		this.status = 0;
		this.select = [];
		this.scenes = [new THREE.Scene(), new THREE.Scene()];
		this.RGBELoad = new RGBELoader().setPath('static/assets/');
		this.RGBELoad.load('witcher.hdr', (texture) => {this.load3D(texture)});
		this.init();
		this.animate();
		this.update();
		this.start();
		this.unhideGame = false;
	}
	init() {

		this.appli = document.querySelector('#app');
		if (!this.appli) {
			console.log("coucou");
		}
		this.renderer = [new THREE.WebGLRenderer(), new THREE.WebGLRenderer()];
		this.camera = [new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000), new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)];
		this.controls = [new OrbitControls(this.camera[0], this.renderer[0].domElement), new OrbitControls(this.camera[1], this.renderer[1].domElement)];
		this.renderer[0].setSize(window.innerWidth , window.innerHeight);
		this.renderer[1].setSize(window.innerWidth , window.innerHeight);
		this.appli.appendChild(this.renderer[0].domElement);
		this.appli.appendChild(this.renderer[1].domElement);
	}
	animate(){
		if (this.status == 0)
			this.animeId = requestAnimationFrame(() => menu.animate())
		else if (this.status == 1)
			game.animate()
		else if (this.status == 2){
			this.destroy()
			return ;}
		this.animeId = requestAnimationFrame(() => this.animate())

	}
	async update(){
		const currentTime = performance.now();
		this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
		this.lastFrameTime = currentTime;
		if (this.status == 0){
			menu.update()
			this.status = menu.getStatus();
			this.unhideGame = true;
		}
		else if (this.status == 1){
			if (this.unhideGame == true){
				this.renderer[1].domElement.style.display = 'initial';
				this.unhideGame == false
			}
			this.status = game.getStatus();
			game.update(this.deltaTime)
		}
		else if (this.status == 2)
			return;
		await sleep(16)
		this.updateId = requestAnimationFrame(() => this.update())
	}
	onKeyDown(event){
		if (this.status == 0)
			menu.onKeyDown(event);
		else if (this.status == 1)
			game.onKeyDown(event);
	}
	onKeyUp(event){
		if (this.status == 1)
			game.onKeyUp(event);
	}
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth/ 1.8, window.innerHeight / 1.8);
	}
	load3D (texture) {
		this.texture = texture;
		texture.mapping = THREE.EquirectangularReflectionMapping;
		this.scenes[0].background = texture;
		this.scenes[0].environment = texture;
		this.scenes[1].background = texture;
		this.scenes[1].environment = texture;
		const loadergl = new GLTFLoader().setPath( 'static/assets/' );
		loadergl.load( '/witcher/scene.gltf', (gltf) => {this.createobj(gltf)} );
		const loader = new FontLoader();
		loader.load( 'static/fonts/helvetiker_regular.typeface.json', (font) => { this.createTxt(font);});
	}
	createobj (gltf) {
		menu.animMixer = new THREE.AnimationMixer(gltf.scene);
		for (let i = 0; i < gltf.animations.length; i++) {
			const animation = gltf.animations[i];
			menu.animMixer.clipAction(animation).play();
		}
		gltf.scene.scale.set(80, 80, 80);
		gltf.scene.rotation.set(0, 4.7, 0);
		gltf.scene.position.set(0, 200, 20);  
		this.scenes[0].add(gltf.scene);
		this.renderer[0].render(this.scenes[0], this.camera[0]);
	}

	createTxt (font) {
		let i = 0;
		const color = 0xED7D31;
		const message = ["Play", "Setting", "Other"]
		const yPos = [0, -140, -280] 
		while (i < 3){
			const matDark = new THREE.LineBasicMaterial({
				color: color,
				side: 2
			});
			const matLite = new THREE.MeshBasicMaterial({
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
			const text = new THREE.Mesh(geometry, matLite);
			text.position.z = 80;
			text.position.y = yPos[i];
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
			const lineText = new THREE.Object3D();
			for (let i = 0; i < shapes.length; i ++) {
				const shape = shapes[i];
				const points = shape.getPoints();
				const geometry = new THREE.BufferGeometry().setFromPoints(points);
				geometry.translate(center, 0, 0);
				const lineMesh = new THREE.Line(geometry, matDark);
				lineText.add(lineMesh);
			}
			lineText.position.set(0, 0, 40);
			lineText.position.y += i * 6;
			text.add(lineText);
			const textContainer = new THREE.Object3D();
    		textContainer.add(text);
			menu.button[i] = textContainer;
			this.scenes[0].add(menu.button[i]);
			i++;
		}
	}
	destroy() {
		console.log("coucou")
        this.appli.removeChild(this.renderer[0].domElement);
    	this.appli.removeChild(this.renderer[1].domElement);
        this.renderer = null;
        this.camera = null;
        this.controls = null;
    }

	start() {
		document.addEventListener('keydown', (event) => this.onKeyDown(event));
		document.addEventListener('keyup', (event) => this.onKeyUp(event));
		document.addEventListener('resize',  () => this.onWindowResize());
		menu.run(this.renderer[0], this.camera[0], this.controls[0], this.scenes[0]);
		game.run(this.renderer[1], this.camera[1], this.controls[1], this.scenes[1], this.id);
	}
};
const app = new App();
