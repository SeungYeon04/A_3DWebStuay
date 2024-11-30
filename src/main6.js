import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import RAPIER from "@dimforge/rapier3d-compat";

class RapierDebugRenderer {
  constructor(scene, world) {
    this._world = world;
    this._mesh = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true })
    );
    this._mesh.frustumCulled = false;
    scene.add(this._mesh);
  }

  update() {
    const { vertices, colors } = this._world.debugRender();
    this._mesh.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    this._mesh.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 4)
    );
    this._mesh.visible = true;
  }
}

export default class App {
  constructor() {
    RAPIER.init().then(() => {
      const world = new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0));
      this._world = world;

      this._setupThreeJs();
      this._setupCamera();
      this._setupLight();
      this._setupControls();
      this._setupModel();
      this._setupEvents();

      this._debug = new RapierDebugRenderer(this._scene, this._world);
    });
  }

  _setupThreeJs() {
    const divContainer = document.querySelector("#app");
    this._divContainer = divContainer;
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color("#2c3e50"), 1);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    divContainer.appendChild(renderer.domElement);

    this._renderer = renderer;
    const scene = new THREE.Scene();
    this._scene = scene;
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 2, 20);
    this._camera = camera;
  }

  _setupLight() {
    const light1 = new THREE.SpotLight(undefined, Math.PI * 10);
    light1.position.set(2.5, 5, 5);
    light1.angle = Math.PI / 3;
    light1.penumbra = 0.5;
    light1.castShadow = true;
    light1.shadow.blurSamples = 10;
    light1.shadow.radius = 5;
    this._scene.add(light1);

    const light2 = light1.clone();
    light2.position.set(-2.5, 5, 5);
    this._scene.add(light2);
  }

  _setupModel() {
    const dynamicBodies = [];
    this._dynamicBodies = dynamicBodies;

    const material = new THREE.MeshStandardMaterial({
      metalness: 0.5,
      roughness: 0,
    });

    // Cuboid Collider
    const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    cubeMesh.castShadow = true;
    this._scene.add(cubeMesh);
    const cubeBody = this._world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(-5, 5, 0).setCanSleep(false)
    );
    const cubeShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      .setMass(1)
      .setRestitution(1.1);
    this._world.createCollider(cubeShape, cubeBody);
    dynamicBodies.push([cubeMesh, cubeBody]);

    // Ball Collider
    const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(), material);
    sphereMesh.castShadow = true;
    this._scene.add(sphereMesh);
    const sphereBody = this._world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(-2.5, 5, 0)
        .setCanSleep(false)
    );
    const sphereShape = RAPIER.ColliderDesc.ball(1)
      .setMass(1)
      .setRestitution(1.1);
    this._world.createCollider(sphereShape, sphereBody);
    dynamicBodies.push([sphereMesh, sphereBody]);

    // Cylinder Collider
    const cylinderMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 2, 16),
      material
    );
    cylinderMesh.castShadow = true;
    this._scene.add(cylinderMesh);
    const cylinderBody = this._world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setCanSleep(false)
    );
    const cylinderShape = RAPIER.ColliderDesc.cylinder(1, 1)
      .setMass(1)
      .setRestitution(1.1);
    this._world.createCollider(cylinderShape, cylinderBody);
    dynamicBodies.push([cylinderMesh, cylinderBody]);

    // ConvexHull Collider
    const icosahedronMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(),
      material
    );
    icosahedronMesh.castShadow = true;
    this._scene.add(icosahedronMesh);
    const icosahedronBody = this._world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(2.5, 5, 0)
        .setCanSleep(false)
    );
    const points = new Float32Array(
      icosahedronMesh.geometry.attributes.position.array
    );
    const icosahedronShape = RAPIER.ColliderDesc.convexHull(points)
      .setMass(1)
      .setRestitution(1.1);
    this._world.createCollider(icosahedronShape, icosahedronBody);
    dynamicBodies.push([icosahedronMesh, icosahedronBody]);

    // Trimesh Collider
    const torusKnotMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(),
      material
    );
    torusKnotMesh.castShadow = true;
    this._scene.add(torusKnotMesh);
    const torusKnotBody = this._world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(5, 5, 0).setCanSleep(false)
    );
    const vertices = new Float32Array(
      torusKnotMesh.geometry.attributes.position.array
    );
    let indices = new Uint32Array(torusKnotMesh.geometry.index.array);
    const torusKnotShape = RAPIER.ColliderDesc.trimesh(vertices, indices)
      .setMass(1)
      .setRestitution(1.1);
    this._world.createCollider(torusKnotShape, torusKnotBody);
    dynamicBodies.push([torusKnotMesh, torusKnotBody]);

    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(100, 1, 100),
      material
    );
    floorMesh.receiveShadow = true;
    floorMesh.position.y = -1;
    this._scene.add(floorMesh);
    const floorBody = this._world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0)
    );
    const floorShape = RAPIER.ColliderDesc.cuboid(50, 0.5, 50);
    this._world.createCollider(floorShape, floorBody);
  }

  _setupControls() {
    this._orbitControls = new OrbitControls(this._camera, this._divContainer);
  }

  _setupEvents() {
    window.onresize = this.resize.bind(this);
    this.resize();

    this._clock = new THREE.Clock();
    requestAnimationFrame(this.render.bind(this));

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this._divContainer.addEventListener("click", (e) => {
      mouse.set(
        (e.clientX / this._divContainer.clientWidth) * 2 - 1,
        -(e.clientY / this._divContainer.clientHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, this._camera);
      const targetObjs = this._dynamicBodies.flatMap((a) => a[0]);
      const intersects = raycaster.intersectObjects(targetObjs);

      if (intersects.length) {
        this._dynamicBodies.forEach((b) => {
          if (b[0] === intersects[0].object)
            b[1].applyImpulse(new RAPIER.Vector3(0, 5, 0), true);
        });
      }
    });
  }

  update() {
    const delta = this._clock.getDelta();

    this._world.timestep = Math.min(delta, 0.1);
    this._world.step();

    const dynamicBodies = this._dynamicBodies;
    for (let i = 0, n = dynamicBodies.length; i < n; i++) {
      dynamicBodies[i][0].position.copy(dynamicBodies[i][1].translation());
      dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation());
    }

    if (this._debug) this._debug.update();

    this._orbitControls.update();
  }

  render() {
    this.update();

    this._renderer.render(this._scene, this._camera);

    requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }
}
const app = new App();