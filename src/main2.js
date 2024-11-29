import * as THREE from 'three';
import './style.css'
import { OrbitControls } from 'three/addons/Addons.js';

class App {

  constructor() {
    this._setupThreeJs(); 
    this._setupCamera(); 
    this._setupLight(); 
    this._setupModel(); 
    this._setupEvent(); 
    this._setControls(); 
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
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100); 
    camera.position.z = 3; 
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
    const geometry = new THREE.SphereGeometry(0.5, 32, 2, THREE.MathUtils.degToRad(0),THREE.MathUtils.degToRad(360),THREE.MathUtils.degToRad(30)); 
    const fillMaterial = new THREE.MeshStandardMaterial({color: 0x515151});//material = MeshStandardMaterial가 기본 
    const cube = new THREE.Mesh(geometry, fillMaterial); // geometry와 material을 이용해 mesh 생성
    this._mesh = cube; // 나중에 애니메이션 등에서 사용할 수 있도록 필드화로 저장 

    // 박스에 라인 추가 
    const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe, lineMaterial);
    this._line = line;

    //그룹으로 묶기. 라인과 큐브를 한번에 움직이기 위해 //필드화 
    const group = new THREE.Group(); 
    group.add(this._mesh);
    group.add(this._line);
    this._scene.add(group);
    this._group = group; 
  }

  update(){
    const delta = this._clock.getDelta();
    this._mesh.rotation.y += delta * 0.5;
    this._line.rotation.y += delta * 0.5;
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