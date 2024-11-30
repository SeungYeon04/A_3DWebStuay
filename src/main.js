import * as THREE from 'three';
import './style.css'
import { OrbitControls, RGBELoader } from 'three/addons/Addons.js';

class App {

  constructor() {
    this._setupThreeJs(); 
    this._setupCamera(); 
    this._setupLight(); 
    this._setupModel(); 
    this._setupEvent(); 
    this._setupModel_map();
    this._setupModel_map2();
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

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 환경광 강도 증가
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // 직사광 강도 증가
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);
  }

  _setupCamera() { //카메라 
    const width = window.innerWidth; 
    const height = window.innerHeight; 
    const camera = new THREE.PerspectiveCamera(120, width / height, 0.1, 100); 
    camera.position.z = 3; 
    this._camera = camera; 
  }

  _setupLight() { //빛 - 조명
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("./small_harbour_sunset_1k.hdr", (env) => { 
        env.mapping = THREE.EquirectangularReflectionMapping; 
        this._scene.background = env; 
        this._scene.environment = env; 
    }); 
  }

  _setControls() { //터치해서 3D구경하기 위한 메서드 
    this._controls = new OrbitControls(
      this._camera, 
      this._renderer.domElement
    ); //카메라와 돔객체. 마우스 이용 이벤트 돔객체 
  }

  _setupModel() {
    
  }

  _setupModel_map() {
  }

  _setupModel_map2() {
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("./Glass_Window_002_basecolor.jpg");
    map.colorSpace = THREE.SRGBColorSpace; //RGB로 이미지색 그대로 표시


    const mapMetallic = textureLoader.load("./Glass_Window_002_metallic.jpg");
    const mapRoughness = textureLoader.load("./Glass_Window_002_roughness.jpg");
    const mapNormal = textureLoader.load("./Glass_Window_002_normal.jpg");
    const mapHeight = textureLoader.load("./Glass_Window_002_height.png");
    const mapAO = textureLoader.load("./Glass_Window_002_ambientOcclusion.jpg");
    const mapAlpha = textureLoader.load("./Glass_Window_002_opacity.jpg");

    const material = new THREE.MeshStandardMaterial({

    roughness: 0.1,  // 매끈한 효과
    metalness: 0.8,  // 금속성 증가

    map: map, 
    mapMetallic: mapMetallic,
    mapRoughness: mapRoughness,

    normalMap: mapNormal,

    displacementMap: mapHeight, // 돌출사진 
    displacementScale: 0.1,  
    displacementBias: -0.08,   
    normalScale: new THREE.Vector2(2, 2),  // 노말맵 강도 증가
    
    aoMap: mapAO,
    aoMapIntensity: 1.5,

    alphaMap: mapAlpha,
    transparent: true,
    
    side: THREE.DoubleSide,
  });

    const geomBox = new THREE.BoxGeometry(1.5, 1.5, 1.5); 
    const box = new THREE.Mesh(geomBox, material); 
    this._scene.add(box); 

    const loader = new THREE.SphereGeometry(1);
    const sphere = new THREE.Mesh(loader, material);
    sphere.position.x = 2;
    this._scene.add(sphere);
  }

  update(){
    
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