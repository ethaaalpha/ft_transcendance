import * as THREE from 'three';
import './main.js'


class Menu {
	constructor() {
		this.animeId = null;
		this.updateId = null;
		this.status = 0;
		this.button = [];
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 8);
		this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
		this.animMixer = null;
		this.clock = new THREE.Clock();
		this.RGBELoad = null
		this.app = null;
		this.texture = null;
		this.unHideGame = false;
	}
	
	init(renderer, camera, controls, scene) {
		this.renderer = renderer;
		this.camera = camera;
		this.controls = controls;
		this.controls.enableZoom = false;
		this.scene = scene;
		this.app = app;
		this.directionalLight.position.set(100, 100, 500).normalize();
		this.scene.add(this.directionalLight);
		this.directionalLight2.position.set(-100, 100, -500).normalize();
		this.scene.add(this.directionalLight2);
		this.camera.position.z = 620;
		this.controls.minZoom = 1
		this.controls.maxZoom = 50
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.selected = 0;
		this.mainButton = this.button[0];

	}
	animate() {
		if (this.animMixer) {
			this.animMixer.update(this.clock.getDelta());
		}
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
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
	stop(){
		this.unHideGame = true;
		this.status = this.selected + 1;
		this.renderer.domElement.style.display = 'none';

		
	}
	getStatus(){
		return this.status
	}
	run (renderer, camera, controls, scene) {
		this.init(renderer, camera, controls, scene);
	}
}
const menu = new Menu();
export default menu;
