import * as THREE from 'three';
import './style.css'
import { OrbitControls } from 'three/addons/Addons.js';

class App {

  constructor() {
    this._setupThreeJs(); 
    this._setupCamera(); 
    this._setupLight(); 
    this._setupModel(); 
    this._setControls(); 
    this._setupEvent(); 
  }

  _setupThreeJs() {
    const divContainer = document.querySelector('#app');
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    divContainer.appendChild(renderer.domElement);
    this._divContainer = divContainer; 

    this._renderer = renderer;

    // Scene - 장면
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#2c6e50");  // scene의 배경색을 청록색으로
    this._scene = scene;
  }

  _setupCamera() { //카메라 
    const width = window.innerWidth; 
    const height = window.innerHeight; 
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100); //60화각이 작을수록 외곡이 적다 
    camera.position.set(25, 1, 3.5); 
    this._camera = camera; 
  }

  _setupLight() { //빛 - 조명
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
    directionalLight.position.set(1, 1, 4); 
    this._scene.add(directionalLight); 
  }

  _setControls() { //터치해서 3D구경하기 위한 메서드 
    this._controls = new OrbitControls(
      this._camera, 
      this._renderer.domElement
    ); //카메라와 돔객체. 마우스 이용 이벤트 돔객체 
  }

  _setupModel() {
    const geometry_sun = new THREE.SphereGeometry(3); 
    const geometry_susung = new THREE.SphereGeometry(0.5); 
    const geometry_moon = new THREE.SphereGeometry(1); 
    const geometry_gigu = new THREE.SphereGeometry(0.9); 
    const geometry_mocsung = new THREE.SphereGeometry(1.9); 
    const geometry_tosung = new THREE.SphereGeometry(1.2); 
    const material_1 = new THREE.MeshStandardMaterial({color: "gray"}); 
    const material_2 = new THREE.MeshStandardMaterial({color: "red"}); 
    const material_3 = new THREE.MeshStandardMaterial({color: "blue", flatShading: true}); 
    const material_4 = new THREE.MeshStandardMaterial({color: "yellow"}); 


    const Sun = new THREE.Mesh(geometry_sun, material_2); 
    this._scene.add(Sun);
    this._sun = Sun;

    const Susung = new THREE.Mesh(geometry_susung, material_1); //선언 -> 모양,크기 + 색상 
    this._scene.add(Susung); //생성 
    Susung.position.x = 3.5; 
    this._gigu = Susung; //필드화 
    Sun.add(Susung);

    const Gigu = new THREE.Mesh(geometry_gigu, material_3); //선언 -> 모양,크기 + 색상 
    this._scene.add(Gigu); //생성 
    Gigu.position.x = 7; 
    this._gigu = Gigu; //필드화 
    Sun.add(Gigu); //부모요소 추가 

    const Gmesung = new THREE.Mesh(geometry_susung, material_4); //선언 -> 모양,크기 + 색상 
    this._scene.add(Gmesung); //생성 
    Gmesung.position.x = 5; 
    this._gigu = Gmesung; //필드화 
    Sun.add(Gmesung);

    const Hawsung = new THREE.Mesh(geometry_susung, material_2); //선언 -> 모양,크기 + 색상 
    this._scene.add(Hawsung); //생성 
    Hawsung.position.x = 9; 
    this._gigu = Hawsung; //필드화 
    Sun.add(Hawsung);

    const Mocsung = new THREE.Mesh(geometry_mocsung, material_4); 
    this._scene.add(Mocsung);
    Mocsung.position.x = 12; 
    this._moon = Mocsung; 
    Sun.add(Mocsung);

    const Tosung = new THREE.Mesh(geometry_tosung, material_4); 
    this._scene.add(Tosung);
    Tosung.position.x = 16; 
    this._moon = Tosung; 
    Sun.add(Tosung);

    const Chun = new THREE.Mesh(geometry_gigu, material_3); 
    this._scene.add(Chun);
    Chun.position.x = 18; 
    this._moon = Chun; 
    Sun.add(Chun);

    const Hea = new THREE.Mesh(geometry_gigu, material_3); 
    this._scene.add(Hea);
    Hea.position.x = 21; 
    this._moon = Hea; 
    Sun.add(Hea);

    //const Moon = new THREE.Mesh(geometry_moon, material_1); 
    //this._scene.add(Moon);
    //Moon.position.x = 30; 
    //this._moon = Moon; 
    //Sun.add(Moon);
  }

  update() {
    const delta = this._clock.getDelta();
    
    this._sun.rotation.y += delta;
    this._gigu.rotation.y += delta;
    this._moon.rotation.y += delta;
    this._controls.update();

  }
  
  render(){
    requestAnimationFrame(this.render.bind(this));
    
    this.update();
    this._renderer.render(this._scene, this._camera);
  }

  _setupEvent(){
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 100);
    });
    
    this._clock = new THREE.Clock();
    this.resize();
  }

  resize(){
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height; 
    this._camera.updateProjectionMatrix(); 
    
    this._renderer.setSize(width, height);
    this.render(); 
  }  
}

const app = new App();