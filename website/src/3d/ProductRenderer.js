////@ts-check
import 'three/examples/js/controls/OrbitControls'
import * as THREE from 'three'
import ThreeCloset from './threejeyass/domain/ThreeCloset';
import Pole from './Pole'
import Drawer from './Drawer'
import ThreeModule from './threejeyass/domain/ThreeModule';
import SlidingDoor from './SlidingDoor'
import ThreeFace from './threejeyass/domain/ThreeFace';
import Shelf from './Shelf'
import HingedDoor from './HingedDoor'
import FaceOrientationEnum from './api/domain/FaceOrientation';
import ThreeDrawer from './threejeyass/domain/ThreeDrawer';
import ProductTypeEnum from './api/domain/ProductType';
import ThreeDrawerAnimations from './threejeyass/animations/ThreeDrawerAnimations';
import ThreeHingedDoorAnimations from './threejeyass/animations/ThreeHingedDoorAnimations';
import Watcher from './api/domain/Watcher';
import ThreeAction from './threejeyass/animations/ThreeAction';
import WatcherEventsTypes from './api/domain/WatcherEventsTypes';
import ThreeHingeedDoor from './threejeyass/domain/ThreeHingedDoor';
import ThreeSlidingDoor from './threejeyass/domain/ThreeSlidingDoor';

export default class ProductRenderer {

  canMoveCloset;

  canMoveSlots;

  canMoveComponents;

  /**
   * Instance variable representing the camera through which the scene is rendered.
   * @type{THREE.Camera}
   */
  camera;

  /**
   * @type{THREE.OrbitControls}
   */
  controls;

  /**
   * @type{THREE.Scene}
   */
  scene;

  /**
   * @type{THREE.WebGLRenderer}
   */
  renderer;

  /**
   * @type{THREE.Group}
   */
  group;

  /**
   * @type{THREE.TextureLoader}
   */
  textureLoader;

  /**
   * @type{THREE.MeshPhongMaterial}
   */
  material;

  /**
   * @type{ThreeCloset}
   */
  closet;

  /**
  * Global variable to know when to animate a hinged door 
  */
  hingedDoor;

  /**
   * Global variable to know when to animate a sliding door
   */
  slidingDoor;

  /**
   * Waiting list for doors that are waiting to be rendered (e.g. drawer animation has to end)
   */
  waitingDoors;

  /**
   * Flag to know whether a drawer is closed or not
   */
  openDrawers;

  /**
   * Flag to know whether a hinged door is closed or not
   */
  isHingedDoorClosed;

  /**
   * Global variable with the current closet shelves ids (Mesh IDs from Three.js)
   * @type {number[]}
   */
  closet_shelves_ids;

  closet_poles_ids;

  /**
   * Instance variable with the WebGL canvas
   * @type {HTMLCanvasElement}
   */
  canvasWebGL;

  // ------------ Instance variables used to dinamically resize Slots ------------
  /**
   * Instance variables that represent the currently selected slot and face (null if none)
   */
  selected_slot;

  /**
   * 
   */
  selected_face;

  selected_component;

  /**
   * Instance variable that represents the object being hovered (null if none)
   */
  hovered_object;

  /**
   * Instance variable that represents the plane that intersects the closet
   */
  plane;

  /**
   * Instance variable that represents the difference between the intersection's x coordinate
   * and the selected object's x coordinate
   * @type{number}
   */
  offset;

  /**
   * Instance variable with a Vector that holds the mouse coordinates (x, y)
   * @type{THREE.Vector2}
   */
  mouse;

  /**
   * Instance variable with a Vector that represents the intersection between the plane and
   * the clicked object
   * @type{THREE.Vector3}
   */
  intersection;

  /**
   * Instance variable with a Raycaster used for picking (hovering, clicking and identifying) objects
   * @type{THREE.Raycaster}
   */
  raycaster;
  // ------------ End of instance variables used to dinamically resize Slots ------------

  // --------------Beggining of resize control ----------------------

  /**
   * Variables that represent the index of each dimension in the vector
   */
  WIDTH;
  HEIGHT;
  DEPTH;

  /**Vector that saves the value of each resize for each dimensions */
  resizeVec;

  /**Initial values of dimension in three js  */
  initialDimensions;

  /* Initial values of dimension in the website */
  websiteDimensions;

