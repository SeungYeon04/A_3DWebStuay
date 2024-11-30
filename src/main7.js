import * as THREE from 'three';
import './style.css'
import { OrbitControls, GLTFLoader } from 'three/addons/Addons.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';

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
    camera.position.set(0, 1.6, 1.5); 
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
    this._controls.target.set(0, 1, 0); 
    this._controls.enableDamping = true; 
  }

  _setupModel() {
    const Loader = new GLTFLoader(); 
    Loader.load("./character.glb", (gltf) => {
      this._scene.add(gltf.scene); 
      
      console.log(gltf.animations); 
      const animationNames = gltf.animations.map(
        (animation) => animation.name
      ); 
      console.log(animationNames); 

      const gui = new GUI(); 
      const prop = { 
        animationName: animationNames[0], 
      }
      gui.add(prop, "animationName", animationNames).onChange((v)=> {
        console.log(v); 
        play(v); 
      }); 

      this._mixer = new THREE.AnimationMixer(gltf.scene); //믹서해주는 거 선언 

      const play = (animationName) => {
        if(this._currentAction) {
          //this._currentAction.stop(); //갑자기 멈춤 
          this._currentAction.fadeOut(0.5); //서서히 멈춤 
        }
          console.log(animationName + " 애니메이션을 플레이해보자"); 
          const i = animationNames.indexOf(animationName); 
          const clip = gltf.animations[i]; 
          const action = this._mixer.clipAction(clip); 

          action.reset().fadeIn(0.5).play(); 
          this._currentAction = action; 
      };
      play(prop.animationName); 
    }); 
  }

  update(){
    const delta = this._clock.getDelta(); 
    if(this._mixer) {
      this._mixer.update(delta); 
    }
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