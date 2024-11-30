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
    camera.position.set(2, 2, 3.5); 
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
    const axishelper = new THREE.AxesHelper(3); 
    this._scene.add(axishelper); //z파랑 y초록 z빨강 
    this._axishelper = axishelper;
    axishelper.position.y = -1; 

    const material = new THREE.MeshStandardMaterial({color: "#aaaaaa"}); 
    const gromGround = new THREE.PlaneGeometry(5, 5); 
    const ground = new THREE.Mesh(gromGround, material); 
    this._scene.add(ground); //소환 
    ground.rotation.x = THREE.MathUtils.degToRad(-90); 
    ground.position.y = -1; 
    

    const geomBigSphere = new THREE.SphereGeometry(1, 32, 16,0, THREE.MathUtils.degToRad(360),0, THREE.MathUtils.degToRad(90)); 
    const bigSphere = new THREE.Mesh(geomBigSphere, material); 
    this._scene.add(bigSphere); //소환
    bigSphere.position.y = -1; 
  
    const geomSmallSphere = new THREE.SphereGeometry(0.2);
    const smallSphere = new THREE.Mesh(geomSmallSphere, material); 
    const smallSpherePivot = new THREE.Object3D(); 
    bigSphere.add(smallSpherePivot); //부모로 지정 
    smallSpherePivot.add(smallSphere); //자식으로 지정 
    smallSphere.position.x = -2; 
    smallSphere.position.y = 0.1; 

    this._smallSpherePivot = smallSpherePivot;
    this._smallSphere = smallSphere; 

    const cntItems = 8; 
    const geomTorus = new THREE.TorusGeometry(0.2, 0.1); 
    for(let i = 0; i < cntItems; i++){
      const torus = new THREE.Mesh(geomTorus, material); 
      const torusPivot = new THREE.Object3D(); 
      torusPivot.add(torus); 
      bigSphere.add(torusPivot); 
      torusPivot.rotation.y = THREE.MathUtils.degToRad(360) * i / cntItems; 
      torus.position.x = 2; //부모 -> 자식 기준으로 돈다 
    }
    
    
  }

  update() {
    const delta = this._clock.getDelta();
    
    this._smallSpherePivot.rotation.y += delta; 
    this._axishelper.rotation.y += delta; 
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