  /**Number of dimensions in question */
  NUMBER_DIMENSIONS;
  // ---------------- End of resize control --------------------------
  /**
   * 
   * @param {HTMLCanvasElement} htmlCanvasElement 
   */
  constructor(htmlCanvasElement) {

    /* Create vector for resizing purposes: */

    this.WIDTH = 0;
    this.HEIGHT = 1;
    this.DEPTH = 2;
    this.resizeVec = [];

    /* Create vector for initial values of height,width and depth */
    this.initialDimensions = [404.5, 300, 100];

    this.NUMBER_DIMENSIONS = 3;

    this.websiteDimensions = [500, 100, 15000];

    this.canMoveCloset = true;
    this.canMoveSlots = true;
    this.canMoveComponents = true;

    this.hingedDoor = null;
    this.slidingDoor = null;
    this.waitingDoors = [];
    this.openDrawers = [];
    this.isHingedDoorClosed = false;
    this.closet_poles_ids = [];
    this.closet_shelves_ids = [];
    this.selected_slot = null;
    this.selected_face = null;
    this.selected_component = null;
    this.hovered_object = null;
    this.plane = null;
    this.mouse = new THREE.Vector2();
    this.intersection = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.canvasWebGL = htmlCanvasElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasWebGL,
      antialias: true
    });
    this.initCamera();
    this.initControls();
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.initCloset();
    this.initLighting();


    var geometry = new THREE.SphereBufferGeometry(430, 60, 40);
    geometry.scale(-1, 1, 1);

    var material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("./../../src/assets/background.jpg")
    });


    var mesh = new THREE.Mesh(geometry, material);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    //Creates the intersection plane
    this.plane = new THREE.Plane();
    this.plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 200, 0)).normalize();

    var planeGeometry = new THREE.PlaneGeometry(500, 500);

    var coplanarPoint = this.plane.coplanarPoint();

    var focalPoint = new THREE.Vector3().copy(coplanarPoint).add(this.plane.normal);

    planeGeometry.lookAt(focalPoint);

    planeGeometry.translate(coplanarPoint.x, coplanarPoint.y, coplanarPoint.z);

    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide
    });

    var dispPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    dispPlane.visible = false;
    //Finishes creating the intersection plane

    this.scene.add(dispPlane);
    this.scene.add(this.camera);
    this.scene.add(mesh);
    this.animate();

    let renderAction = function (renderer, scene, camera) {
      return function () {
        console.log("??????????????????????????");
        renderer.render(scene, camera);
      };
    };


    Watcher.currentWatcher().watch(WatcherEventsTypes.RENDER, new ThreeAction(renderAction(this.renderer, this.scene, this.camera)));
    //Watcher.currentWatcher().asd(asd(this.renderer,this.scene,this.camera));
    this.showCloset();
  }

  activateCanMoveSlots() { this.canMoveSlots = true; }
  deactivateCanMoveSlots() { this.canMoveSlots = false; }

  activateCanMoveComponents() { this.canMoveComponents = true; }
  deactivateCanMoveComponents() { this.canMoveComponents = false; }

  activateCanMoveCloset() { this.canMoveCloset = true; }
  deactivateCanMoveCloset() { this.canMoveCloset = false; }

  /**
   * Initiates the closet
   */
  initCloset() {
    var thickness = 4.20;


    /* this.closet = new Closet(, //Bottom
      , //Top
      , //Left
      , //Right
      ); //Back */

    this.textureLoader = new THREE.TextureLoader();
    //A MeshPhongMaterial allows for shiny surfaces
    //A soft white light is being as specular light
    //The shininess value is the same as the matte finishing's value
    this.material = new THREE.MeshPhongMaterial({
      specular: 0x404040,
      shininess: 20
    });

    let closet_faces = new Map();
    closet_faces.set(FaceOrientationEnum.BASE, new ThreeFace(null, this.material, FaceOrientationEnum.BASE, 404.5, thickness, 100, 0, -210, -195));
    closet_faces.set(FaceOrientationEnum.TOP, new ThreeFace(null, this.material, FaceOrientationEnum.TOP, 404.5, thickness, 100, 0, 90, -195));
    closet_faces.set(FaceOrientationEnum.LEFT, new ThreeFace(null, this.material, FaceOrientationEnum.LEFT, thickness, 300, 100, -200, -60, -195));
    closet_faces.set(FaceOrientationEnum.RIGHT, new ThreeFace(null, this.material, FaceOrientationEnum.RIGHT, thickness, 300, 100, 200, -60, -195));
    closet_faces.set(FaceOrientationEnum.BACK, new ThreeFace(null, this.material, FaceOrientationEnum.BACK, 404.5, 300, 0, 0, -60, -245.8));

    this.closet = new ThreeCloset(closet_faces, null, 1, 1);

    this.group.add(this.closet.draw());

    this.addSlotNumbered([{ width: 50 }]);

    this.scene.add(this.group);
    this.group.visible = false;
    this.showCloset();
    this.generatePole(1);
    this.generateDrawer(1);
    this.generateHingedDoor(1);
    //this.generateSlidingDoor();
    this.renderer.setClearColor(0xFFFFFF, 1);
  }

  /**
   * Shows the closet
   */
  showCloset() {
    this.group.visible = true;
  }

  /**
   * Initializes the scene's lighting.
   */
  initLighting() {
    var spotlight = new THREE.SpotLight(0x404040);
    this.camera.add(spotlight);

    spotlight.target = this.group;
    var lightAmbient = new THREE.AmbientLight(0x404040);
    this.scene.add(lightAmbient);
  }

  /**
   * Updates current closet graphical view
   */
  updateClosetGV() {
    let closetFaces = this.closet.getClosetFaces().entries();
    let closetInitialFaces = this.closet.getInitialClosetFaces().entries();
    for (let closetFace of closetFaces) {
      let closet_face = closetFace["1"].mesh();
      let closet_initial_face = closetInitialFaces.next().value["1"];
      closet_face.scale.x = this.getNewScaleValue(closet_initial_face.width(), closetFace["1"].width(), closet_face.scale.x);
      closet_face.scale.y = this.getNewScaleValue(closet_initial_face.height(), closetFace["1"].height(), closet_face.scale.y);
      closet_face.scale.z = this.getNewScaleValue(closet_initial_face.depth(), closetFace["1"].depth(), closet_face.scale.z);
      closet_face.position.x = closetFace["1"].X();
      closet_face.position.y = closetFace["1"].Y();
      closet_face.position.z = closetFace["1"].Z();
    }

    let closetSlotFaces = this.closet.getClosetSlotFaces();
    let closetInitialSlotFaces = this.closet.getInitialClosetSlotFaces();

    for (let i = 0; i < closetSlotFaces.length; i++) {
      let closetSlotFace = closetSlotFaces[i];
      let closet_slot_face = closetSlotFace.mesh();
      let closet_initial_slot_face = closetInitialSlotFaces[i];
      closet_slot_face.scale.x = this.getNewScaleValue(closet_initial_slot_face.width(), closetSlotFace.width(), closet_slot_face.scale.x);
      closet_slot_face.scale.y = this.getNewScaleValue(closet_initial_slot_face.height(), closetSlotFace.height(), closet_slot_face.scale.y);
      closet_slot_face.scale.z = this.getNewScaleValue(closet_initial_slot_face.depth(), closetSlotFace.depth(), closet_slot_face.scale.z);
      closet_slot_face.position.x = closetSlotFace.X();
      closet_slot_face.position.y = closetSlotFace.Y();
      closet_slot_face.position.z = closetSlotFace.Z();
      console.log(closetSlotFace);
    }
  }
  /**
   * Adds a slot to the current closet
   */
  addSlot() {
    ///this.addSlotNumbered([]);
  }

  /**
   * Adds components to the current closet
   */
  addComponent(components) {
    if (components == null || components == undefined) return;
    for (let i = 0; i < components.length; i++) {
      for (let j = 0; j < components[i].length; j++) {
        if (components[i][0].designation == "Shelf") this.generateShelf(components[i][0].slot);
        if (components[i][0].designation == "Pole") this.generatePole(components[i][0].slot);
        if (components[i][0].designation == "Drawer") this.generateDrawer(components[i][0].slot);
        if (components[i][0].designation == "Hinged Door") this.generateHingedDoor(components[i][0].slot);
        if (components[i][0].designation == "Sliding Door") this.generateSlidingDoor();
      }
    }
  }

  /**
   * Generates a cylinder with given properties on a certain position relative to axis x,y and z
   */
  generatePole(slot) {
    if (slot == 0) return;
    var leftFace = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT).mesh();
    let rightFace = this.closet.getClosetFaces().get(FaceOrientationEnum.RIGHT).mesh();
    var radiusTop = 3,
      radiusBottom = 3,
      radialSegments = 20,
      heightSegments = 20,
      thetaStart = 0,
      thetaLength = Math.PI * 2;
    var openEnded = false;
    var height, x, y, z;

    var pole = new Pole(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);

    //If the closet has no slots, the pole's height needs to be the width of the closet
    //Otherwise the pole needs to go from the closet's left wall to a slot, 
    //from a slot to another slot or from a slot to the closet's right wall
    let closetSlotsFaces = this.closet.getClosetSlotFaces();
    if (closetSlotsFaces.length == 0) {
      height = this.getCurrentClosetWidth();
      pole.changePoleHeight(height);
      x = this.calculateComponentPosition(rightFace.position.x, leftFace.position.x);
      y = this.calculateComponentPosition(rightFace.position.y, leftFace.position.y);
      z = this.calculateComponentPosition(rightFace.position.z, leftFace.position.z);

    } else if (slot == 1) { //Pole is added in between the closet's left face and first slot
      let firstSlot = closetSlotsFaces[0].mesh();
      height = this.calculateDistance(leftFace.position.x, firstSlot.position.x);
      pole.changePoleHeight(height);
      x = this.calculateComponentPosition(leftFace.position.x, firstSlot.position.x);
      y = this.calculateComponentPosition(leftFace.position.y, firstSlot.position.y);
      z = this.calculateComponentPosition(leftFace.position.z, firstSlot.position.z);

    } else if (slot > 1 && slot <= closetSlotsFaces.length) { //Pole is added between slots w/ indexes [slot - 1] and [slot]
      let slotToTheLeft = closetSlotsFaces[slot - 2].mesh();
      let slotToTheRight = ctlosetSlotsFaces[slot - 1].mesh();
      height = this.calculateDistance(slotToTheLeft.position.x, slotToTheRight.position.x);
      pole.changePoleHeight(height);
      x = this.calculateComponentPosition(slotToTheLeft.position.x, slotToTheRight.position.x);
      y = this.calculateComponentPosition(slotToTheLeft.position.y, slotToTheRight.position.y);
      z = this.calculateComponentPosition(slotToTheLeft.position.z, slotToTheRight.position.z);

    } else { //Pole is added between the last slot and the closet's right face
      let lastSlot = closetSlotsFaces[slot - 2].mesh();
      height = this.calculateDistance(lastSlot.position.x, rightFace.position.x);
      pole.changePoleHeight(height);
      x = this.calculateComponentPosition(lastSlot.position.x, rightFace.position.x);
      y = this.calculateComponentPosition(lastSlot.position.y, rightFace.position.y);
      z = this.calculateComponentPosition(lastSlot.position.z, rightFace.position.z);
    }
    var cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, pole.getPoleHeight(),
      radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
    var poleMesh = new THREE.Mesh(cylinderGeometry, this.material);
    poleMesh.position.x = x;
    poleMesh.position.y = y;
    poleMesh.position.z = z;
    poleMesh.rotation.z = Math.PI / 2;
    //this.closet.addPole(pole);
    let poleGroup = new THREE.Group();
    poleGroup.add(poleMesh);
    this.group.add(poleGroup);
    console.log("Pole Group ID =>" + poleGroup.id);
    console.log("Pole ID => " + poleMesh.id);
    this.closet_poles_ids.push(poleMesh.id);
  }

  generateShelf(slot) {
    let closetSlotsFaces = this.closet.getSlotFaces();
    let leftFace = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT).mesh();
    let rightFace = this.closet.getClosetFaces().get(FaceOrientationEnum.RIGHT).mesh();
    var width, x, y, z;

    if (slot == 0) { //If there are no slots, the width of the shelf is the same as the closet's structure
      width = this.getCurrentClosetWidth();
      x = this.calculateComponentPosition(rightFace.position.x, leftFace.position.x);
      y = this.calculateComponentPosition(rightFace.position.y, leftFace.position.y);
      z = this.calculateComponentPosition(rightFace.position.z, leftFace.position.z);
    } else if (slot == 1) { //If the slot is the first one, the shelf is added between the left wall of the closet and the slot
      let firstSlot = closetSlotsFaces[0].mesh();
      width = this.calculateDistance(leftFace.position.x, firstSlot.position.x);
      x = this.calculateComponentPosition(leftFace.position.x, firstSlot.position.x);
      y = this.calculateComponentPosition(leftFace.position.y, firstSlot.position.y);
      z = this.calculateComponentPosition(leftFace.position.z, firstSlot.position.z);
    } else if (slot > 1 && slot <= closetSlotsFaces.length) { //If the chosen slot is not the first nor the last, the shelf is added between two slots
      let slotToTheLeft = closetSlotsFaces[slot - 2].mesh();
      let slotToTheRight = closetSlotsFaces[slot - 1].mesh();
      width = this.calculateDistance(slotToTheLeft.position.x, slotToTheRight.position.x);
      x = this.calculateComponentPosition(slotToTheLeft.position.x, slotToTheRight.position.x);
      y = this.calculateComponentPosition(slotToTheLeft.position.y, slotToTheRight.position.y);
      z = this.calculateComponentPosition(slotToTheLeft.position.z, slotToTheRight.position.z);
    } else { //If the slot is the last one, the shelf is added between the slot and the right wall of the closet
      let lastSlot = closetSlotsFaces[slot - 2].mesh();
      width = this.calculateDistance(lastSlot.position.x, rightFace.position.x);
      x = this.calculateComponentPosition(lastSlot.position.x, rightFace.position.x);
      y = this.calculateComponentPosition(lastSlot.position.y, rightFace.position.y);
      z = this.calculateComponentPosition(lastSlot.position.z, rightFace.position.z);
    }

    //new Shelf([width, height, depth, x, y, z]);
    var meshID = this.generateParellepiped(width, 3, this.closet.getClosetDepth(), x, y, z, this.material, this.group);
    // this.closet.addShelf(shelf);
    this.closet_shelves_ids.push(meshID);
  }


  generateDrawer(slot) {
    let closetSlotsFaces = this.closet.getClosetSlotFaces();
    let leftFace = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT);
    let rightFace = this.closet.getClosetFaces().get(FaceOrientationEnum.RIGHT);
    let leftThreeFace = leftFace.mesh();
    let rightThreeFace = rightFace.mesh();
    var depthDrawer = 3;
    var heightDrawer = 40;
    var depthCloset = this.closet.getClosetDepth();
    var width;
    var x, y, z;
    var spaceDrawerModule = 10;

    //For now this follows the same logic as the pole, it should be changed to whatever dimensions the shelf is allowed to have
    if (closetSlotsFaces.length == 0) {
      width = this.getCurrentClosetWidth() - 4.20;
      x = this.calculateComponentPosition(rightThreeFace.position.x, leftThreeFace.position.x);
      y = this.calculateComponentPosition(rightThreeFace.position.y, leftThreeFace.position.y);
      z = this.calculateComponentPosition(rightThreeFace.position.z, leftThreeFace.position.z);
    } else if (slot == 1) {
      let firstSlot = closetSlotsFaces[0].mesh();
      width = this.calculateDistance(leftThreeFace.position.x, firstSlot.position.x) - 4.20;
      x = this.calculateComponentPosition(leftThreeFace.position.x, firstSlot.position.x);
      y = this.calculateComponentPosition(leftThreeFace.position.y, firstSlot.position.y);
      z = this.calculateComponentPosition(leftThreeFace.position.z, firstSlot.position.z);
    } else if (slot > 1 && slot <= closetSlotsFaces.length) {
      let slotToTheLeft = closetSlotsFaces[slot - 2].mesh();
      let slotToTheRight = closetSlotsFaces[slot - 1].mesh();
      width = this.calculateDistance(slotToTheLeft.position.x, slotToTheRight.position.x);
      x = this.calculateComponentPosition(slotToTheLeft.position.x, slotToTheRight.position.x);
      y = this.calculateComponentPosition(slotToTheLeft.position.y, slotToTheRight.position.y);
      z = this.calculateComponentPosition(slotToTheLeft.position.z, slotToTheRight.position.z);
    } else {
      let lastSlot = closetSlotsFaces[slot - 2].mesh();
      width = this.calculateDistance(lastSlot.position.x, rightThreeFace.position.x) - 4.20;
      x = this.calculateComponentPosition(lastSlot.position.x, rightThreeFace.position.x);
      y = this.calculateComponentPosition(lastSlot.position.y, rightThreeFace.position.y);
      z = this.calculateComponentPosition(lastSlot.position.z, rightThreeFace.position.z);
    }

    let moduleFaces = new Map();
    moduleFaces.set(FaceOrientationEnum.BASE, new ThreeFace(null, this.material, FaceOrientationEnum.BASE, width, depthDrawer, depthCloset, x, y - (spaceDrawerModule / 4), z));
    moduleFaces.set(FaceOrientationEnum.TOP, new ThreeFace(null, this.material, FaceOrientationEnum.TOP, width, depthDrawer, depthCloset, x, y + heightDrawer + (spaceDrawerModule / 4), z));
    moduleFaces.set(FaceOrientationEnum.LEFT, new ThreeFace(null, this.material, FaceOrientationEnum.LEFT, depthDrawer, heightDrawer + (spaceDrawerModule / 4), depthCloset, x - (width / 2), y + (heightDrawer / 2), z));
    moduleFaces.set(FaceOrientationEnum.RIGHT, new ThreeFace(null, this.material, FaceOrientationEnum.RIGHT, depthDrawer, heightDrawer + (spaceDrawerModule / 4), depthCloset, x + (width / 2), y + (heightDrawer / 2), z));

    let module = new ThreeModule(moduleFaces);

    let drawerFaces = new Map();
    drawerFaces.set(FaceOrientationEnum.BASE, new ThreeFace(null, this.material, FaceOrientationEnum.BASE, width - spaceDrawerModule, depthDrawer, depthCloset, x, y + (depthDrawer / 2), z));
    drawerFaces.set(FaceOrientationEnum.FRONT, new ThreeFace(null, this.material, FaceOrientationEnum.FRONT, width - spaceDrawerModule, heightDrawer, depthDrawer, x, y + (heightDrawer / 2), z + (depthCloset / 2) - (depthDrawer / 2)));
    drawerFaces.set(FaceOrientationEnum.LEFT, new ThreeFace(null, this.material, FaceOrientationEnum.LEFT, depthDrawer, heightDrawer, depthCloset - (depthDrawer / 2), x - (width / 2) + (spaceDrawerModule / 2), y + (heightDrawer / 2), z));
    drawerFaces.set(FaceOrientationEnum.RIGHT, new ThreeFace(null, this.material, FaceOrientationEnum.RIGHT, depthDrawer, heightDrawer, depthCloset - (depthDrawer / 2), x + (width / 2) - (spaceDrawerModule / 2), y + (heightDrawer / 2), z));
    drawerFaces.set(FaceOrientationEnum.BACK, new ThreeFace(null, this.material, FaceOrientationEnum.BACK, width - spaceDrawerModule, heightDrawer, depthDrawer, x, y + (heightDrawer / 2), z - (depthCloset / 2) + (depthDrawer / 2)));

    let drawer = new ThreeDrawer(drawerFaces);

    this.closet.addProduct(leftFace.id(), module);
    this.closet.addProduct(leftFace.id(), drawer);

  }

  /**
   * Calculates a pole's xyz position
   * @param {Number} leftMostCoordinate xyz coordinate of a closet's wall or a slot that is more to the left
   * @param {Number} rightMostCoordinate xyz coordinate of a closet's wall or a slot that is more to the right
   */
  calculateComponentPosition(leftMostCoordinate, rightMostCoordinate) {
    return (leftMostCoordinate + rightMostCoordinate) / 2;
  }

  calculateDistance(topPosition, bottomPosition) {
    return Math.abs(topPosition - bottomPosition);
  }

  /**
   * Adds a specified number of slots to the current closet
   * @param{array} slotsToAdd - number of slots being added
   */
  addSlotNumbered(slotsToAdd) {
    for (var i = 0; i < slotsToAdd.length; i++) {
      this.closet.addClosetSlot(slotsToAdd[i]);
    }
    this.updateClosetGV();
  }

  /**
   * Removes a slot from the current closet
   */
  removeSlot() {
    this.closet.removeSlot();
    this.updateClosetGV();
  }

  /**
   * Changes the dimensions of the closet
   * @param {number} width Number with the closet width
   * @param {number} height Number with the closet height
   * @param {number} depth Number with the closet depth
   */
  changeClosetDimensions(width, height, depth) {
    this.resizeFactor();

    this.closet.changeClosetWidth(this.resizeVec[this.WIDTH] * width);
    this.closet.changeClosetHeight(this.resizeVec[this.HEIGHT] * height);
    this.closet.changeClosetDepth((this.resizeVec[this.DEPTH] * depth) - 195.8);

    this.updateClosetGV();
  }

  /**
   * Method that populates the vector responsible to resize
   */
  resizeFactor() {
    var i;
    for (i = 0; i < this.NUMBER_DIMENSIONS; i++) {
      this.resizeVec[i] = this.initialDimensions[i] / this.websiteDimensions[i];
    }
  }

  /**
   * Applies the texture to the closet.
   * @param {string} texture - texture being applied.
   */
  applyTexture(texture) {
    this.textureLoader.load(texture, tex => {
      this.material.map = tex;
    })
  }

  /**
   * Changes the closet's material's shininess.
   * @param {number} shininess - new shininess value
   */
  changeShininess(shininess) {
    this.material.shininess = shininess;
  }

  /**
   * Changes the closet's material's color.
   * @param {number} color 
   */
  changeColor(color) {
    this.material.color.setHex(color);
  }

  /**
   * Changes the current closet slots
   * @param {number} slots Number with the new closet slots
   */
  changeClosetSlots(slots, slotWidths) {
    var newSlots = this.closet.computeNewClosetSlots(slots);
    if (newSlots > 0) {
      for (var i = 0; i < newSlots; i++) {
        this.addSlot();
      }
    } else {
      newSlots = -newSlots;
      if (newSlots > 0) {
        for (var i = 0; i < newSlots; i++) {
          this.removeSlot();
        }
      }
    }
    /* if(slotWidths.length > 0){
        updateSlotWidths(slotWidths);
    } */
    this.updateClosetGV();
  }

  /**
   * 
   * @param {number[]} slotWidths 
   */
  updateSlotWidths(slotWidths) {
    let closetSlotsFaces = this.closet.getClosetSlotFaces();
    for (let i = 0; i < slotWidths.length; i++) {
      let closet_face = closetSlotsFaces[i].mesh();
      closet_face.position.x = slotWidths[i];
    }
  }

  /**
   * Generates a parellepiped with a certain dimensions (width, height, depth) and on a certain position relatively to axes (x,y,z)
   * @param {number} width Number with the parellepiped width
   * @param {number} height Number with the parellepiped height
   * @param {number} depth Number with the parellepiped depth
   * @param {number} x Number with the parellepiped position relatively to the X axe
   * @param {number} y Number with the parellepiped position relatively to the Y axe
   * @param {number} z Number with the parellepiped position relatively to the Z axe
   * @param {THREE.Material} material THREE.Material with the parellepiped material
   * @param {THREE.Group} group THREE.Group with the group where the parellepied will be putted
   */
  generateParellepiped(width, height, depth, x, y, z, material, group) {
    var parellepipedGeometry = new THREE.CubeGeometry(width, height, depth);
    var parellepiped = new THREE.Mesh(parellepipedGeometry, material);
    parellepiped.position.x = x;
    parellepiped.position.y = y;
    parellepiped.position.z = z;
    this.group.add(parellepiped);
    return parellepiped.id;
  }

  /**
   * Animates the scene
   */
  animate() {
    /*         var instance = this;
            setTimeout(function () {
        
            }, 1000 / 60)
            //TODO: re-enable frame cap  */

    requestAnimationFrame(() => this.animate());
    this.render();
  }

  /**
   * Renders the scene
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Initializes the graphic representation controls
   */
  initControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.controls.target = new THREE.Vector3(0, 0, 0);

    this.controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;

    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 500;

    this.controls.maxPolarAngle = Math.PI / 2;
  }

  /**
   * Initializes the graphic representation camera
   */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 1000);
    this.camera.position.y = 400;
    this.camera.position.z = 400;
    this.camera.rotation.x = .70;
  }

  /**
   * Computes the new scale value based on the initial scale value, new scale value and the current scale value
   * @param {number} initialScaleValue Number with the initial scale value
   * @param {number} newScaleValue Number with the new scale value
   * @param {number} currentScaleValue Number with the current scale value
   */
  getNewScaleValue(initialScaleValue, newScaleValue, currentScaleValue) {
    if (initialScaleValue == 0) return 0;
    return (newScaleValue * 1) / initialScaleValue;
  }

  /**
   * Represents the action that occurs when any keyboard key is pressed (key down),
   * which is blocking its action (disabling it).
   * @param {*} event 
   */
  onKeyDown(event) {
    event.preventDefault();
    alert("entro no three");
    // switch (event.keyCode) {
    //     case 37:
    //         alert('left');
    //         break;
    //     case 38:
    //         alert('up');
    //         break;
    //     case 39:
    //         alert('right');
    //         break;
    //     case 40:
    //         alert('down');
    //         break;
    // }
  }

  /**
 * Represents the action that occurs when the mouse's left button is pressed (mouse down),
 * which is recognizing the object being clicked on, setting it as the selected one if
 * it is a slot and disabling the rotation control
 */
  onMouseDown(event) {
    event.preventDefault();
    var context = this;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    //Finds all intersected objects (closet faces)
    //this.group.children[0] => Closet Group
    var intersects = this.raycaster.intersectObjects(this.group.children, true);
    //Intersects must be 
    //Checks if any closet face was intersected
    if (intersects.length > 0) {

      //Gets the closest (clicked) object
      var face = intersects[0].object;
      console.log("Face ID => " + face.id);
      console.log("Closet ID => " + this.closet.id());
      let closetSlotsFaces = this.closet.getClosetSlotFaces();
      //Checks if the selected closet face is a slot 
      for (var i = 0; i < closetSlotsFaces.length; i++) {
        var closet_face = closetSlotsFaces[i].mesh();
        if (closet_face == face) {
          //Disables rotation while moving the slot
          this.controls.enabled = false;
          //Sets the selection to the current slot
          this.selected_slot = face;
          if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
            this.offset = this.intersection.x - this.selected_slot.position.x;
          }
        }
      }

      //Checks if the selected object is a shelf
      for (let j = 0; j < this.closet_shelves_ids.length; j++) {
        let shelf = this.group.getObjectById(this.closet_shelves_ids[j]);
        if (shelf == face) {
          this.controls.enabled = false;
          this.selected_component = face;
          if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
            this.offset = this.intersection.y - this.selected_component.position.y;
          }
        }
      }

      //Checks if the selected object is a pole
      for (let j = 0; j < this.closet_poles_ids.length; j++) {
        let pole = this.group.getObjectById(this.closet_poles_ids[j]);
        if (pole == face) {
          this.controls.enabled = false;
          this.selected_component = face;
          if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
            this.offset = this.intersection.y - this.selected_component.position.y;
          }
        }
      }
      //Checks if the selected closet face is a face
      let leftFace = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT).mesh();
      let rightFace = this.closet.getClosetFaces().get(FaceOrientationEnum.RIGHT).mesh();
      if (rightFace == face ||
        leftFace == face) {
        //Disables rotation while moving the face
        this.controls.enabled = false;
        //Sets the selection to the current face
        this.selected_face = face;
        if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
          this.offset = this.intersection.x - this.selected_face.position.x;
        }
      }

      if (this.canMoveComponents) {
        var flagOpen = false;
        var flagClose = false;
        var j = 0;

        //Checks if the selected object is a sliding door

        let closetSlidingDoors=this.closet.getProducts(ProductTypeEnum.SLIDING_DOOR);

        while (!flagOpen && !flagClose && j < closetSlidingDoors.length) {
          let closetSlidingDoor=closetSlidingDoors[j].getFace().mesh(); //TODO: ??? Are you sure about that
          if (closetSlidingDoor == face) {
            this.controls.enabled = false;
            if (this.slidingDoor.position.x < 0) {
              flagClose = true; //"Closing" ==> slide door to the right
            } else {
              flagOpen = true; //"Opening" ==> slide door to the left
            }
          }
          j++;
        }

        if (flagOpen) {
          requestAnimationFrame(function () {
            context.slideDoorToLeft();
          });
        } else if (flagClose) {
          requestAnimationFrame(function () {
            context.slideDoorToRight();
          });
        }

        flagOpen = false;
        flagClose = false;
        j = 0;

        let closetDrawers = this.closet.getProducts(ProductTypeEnum.DRAWER);
        while (!flagOpen && !flagClose && j < closetDrawers.length) {
          let closetDrawerFaces = closetDrawers[j].getDrawerFaces();
          var closetDrawer = closetDrawers[j];
          //Always get the front face of any drawer at index 5*j+1
          var drawer_front_face = closetDrawerFaces.get(FaceOrientationEnum.FRONT).mesh();
          console.log(face);
          console.log(drawer_front_face);
          //Check if the selected object is a drawer's front face
          if (drawer_front_face == face) {
            this.controls.enabled = false;
            var drawer_base_face = closetDrawerFaces.get(FaceOrientationEnum.BASE).mesh();
            var drawer_left_face = closetDrawerFaces.get(FaceOrientationEnum.LEFT).mesh();
            var drawer_right_face = closetDrawerFaces.get(FaceOrientationEnum.RIGHT).mesh();
            var drawer_back_face = closetDrawerFaces.get(FaceOrientationEnum.BACK).mesh();
            if (drawer_front_face.position.z >= -50) {
              flagClose = true;
            } else {
              flagOpen = true;
            }
          }
          j++;
        }

        if (flagOpen) {
          /* requestAnimationFrame(function () {
            
            context.openDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
          }); */
          /* requestAnimationFrame(function(){
            ThreeDrawerAnimations.open(closetDrawer)
          }); */
          ThreeDrawerAnimations.open(closetDrawer);
        } else if (flagClose) {
          /* requestAnimationFrame(function () {
            context.closeDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
          }); */
          ThreeDrawerAnimations.close(closetDrawer);
        }

        j = 0;
        flagOpen = false;
        flagClose = false;

        let closetHingedDoors=this.closet.getProducts(ProductTypeEnum.HINGED_DOOR);

        while (!flagOpen && !flagClose && j < closetHingedDoors.length) {
          let hingedDoor=closetHingedDoors[j]; //TODO: Maybe wrong ?
          //TODO: REMOVE closet_face ???? Not currently used!!!!
          if (hingedDoor.getFace().mesh() == face) {
            this.controls.enabled = false;
            if (this.hingedDoor.rotation.y < 0) {
              flagClose = true;
            } else {
              flagOpen = true;
            }
          }
          j++;
        }

        if (flagOpen) {
          requestAnimationFrame(function () {
            context.openHingedDoor();
          });
        } else if (flagClose) {
          requestAnimationFrame(function () {
            context.closeHingedDoor();
          });
        }
      }
    }
  }


  slideDoorToLeft() {
    if (this.doesClosetHaveOpenDrawers()) {
      this.waitingDoors.push(this.slideDoorToLeftAnimation);
      this.closeAllOpenDrawers();
    } else {
      this.slideDoorToLeftAnimation();
    }
  }

  slideDoorToLeftAnimation() {
    let closet_left = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT).mesh();
    let distanceFromDoorToLeftFace = Math.abs(this.slidingDoor.position.x - closet_left.position.x);
    let position = (Math.abs(closet_left.position.x - closet_left.geometry.parameters.width) / 2) - 2;
    if (position < distanceFromDoorToLeftFace) {
      this.slidingDoor.translateX(-1);
      var context = this;
      requestAnimationFrame(function () {
        context.slideDoorToLeft();
      });
      this.render();
      this.controls.update();
    }
  }

  slideDoorToRight() {
    if (this.doesClosetHaveOpenDrawers()) {
      this.waitingDoors.push(this.slideDoorToRightAnimation);
      this.closeAllOpenDrawers();
    } else {
      this.slideDoorToRightAnimation();
    }
  }

  slideDoorToRightAnimation() {
    let closet_right = this.closet.getClosetFaces().get(FaceOrientationEnum.RIGHT).mesh();
    let distanceFromDoorToRightFace = Math.abs(this.slidingDoor.position.x - closet_right.position.x);
    let position = (Math.abs(closet_right.position.x + closet_right.geometry.parameters.width) / 2) - 2;
    if (position < distanceFromDoorToRightFace) {
      var context = this;
      this.slidingDoor.translateX(1);
      requestAnimationFrame(function () {
        context.slideDoorToRight();
      });
      this.render();
      this.controls.update();
    }
  }

  openHingedDoor() {
    if (this.hingedDoor.rotation.y > (-Math.PI / 2)) {
      var rotationX = (this.hingedDoor.geometry.parameters.width / 2);
      this.hingedDoor.translateX(-rotationX);
      this.hingedDoor.rotation.y -= Math.PI / 100;
      this.hingedDoor.translateX(rotationX);
      var context = this;
      requestAnimationFrame(function () {
        context.openHingedDoor();
      });
      this.render();
      this.controls.update();
    }
  }

  closeHingedDoor() {
    var hingedDoorSlot = this.getHingedDoorSlot(this.hingedDoor);
    if (this.doesSlotHaveOpenDrawers(hingedDoorSlot)) {
      this.waitingDoors.push(this.closeHingedDoorAnimation);
      this.closeSlotOpenDrawers(hingedDoorSlot);
    } else {
      this.closeHingedDoorAnimation();
    }
  }

  checkAddDrawerTriggers(slot) {
    this.generateDrawer(slot);
    if (this.doesSlotHaveHingedDoor(slot)) {
      if (!this.isHingedDoorClosed) {
        let hingedDoor=this.closet.getProducts(ProductTypeEnum.HINGED_DOOR)[slot-1].face().mesh();
        ThreeHingedDoorAnimations.open(hingedDoor);
        /* requestAnimationFrame(this.openHingedDoor); */
      }
    }
    if (this.doesClosetHaveSlidingDoors()) {
      let closetSlidingDoors=this.closet.getProducts(ProductTypeEnum.SLIDING_DOOR);
      var front_door = closetSlidingDoors[1].mesh();
      var back_door = closetSlidingDoors[0].mesh();
      //Front face of the last added drawer is always at index length - 4
      let addedDrawers=this.closet.getProducts(ProductTypeEnum.DRAWER);
      let lastDrawerAddedFrontFace=addedDrawers[addedDrawers.length-1].mesh();
      if (lastDrawerAddedFrontFace.position.x < 0) {
        var context = this;
        if (front_door.position.x < 0) {
          this.slidingDoor = front_door;
          context.slideDoorToRight();
        }
        if (back_door.position.x < 0) {
          this.slidingDoor = back_door;
          context.slideDoorToLeft();
        }
      } else {
        if (front_door.position.x > 0) {
          this.slidingDoor = front_door;
          context.slideDoorToLeft();
        }
        if (back_door.position.x > 0) {
          this.slidingDoor = back_door;
          context.slideDoorToRight();
        }
      }

    }
  }

  checkAddSlidingDoorTriggers() {
    if (this.doesClosetHaveHingedDoors()) {
      alert("There are closet slots that have hinged doors!");
    } else {
      if (this.doesClosetHaveOpenDrawers()) {
        if (this.openDrawers.length > 0) {
          this.waitingDoors.push(function () {
            this.generateSlidingDoor();
          });
          this.closeAllOpenDrawers();
        } else {
          this.generateSlidingDoor();
        }
      } else {
        this.generateSlidingDoor();
      }
    }
  }

  checkAddHingedDoorTriggers(slot) {
    if (this.doesSlotHaveHingedDoor(slot)) {
      alert("This slot already has a door!");
    } else if (this.doesClosetHaveSlidingDoors()) {
      alert("The closet already has sliding doors!");
    } else {
      if (this.doesSlotHaveOpenDrawers(slot)) {
        if (this.openDrawers.length > 0) {
          this.waitingDoors.push(function () {
            this.addHingedDoor(slot);
          });
          this.closeSlotOpenDrawers(slot);
        } else {
          this.addHingedDoor(slot);
        }
      } else {
        this.addHingedDoor(slot);
      }
    }
  }

  addHingedDoor(slot) {
    if (this.openDrawers.length == 0) {
      this.generateHingedDoor(slot);
    } else {
      this.generateHingedDoor(slot);
    }
  }

  generateHingedDoor(slot) {
    let closetSlotsFaces = this.closet.getClosetSlotFaces();
    let leftFace = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT).mesh();
    let rightFace = this.closet.getClosetFaces().get(FaceOrientationEnum.RIGHT).mesh();
    var depth = 3;
    var height = this.closet.getClosetHeight();
    var depth_closet = this.closet.getClosetDepth();
    var width;
    var x, y, z;

    //For now this follows the same logic as the pole, it should be changed to whatever dimensions the shelf is allowed to have
    if (closetSlotsFaces.length == 0) {
      width = this.closet.getClosetWidth();
      x = this.calculateComponentPosition(rightFace.position.x, leftFace.position.x);
      y = this.calculateComponentPosition(rightFace.position.y, leftFace.position.y);
      z = this.calculateComponentPosition(rightFace.position.z, leftFace.position.z);
    } else if (slot == 1) {
      let firstSlot = closetSlotsFaces[0].mesh();
      width = this.calculateDistance(leftFace.position.x, firstSlot.position.x);
      x = this.calculateComponentPosition(leftFace.position.x, firstSlot.position.x);
      y = this.calculateComponentPosition(leftFace.position.y, firstSlot.position.y);
      z = this.calculateComponentPosition(leftFace.position.z, firstSlot.position.z);
    } else if (slot > 1 && slot <= closetSlotsFaces.length) {
      let slotToTheLeft = closetSlotsFaces[slot - 2].mesh();
      let slotToTheRight = closetSlotsFaces[slot - 1].mesh();
      width = this.calculateDistance(slotToTheLeft.position.x, slotToTheRight.position.x);
      x = this.calculateComponentPosition(slotToTheLeft.position.x, slotToTheRight.position.x);
      y = this.calculateComponentPosition(slotToTheLeft.position.y, slotToTheRight.position.y);
      z = this.calculateComponentPosition(slotToTheLeft.position.z, slotToTheRight.position.z);
    } else {
      let lastSlot = closetSlotsFaces[slot - 2].mesh();
      width = this.calculateDistance(lastSlot.position.x, rightFace.position.x);
      x = this.calculateComponentPosition(lastSlot.position.x, rightFace.position.x);
      y = this.calculateComponentPosition(lastSlot.position.y, rightFace.position.y);
      z = this.calculateComponentPosition(lastSlot.position.z, rightFace.position.z);
    }

    let hingedDoorFace=new ThreeFace(null,this.material,null,width,height,depth,x,y,z+(depth_closet/2));
    let hingedDoor=new ThreeHingeedDoor(hingedDoorFace);

    this.closet.addProduct(slot,hingedDoor);
  }

  generateSlidingDoor() {
    let leftFace = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT).mesh();
    let rightFace = this.closet.getClosetFaces().get(FaceOrientationEnum.RIGHT).mesh();
    let topFace = this.closet.getClosetFaces().get(FaceOrientationEnum.TOP).mesh();
    let bottomFace = this.closet.getClosetFaces().get(FaceOrientationEnum.BASE).mesh();
    let height = this.closet.getClosetHeight();
    let width = this.closet.getClosetWidth();
    let backFace = this.closet.getClosetFaces().get(FaceOrientationEnum.BACK).mesh();
    let z = backFace.position.z + this.closet.getClosetDepth();

    let thickness = 4.20;

    //var front_door = new SlidingDoor([width / 2, (height - thickness), 5, leftFace.position.x / 2, leftFace.position.y, z + 7]);

    let front_door_face=new ThreeFace(null,this.material,null,(width/2),(height-thickness),5,(leftFace.position.x/2),(leftFace.position.y),z+7);

    let front_door=new ThreeSlidingDoor(front_door_face,null,0);

    let front_frame_faces=new Map();
    front_frame_faces.set(FaceOrientationEnum.BASE,new ThreeFace(null,this.material,FaceOrientationEnum.BASE,width, thickness, 5, bottomFace.position.x, bottomFace.position.y, z + 7));
    front_frame_faces.set(FaceOrientationEnum.TOP,new ThreeFace(null,this.material,FaceOrientationEnum.TOP,width, thickness, 5, topFace.position.x, topFace.position.y, z + 7));
    front_frame_faces.set(FaceOrientationEnum.LEFT,new ThreeFace(null,this.material,FaceOrientationEnum.LEFT,thickness, height, 5, leftFace.position.x, leftFace.position.y, z + 7));
    front_frame_faces.set(FaceOrientationEnum.RIGHT,new ThreeFace(null,this.material,FaceOrientationEnum.RIGHT,thickness, height, 5, rightFace.position.x, rightFace.position.y, z + 7));

    let front_frame=new ThreeModule(front_frame_faces,0,0);

    /* let front_frame = new ThreeModule([width, thickness, 5, bottomFace.position.x, bottomFace.position.y, z + 7],
      [width, thickness, 5, topFace.position.x, topFace.position.y, z + 7],
      [thickness, height, 5, leftFace.position.x, leftFace.position.y, z + 7],
      [thickness, height, 5, rightFace.position.x, rightFace.position.y, z + 7]); */


      

    //var back_door = new SlidingDoor([width / 2, (height - thickness), 5, rightFace.position.x / 2, rightFace.position.y, z + 2]);

    alert("Height => "+height)
    alert("Thickness => "+thickness)
    let back_door_face=new ThreeFace(null,this.material,null,(width/2),(height-thickness),5,(rightFace.position.x/2),(rightFace.position.y),z+2);

    let back_door=new ThreeSlidingDoor(back_door_face,null,0);

    let back_frame_faces=new Map();
    back_frame_faces.set(FaceOrientationEnum.BASE,new ThreeFace(null,this.material,FaceOrientationEnum.BASE,width, thickness, 5, bottomFace.position.x, bottomFace.position.y, z + 2));
    back_frame_faces.set(FaceOrientationEnum.TOP,new ThreeFace(null,this.material,FaceOrientationEnum.TOP,width, thickness, 5, topFace.position.x, topFace.position.y, z + 2));
    back_frame_faces.set(FaceOrientationEnum.LEFT,new ThreeFace(null,this.material,FaceOrientationEnum.LEFT,thickness, height, 5, leftFace.position.x, leftFace.position.y, z + 2));
    back_frame_faces.set(FaceOrientationEnum.RIGHT,new ThreeFace(null,this.material,FaceOrientationEnum.RIGHT,thickness, height, 5, rightFace.position.x, rightFace.position.y, z + 2));

    let back_frame=new ThreeModule(back_frame_faces,0,0);

    let drawnFrontModule=front_frame.draw();
    let drawnFrontDoor=front_door.draw();
      
    let drawnBackModule=back_frame.draw();
    let drawnBackDoor=back_door.draw();
    
    this.group.add(drawnBackModule,drawnFrontModule);
    this.group.add(drawnBackDoor,drawnFrontDoor);

    console.log(back_door.face);
    alert("!!!!")
  }


  /**
   * Closes all open drawers on a certain slot
   * @param {Number} slotId Number with the slot identifier
   */
  closeSlotOpenDrawers(slotId) {
    let closetDrawers=this.closet.getProducts(ProductTypeEnum.DRAWER);
    for(let closetDrawer of closetDrawers)
      if(closetDrawer.getSlotId()==slotId)
        ThreeDrawerAnimations.close(closetDrawer);
  }

  /**
   * Closes all open drawers on the current closet
   */
  closeAllOpenDrawers() {
    let closetDrawers=this.closet.getProducts(ProductTypeEnum.DRAWER);
    for(let closetDrawer of closetDrawers)
        ThreeDrawerAnimations.close(closetDrawer);
  }

  /**
   * Checks if an hinged door exists on a certain slot of the closet
   * @param {Number} slotId Number with the slot identifier
   */
  doesSlotHaveHingedDoor(slotId) {
    let closetHingedDoors=this.closet.getProducts(ProductTypeEnum.HINGED_DOOR);
    for(let closetHingeedDoor of closetHingedDoors)
      if(closetHingeedDoor.getSlotId()==slotId)
        return true;
    return false;
  }

  /**
   * Checks if there are any open drawers on a certain slot of the closet
   * @param {Number} slot Number with the slot identifier 
   */
  doesSlotHaveOpenDrawers(slot) {
    let closetDrawers=this.closet.getProducts(ProductTypeEnum.DRAWER);
    for(let closetDrawer of closetDrawers)
      if(closetDrawer.isOpen())
        return true;
    return false;
  }

  /**
   * Checks if the closet has open drawers
   */
  doesClosetHaveOpenDrawers() {
    let closetDrawers=this.closet.getProducts(ProductTypeEnum.DRAWER);
    for(let closetDrawer of closetDrawers)
      if(closetDrawer.isOpen())
        return true;
    return false;
  }

  /**
   * Checks if the closet has hinged doors
   */
  doesClosetHaveHingedDoors() {
    return this.closet.getProducts(ProductTypeEnum.HINGED_DOOR).length>0;
  }

  /**
   * Checks if the closet has sliding doors
   */
  doesClosetHaveSlidingDoors() {
    return this.closet.getProducts(ProductTypeEnum.SLIDING_DOOR).length>0;
  }
  
  
  closeHingedDoorAnimation() {
    if (this.hingedDoor.rotation.y < 0) {
      var rotationX = this.hingedDoor.geometry.parameters.width / 2;
      this.hingedDoor.translateX(-rotationX);
      this.hingedDoor.rotation.y += Math.PI / 100;
      this.hingedDoor.translateX(rotationX);
      var context = this;
      requestAnimationFrame(function () {
        context.closeHingedDoor();
      });
      this.render();
      this.controls.update();
    } else {
      this.isHingedDoorClosed = true;
    }
  }

  getHingedDoorSlot(hingedDoorMesh) {
    for (let i = 0; i < this.closet.hingedDoors.length; i++) {
      if (hingedDoorMesh.id == this.closet.hingedDoors[i].meshId) {
        return this.closet.hingedDoors[i].slotId;
      }
    }
    return;
  }

  openDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face) {
    if (drawer_front_face.position.z <= -50) {
      drawer_front_face.translateZ(1);
      drawer_back_face.translateZ(1);
      drawer_base_face.translateZ(1);
      drawer_left_face.translateZ(1);
      drawer_right_face.translateZ(1);
      var context = this;
      requestAnimationFrame(function () {
        context.openDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
      });
      this.render();
      this.controls.update();
    } else {
      this.openDrawers.push(true);
    }
  }

  closeDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face) {
    let closet_back = this.closet.getClosetFaces().get(FaceOrientationEnum.BACK).mesh();
    let closet_front = closet_back.position.z;
    console.log("Drawer Back Z => "+drawer_back_face.position.z);
        console.log("Drawer Front Z => "+closet_front);
    if (drawer_back_face.position.z > closet_front + 3) {
      drawer_front_face.translateZ(-1);
      drawer_back_face.translateZ(-1);
      drawer_base_face.translateZ(-1);
      drawer_left_face.translateZ(-1);
      drawer_right_face.translateZ(-1);
      var context = this;
      requestAnimationFrame(function () {
        context.closeDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
      });
      this.render();
      this.controls.update();
    } else {
      this.openDrawers.pop();
      if (this.openDrawers.length == 0) {
        while (this.waitingDoors.length != 0) {
          this.waitingDoors.pop()();
        }
      }
    }
  }


  /**
   * Represents the action that occurs when the mouse's left button is released, which is
   * setting the selected object as null, since it is no longer being picked, and enabling
   * the rotation control
   */
  onMouseUp(event) {
    //Enables rotation again
    this.controls.enabled = true;
    //Sets the selected slot to null (the slot stops being selected)
    this.selected_slot = null;
    //Sets the selected face to null (the face stops being selected)
    this.selected_face = null;
    //Sets the selected closet component to null (the component stops being selected)
    this.selected_component = null;
  }

  /**
   * Represents the action that occurs when the mouse is dragged (mouse move), which
   * is interacting with the previously picked object on mouse down (moving it accross
   * the x axis)
   */
  onMouseMove(event) {
    event.preventDefault();

    var rect = event.target.getBoundingClientRect();
    var x = event.clientX;
    var y = event.clientY;
    this.mouse.x = (x - rect.left) / (this.canvasWebGL.clientWidth / 2.0) - 1.0; //Get mouse x position
    this.mouse.y = -((y - rect.bottom) / (this.canvasWebGL.clientHeight / 2.0) + 1.0); //Get mouse y position
    this.raycaster.setFromCamera(this.mouse, this.camera); //Set raycast position

    //If the selected object is a slot
    if (this.selected_slot && this.canMoveSlots) {
      this.moveSlot();
      return;
    }

    //If the selected object is a closet face
    if (this.selected_face && this.canMoveCloset) {
      this.moveFace();
      return;
    }

    //If the selected object is a closet pole or shelf
    if (this.selected_component && this.canMoveComponents) {
      this.moveComponent();
      return;
    }

    var intersects = this.raycaster.intersectObjects(this.scene.children[0].children);
    if (intersects.length > 0) {
      //Updates plane position to look at the camera
      var face = intersects[0].object;
      this.plane.setFromNormalAndCoplanarPoint(this.camera.position, face.position);

      if (this.hovered_object !== face) this.hovered_object = face;
    } else {
      if (this.hovered_object !== null) this.hovered_object = null;
    }
  }

  /**
   * Moves the slot across the defined plan that intersects the closet, without overlapping the closet's faces
   */
  moveSlot() {
    if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
      let newPosition = this.intersection.x - this.offset; //Subtracts the offset to the x coordinate of the intersection point
      let leftFace = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT).mesh();
      let valueCloset = leftFace.position.x;
      if (Math.abs(newPosition) < Math.abs(valueCloset)) { //Doesn't allow the slot to overlap the faces of the closet
        this.selected_slot.position.x = newPosition;
      }
    }
  }

  /**
   * Moves the face across the defined plan that intersects the closet, without overlapping the closet's slots
   */
  moveFace() {
    let closetSlotsFaces = this.closet.getClosetSlotFaces();
    if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
      let closetLeftFace = this.closet.getClosetFaces().get(FaceOrientationEnum.LEFT).mesh();
      let closetRightFace = this.closet.getClosetFaces().get(FaceOrientationEnum.RIGHT).mesh();
      if (this.selected_face == closetRightFace) { //If the selected face is the right one

        let rightFacePosition = this.intersection.x - this.offset + this.selected_face.position.x; //Position of the right closet face

        if (closetSlotsFaces.length == 0) { //If there are no slots
          this.selected_face.position.x = rightFacePosition;
          this.closet.changeClosetWidth(rightFacePosition);
          this.updateClosetGV();

        } else {
          let rightSlotPosition = closetSlotsFaces[closetSlotsFaces.length - 1].mesh().position.x; //Position of the last (more to the right) slot 

          if (rightFacePosition - rightSlotPosition > rightSlotPosition) { //Checks if right face doesn't intersect the slot
            this.selected_face.position.x = rightFacePosition;
            this.closet.changeClosetWidth(rightFacePosition);
            this.updateClosetGV();
          }
        }
      } else if (this.selected_face == closetLeftFace) { //If the selected face is the left one

        var leftFacePosition = -this.intersection.x - this.offset - this.selected_face.position.x; //Position of the left closet face

        if (closetSlotsFaces.length == 0) { //If there are no slots
          this.selected_face.position.x = leftFacePosition;
          this.closet.changeClosetWidth(leftFacePosition);
          this.updateClosetGV();
        } else {
          var leftSlotPosition = -this.group.getObjectById(closetSlotsFaces[0]).position.x; //Position of the first (more to the left) slot

          if (leftFacePosition - leftSlotPosition > leftSlotPosition) { //Checks if left face doesn't intersect the slot
            this.selected_face.position.x = leftFacePosition;
            this.closet.changeClosetWidth(leftFacePosition);
            this.updateClosetGV();
          }
        }
      }
    }
  }

  /**
   * Moves a component across the y axis without overlapping the slots planes or the closets planes
   */
  moveComponent() {
    if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
      var computedPosition = this.intersection.y - this.offset; //The component's new computed position on the yy axis
      let closetTopFace = this.closet.getClosetFaces().get(FaceOrientationEnum.TOP).mesh();
      let closetBaseFace = this.closet.getClosetFaces().get(FaceOrientationEnum.BASE).mesh();
      if (computedPosition < closetTopFace.position.y &&
        computedPosition >= closetBaseFace.position.y) {
        this.selected_component.position.y = computedPosition; //Sets the new position as long as the component stays within the closet boundaries
      }
    }

    var intersects = this.raycaster.intersectObjects(this.scene.children[0].children);
    if (intersects.length > 0) {
      //Updates plane position to look at the camera
      var object = intersects[0].object;
      this.plane.setFromNormalAndCoplanarPoint(this.camera.position, object.position);

      if (this.hovered_object !== object) this.hovered_object = object;
    } else if (this.hovered_object !== null) this.hovered_object = null;
  }

  /**
   * Returns the current closet width
   */
  getCurrentClosetWidth() {
    return this.closet.getClosetWidth();
  }

  /**
   * Returns the current closet height
   */
  getCurrentClosetHeight() {
    return this.closet.getClosetHeight();
  }

  /**
   * Returns the current closet depth
   */
  getCurrentClosetDepth() {
    return this.closet.getClosetDepth();
  }
}