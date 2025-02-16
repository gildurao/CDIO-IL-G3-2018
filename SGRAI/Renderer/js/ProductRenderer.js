/**
 * Global Variables for Graphic Control (Camera, Rendering, Scene, etc...)
 */
var camera, controls, scene, renderer, group;
/**
 * Global variable for 
 */
var textureLoader;

/**
 * Global variable for the Mesh Material.
 */
var material;

/**
 * Global variable with the current closet
 */
var closet = null;

/**
 * Global variable with the current closet faces ids (Mesh IDS from Three.js)
 */
var closet_faces_ids = [];

/**
 * Global variable with the current closet slots faces ids (Mesh IDS from Three.js)
 */
var closet_slots_faces_ids = [];

/**
 * Global variable with the current closet poles ids (Mesh IDs from Three.js)
 */
var closet_poles_ids = [];

/**
 * Global variable with the current closet shelves ids (Mesh IDs from Three.js)
 */
var closet_shelves_ids = [];

/**
 * Global variable with the current closet sliding doors ids (Mesh IDs from Three.js)
 */
var closet_sliding_doors_ids = [];

/**
 * Global variable with the current closet hinged doors ids (Mesh IDs from Three.js)
 */
var closet_hinged_doors_ids = [];

/**
 * Global variable with the current closet drawers ids (Mesh IDs from Three.js)
 */
var closet_drawers_ids = [];

/**
 * Global variable with the current closet drawer modules ids (Mesh IDs from Three.js)
 */
var closet_modules_ids = [];

/**
 * Global variable with the WebGL canvas
 */
var canvasWebGL;

// ------------ Global variables used to dinamically resize Slots ------------
/**
 * Global variables that represent the currently selected closet component (null if none)
 */
var selected_slot = null,
    selected_face = null,
    selected_component = null,
    selected_door = null;

/**
 * Global variable that represents the object being hovered (null if none)
 */
var hovered_object = null;

/**
 * Global variable that represents the plane that intersects the closet
 */
var plane = null;

/**
 * Global variable that represents the difference between the intersection's x coordinate
 * and the selected object's x coordinate
 */
var offset;

/**
 * Global variable with a Vector that holds the mouse coordinates (x, y)
 */
var mouse = new THREE.Vector2();

/**
 * Global variable with a Vector that represents the intersection between the plane and
 * the clicked object
 */
var intersection = new THREE.Vector3(0, 0, 0);

/**
 * Global variable with a Raycaster used for picking (hovering, clicking and identifying) objects
 */
var raycaster = new THREE.Raycaster();
// ------------ End of global variables used to dinamically resize Slots ------------

/**
 * Global variable that represents the thickness of the closet plank's thickness
 */
var thickness = 4.20;

/**
 * Global variables to know when to animate a drawer's movement
 */
var drawer_back_face = null,
    drawer_base_face = null,
    drawer_front_face = null,
    drawer_left_face = null,
    drawer_right_face = null;
/**
 * Global variable to know when to animate a hinged door 
 */
var hingedDoor = null;

/**
 * Global variable to know when to animate a sliding door
 */
var slidingDoor = null;

/**
 * Waiting list for doors that are waiting to be rendered (e.g. drawer animation has to end)
 */
var waitingDoors = [];

/**
 * Flag to know whether a drawer is closed or not
 */
var openDrawers = [];

/**
 * Flag to know whether a hinged door is closed or not
 */
var isHingedDoorClosed = false;

/**
 * Initial Product Draw function
 */
function main(textureSource) {
    canvasWebGL = document.getElementById("webgl");
    renderer = new THREE.WebGLRenderer({
        canvas: canvasWebGL,
        antialias: true
    });

    initCamera();
    initControls();
    initCloset(textureSource);
    initLighting();

    // var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    // geometry.scale(-1, 1, 1);

    // var material = new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load("./../../US4000/img/background.jpg")
    // });

    // var mesh = new THREE.Mesh(geometry, material);

    // renderer.setPixelRatio(window.devicePixelRatio);

    //Creates the intersection plane
    plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 200, 0)).normalize();

    var planeGeometry = new THREE.PlaneGeometry(500, 500);

    var coplanarPoint = plane.coplanarPoint();

    var focalPoint = new THREE.Vector3().copy(coplanarPoint).add(plane.normal);

    planeGeometry.lookAt(focalPoint);

    planeGeometry.translate(coplanarPoint.x, coplanarPoint.y, coplanarPoint.z);

    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
    });

    var dispPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    dispPlane.visible = false;
    //Finishes creating the intersection plane
    scene.add(dispPlane);
    scene.add(camera);
    //  scene.add(mesh);

    registerEvents();
    animate();
}

/**
 * Initiates the closet
 * @param {*} textureSource - Source of the texture being loaded.
 */
function initCloset(textureSource) {
    scene = new THREE.Scene();
    group = new THREE.Group();
    // closet = new Closet([604.5, thickness, 100, 0, -210, -295] //c a p x y z baixo
    //     , [604.5, thickness, 100, 0, 90, -295] // cima
    //     , [thickness, 300, 100, -300, -60, -295] // esq
    //     , [thickness, 300, 100, 300, -60, -295] //dir
    //     , [600, 300, 0, 0, -60, -345]); //tras

    closet = new Closet([204.5, thickness, 100, 0, 0, 0] //c a p x y z baixo
        , [204.5, thickness, 100, 0, 100, 0] // cima
        , [thickness, 100, 100, -100, 50, 0] // esq
        , [thickness, 100, 100, 100, 50, 0] //dir
        , [200, 100, 0, 0, 50, -50]); //tras

    var faces = closet.closet_faces;

    textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(textureSource);

    //A MeshPhongMaterial allows for shiny surfaces
    //A soft white light is being as specular light
    //The shininess value is the same as the matte finishing's value
    material = new THREE.MeshPhongMaterial( /*{ map: texture, specular: 0x404040, shininess: 20 }*/);
    for (var i = 0; i < faces.length; i++) {
        closet_faces_ids.push(generateParellepiped(faces[i][0], faces[i][1], faces[i][2], faces[i][3], faces[i][4], faces[i][5], material, group));
    }
    scene.add(group);
    renderer.setClearColor(0xFFFFFF, 1);
}

/**
 * Initializes the scene's lighting.
 */
function initLighting() {
    var spotlight = new THREE.SpotLight(0x404040);
    camera.add(spotlight);

    spotlight.target = group;
    var lightAmbient = new THREE.AmbientLight(0x404040);
    scene.add(lightAmbient);
}

/**
 * Updates current closet graphical view
 */
function updateClosetGV() {

    for (var i = 0; i < closet_faces_ids.length; i++) {
        var closet_face = group.getObjectById(closet_faces_ids[i]);
        closet_face.scale.x = getNewScaleValue(closet.getInitialClosetFaces()[i][0], closet.getClosetFaces()[i][0], closet_face.scale.x);
        closet_face.scale.y = getNewScaleValue(closet.getInitialClosetFaces()[i][1], closet.getClosetFaces()[i][1], closet_face.scale.y);
        closet_face.scale.z = getNewScaleValue(closet.getInitialClosetFaces()[i][2], closet.getClosetFaces()[i][2], closet_face.scale.z);
        closet_face.position.x = closet.getClosetFaces()[i][3];
        closet_face.position.y = closet.getClosetFaces()[i][4];
        closet_face.position.z = closet.getClosetFaces()[i][5];
    }

    for (var i = 0; i < closet_slots_faces_ids.length; i++) {
        var closet_face = group.getObjectById(closet_slots_faces_ids[i]);
        closet_face.scale.x = getNewScaleValue(closet.getInitialClosetSlotFaces()[i][0], closet.getClosetSlotFaces()[i][0], closet_face.scale.x);
        closet_face.scale.y = getNewScaleValue(closet.getInitialClosetSlotFaces()[i][1], closet.getClosetSlotFaces()[i][1], closet_face.scale.y);
        closet_face.scale.z = getNewScaleValue(closet.getInitialClosetSlotFaces()[i][2], closet.getClosetSlotFaces()[i][2], closet_face.scale.z);
        closet_face.position.x = closet.getClosetSlotFaces()[i][3];
        closet_face.position.y = closet.getClosetSlotFaces()[i][4];
        closet_face.position.z = closet.getClosetSlotFaces()[i][5];
    }
}


/**
 * Adds a slot to the current closet
 */
function addSlot() {
    addSlotNumbered(1);
}

/**
 * Adds a specified number of slots to the current closet
 */
function addSlotNumbered(slotsToAdd) {
    for (var i = 0; i < slotsToAdd; i++) {
        var slotFace = closet.addSlot();
        closet_slots_faces_ids.push(generateParellepiped(slotFace[0], slotFace[1], slotFace[2], slotFace[3], slotFace[4], slotFace[5], material, group));
    }
    updateClosetGV();
}

/**
 * Removes a slot from the current closet
 */
function removeSlot() {
    closet.removeSlot();
    var closet_slot_face_id = closet_slots_faces_ids.pop();
    group.remove(group.getObjectById(closet_slot_face_id));
    updateClosetGV();
}

/**
 * Changes the dimensions of the closet
 * @param {number} width Number with the closet width
 * @param {number} height Number with the closet height
 * @param {number} depth Number with the closet depth
 */
function changeClosetDimensions(width, height, depth, index) {
    width = width / 2;
    //If there aren't any slots, the width has no restrictions
    if (closet_slots_faces_ids.length == 0) {
        closet.changeClosetWidth(width);
        closet.changeClosetHeight(height);
        closet.changeClosetDepth(depth);
        updateClosetGV();
    } else { //If there is at least one slot, the closet wall can't overlap it
        var firstSlot = Math.abs(group.getObjectById(closet_slots_faces_ids[0]).position.x);
        var wall = Math.abs(group.getObjectById(closet_faces_ids[index]).position.x) - firstSlot;

        if (wall <= firstSlot) { //!TODO change if-condition from wall <= firstSlot to wall <= minimumSlotSize
            document.getElementById("width").value = getCurrentClosetWidth();
        } else {
            closet.changeClosetWidth(width);
        }
        closet.changeClosetHeight(height);
        closet.changeClosetDepth(depth);
        updateClosetGV();
    }
}

/**
 * Applies the texture to the closet.
 * @param {*} texture - texture being applied.
 */
function applyTexture(texture) {
    textureLoader.load(texture, function (tex) {
        material.map = tex;
    })
}

function addComponent(component, slot) {
    if (component.toUpperCase() == "Pole".toUpperCase()) generateCylinder(slot);
    if (component.toUpperCase() == "Drawer".toUpperCase()) {
        checkAddDrawerTriggers(slot);
    }
    if (component.toUpperCase() == "Shelf".toUpperCase()) generateShelf(slot);
    if (component.toUpperCase() == "Sliding Door".toUpperCase()) {
        checkAddSlidingDoorTriggers();
    }
    if (component.toUpperCase() == "Door".toUpperCase()) {
        checkAddHingedDoorTriggers(slot);
    }
}

function checkAddDrawerTriggers(slot) {
    generateDrawer(slot);
    if (doesSlotHaveHingedDoor(slot)) {
        if (!isHingedDoorClosed) {
            hingedDoor = group.getObjectById(closet_hinged_doors_ids[slot - 1]);
            requestAnimationFrame(openHingedDoor);
        }
    }
    if (doesClosetHaveSlidingDoors()) {
        var front_door = group.getObjectById(closet_sliding_doors_ids[0]);
        var back_door = group.getObjectById(closet_sliding_doors_ids[1]);
        //Front face of the last added drawer is always at index length - 4
        var addedDrawer = group.getObjectById(closet_drawers_ids[closet_drawers_ids.length - 4]);
        if (addedDrawer.position.x < 0) {
            if (front_door.position.x < 0) {
                slidingDoor = front_door;
                slideDoorToRight();
            }
            if (back_door.position.x < 0) {
                slidingDoor = back_door;
                slideDoorToLeft();
            }
        } else {
            if (front_door.position.x > 0) {
                slidingDoor = front_door;
                slideDoorToLeft();
            }
            if (back_door.position.x > 0) {
                slidingDoor = back_door;
                slideDoorToRight();
            }
        }

    }
}

function checkAddSlidingDoorTriggers() {
    if (doesClosetHaveHingedDoors()) {
        alert("There are closet slots that have hinged doors!");
    } else {
        if (doesClosetHaveOpenDrawers()) {
            if (openDrawers.length > 0) {
                waitingDoors.push(function () {
                    generateSlidingDoor();
                });
                closeAllOpenDrawers();
            } else {
                generateSlidingDoor();
            }
        } else {
            generateSlidingDoor();
        }
    }
}

function checkAddHingedDoorTriggers(slot) {
    if (doesSlotHaveHingedDoor(slot)) {
        alert("This slot already has a door!");
    } else if (doesClosetHaveSlidingDoors()) {
        alert("The closet already has sliding doors!");
    } else {
        if (doesSlotHaveOpenDrawers(slot)) {
            if (openDrawers.length > 0) {
                waitingDoors.push(function () {
                    addHingedDoor(slot);
                });
                closeSlotOpenDrawers(slot);
            } else {
                addHingedDoor(slot);
            }
        } else {
            addHingedDoor(slot);
        }
    }
}

function addHingedDoor(slot) {
    if (openDrawers.length == 0) {
        generateHingedDoor(slot);
    } else {
        generateHingedDoor(slot);
    }
}

function closeSlotOpenDrawers(slot) {
    var i = 0;
    var index = 0;
    var closet_front = Math.abs(group.getObjectById(closet_faces_ids[4]).position.z);
    while (i < closet_drawers_ids.length) {
        if (closet.drawers[index].slotId == slot) {
            console.log(closet.drawers[index]);
            var drawer_front_face = group.getObjectById(closet_drawers_ids[5 * index + 1]);
            if (drawer_front_face.position.z > closet_front) {
                var drawer_base_face = group.getObjectById(closet_drawers_ids[5 * index]);
                var drawer_left_face = group.getObjectById(closet_drawers_ids[5 * index + 2]);
                var drawer_right_face = group.getObjectById(closet_drawers_ids[5 * index + 3]);
                var drawer_back_face = group.getObjectById(closet_drawers_ids[5 * index + 4]);
                closeDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
            }
        }
        i += 5;
        index++;
    }
}

function closeAllOpenDrawers() {
    var i = 0;
    var index = 0;
    var closet_front = Math.abs(group.getObjectById(closet_faces_ids[4]).position.z);
    while (i < closet_drawers_ids.length) {
        var drawer_front_face = group.getObjectById(closet_drawers_ids[5 * index + 1]);
        if (drawer_front_face.position.z > closet_front) {
            var drawer_base_face = group.getObjectById(closet_drawers_ids[5 * index]);
            var drawer_left_face = group.getObjectById(closet_drawers_ids[5 * index + 2]);
            var drawer_right_face = group.getObjectById(closet_drawers_ids[5 * index + 3]);
            var drawer_back_face = group.getObjectById(closet_drawers_ids[5 * index + 4]);
            closeDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
        }
        i += 5;
        index++;
    }
}


function doesSlotHaveHingedDoor(slot) {
    for (let i = 0; i < closet_hinged_doors_ids.length; i++) {
        if (closet.hingedDoors[i].slotId == slot) {
            return true;
        }
    }
    return false;
}

function doesSlotHaveOpenDrawers(slot) {
    var closet_front = Math.abs(group.getObjectById(closet_faces_ids[4]).position.z);
    var index = 0;
    for (let i = 0; i < closet_drawers_ids.length; i += 6) {
        if (closet.drawers[index].slotId == slot) {
            return group.getObjectById(closet_drawers_ids[5 * index + 1]).position.z
                >= closet_front;
        }
        index++;
    }
    return false;
}

function doesClosetHaveOpenDrawers() {
    var closet_front = Math.abs(group.getObjectById(closet_faces_ids[4]).position.z);
    var index = 0;
    for (let i = 0; i < closet_drawers_ids.length; i += 6) {
        if (i > 0) index = i - 5;
        return group.getObjectById(closet_drawers_ids[5 * index + 1]).position.z
            >= closet_front;
    }
    return false;
}

function doesClosetHaveHingedDoors() {
    return closet.hingedDoors.length != 0;
}

function doesClosetHaveSlidingDoors() {
    return closet.slidingDoors.length != 0;
}

/**
 * Changes the closet's material's shininess.
 * @param {*} shininess - new shininess value
 */
function changeShininess(shininess) {
    material.shininess = shininess;
}

function changeColor(color) {
    material.color.setHex(color);
}

/**
 * Changes the current closet slots
 * @param {number} slots Number with the new closet slots
 */
function changeClosetSlots(slots) {
    var newSlots = closet.computeNewClosetSlots(slots);
    if (newSlots > 0) {
        for (var i = 0; i < newSlots; i++) {
            addSlot();
        }
    } else {
        newSlots = -newSlots;
        if (newSlots > 0) {
            for (var i = 0; i < newSlots; i++) {
                removeSlot();
            }
        }
    }

    updateClosetGV();
}

function reloadClosetSlots2(slotWidths) {
    changeClosetSlots(slots);
    if (slotWidths.length > 0) {
        for (let i = 0; i < slotWidths.length; i++) {
            var maxPosition = group.getObjectById(closet_faces_ids[3]).position.x;
            var closetWidth = getCurrentClosetWidth();
            var newPosition = (slotWidths[i] * maxPosition) / closetWidth;
            group.getObjectById(closet_slots_faces_ids[i]).position.x = newPosition;
        }
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
function generateParellepiped(width, height, depth, x, y, z, material, group) {
    var parellepipedGeometry = new THREE.CubeGeometry(width, height, depth);
    var parellepiped = new THREE.Mesh(parellepipedGeometry, material);
    parellepiped.position.x = x;
    parellepiped.position.y = y;
    parellepiped.position.z = z;
    group.add(parellepiped);
    return parellepiped.id;
}

/**
 * Removes a pole from the current closet
 */
function removePole() {
    closet.removePole();
    var closet_pole_id = closet_poles_ids.pop();
    group.remove(group.getObjectById(closet_pole_id));
    updateClosetGV();
}

/**
 * Generates a cylinder with given properties on a certain position relative to axis x,y and z
 * @param {THREE.Material} material cylinder's material
 * @param {THREE.Group} group cylinder's group
 */
function generateCylinder(slot) {
    var leftFace = group.getObjectById(closet_faces_ids[2]),
        rightFace = group.getObjectById(closet_faces_ids[3]);
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
    if (closet_slots_faces_ids.length == 0) {
        height = getCurrentClosetWidth();
        pole.changePoleHeight(height);
        x = calculateComponentPosition(rightFace.position.x, leftFace.position.x);
        y = calculateComponentPosition(rightFace.position.y, leftFace.position.y);
        z = calculateComponentPosition(rightFace.position.z, leftFace.position.z);

    } else if (slot == 1) { //Pole is added in between the closet's left face and first slot
        let firstSlot = group.getObjectById(closet_slots_faces_ids[0]);
        height = calculatePoleHeight(leftFace.position.x, firstSlot.position.x);
        pole.changePoleHeight(height);
        x = calculateComponentPosition(leftFace.position.x, firstSlot.position.x);
        y = calculateComponentPosition(leftFace.position.y, firstSlot.position.y);
        z = calculateComponentPosition(leftFace.position.z, firstSlot.position.z);

    } else if (slot > 1 && slot <= closet_slots_faces_ids.length) { //Pole is added between slots w/ indexes [slot - 1] and [slot]
        let slotToTheLeft = group.getObjectById(closet_slots_faces_ids[slot - 2]);
        let slotToTheRight = group.getObjectById(closet_slots_faces_ids[slot - 1]);
        height = calculatePoleHeight(slotToTheLeft.position.x, slotToTheRight.position.x);
        pole.changePoleHeight(height);
        x = calculateComponentPosition(slotToTheLeft.position.x, slotToTheRight.position.x);
        y = calculateComponentPosition(slotToTheLeft.position.y, slotToTheRight.position.y);
        z = calculateComponentPosition(slotToTheLeft.position.z, slotToTheRight.position.z);

    } else { //Pole is added between the last slot and the closet's right face
        let lastSlot = group.getObjectById(closet_slots_faces_ids[slot - 2]);
        height = calculatePoleHeight(lastSlot.position.x, rightFace.position.x);
        pole.changePoleHeight(height);
        x = calculateComponentPosition(lastSlot.position.x, rightFace.position.x);
        y = calculateComponentPosition(lastSlot.position.y, rightFace.position.y);
        z = calculateComponentPosition(lastSlot.position.z, rightFace.position.z);
    }
    var cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, pole.getPoleHeight(),
        radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
    var poleMesh = new THREE.Mesh(cylinderGeometry, material);
    poleMesh.position.x = x;
    poleMesh.position.y = y;
    poleMesh.position.z = z;
    poleMesh.rotation.z = Math.PI / 2;
    closet.addPole(pole);
    group.add(poleMesh);
    closet_poles_ids.push(poleMesh.id);
}

function generateShelf(slot) {
    var leftFace = group.getObjectById(closet_faces_ids[2]);
    var rightFace = group.getObjectById(closet_faces_ids[3]);
    var height = 3;
    var depth = closet.getClosetDepth();
    var width;
    var x, y, z;

    //For now this follows the same logic as the pole, it should be changed to whatever dimensions the shelf is allowed to have
    if (closet_slots_faces_ids.length == 0) {
        width = getCurrentClosetWidth();
        x = calculateComponentPosition(rightFace.position.x, leftFace.position.x);
        y = calculateComponentPosition(rightFace.position.y, leftFace.position.y);
        z = calculateComponentPosition(rightFace.position.z, leftFace.position.z);
    } else if (slot == 1) {
        let firstSlot = group.getObjectById(closet_slots_faces_ids[0]);
        width = calculateDistance(leftFace.position.x, firstSlot.position.x);
        x = calculateComponentPosition(leftFace.position.x, firstSlot.position.x);
        y = calculateComponentPosition(leftFace.position.y, firstSlot.position.y);
        z = calculateComponentPosition(leftFace.position.z, firstSlot.position.z);
    } else if (slot > 1 && slot <= closet_slots_faces_ids.length) {
        let slotToTheLeft = group.getObjectById(closet_slots_faces_ids[slot - 2]);
        let slotToTheRight = group.getObjectById(closet_slots_faces_ids[slot - 1]);
        width = calculateDistance(slotToTheLeft.position.x, slotToTheRight.position.x);
        x = calculateComponentPosition(slotToTheLeft.position.x, slotToTheRight.position.x);
        y = calculateComponentPosition(slotToTheLeft.position.y, slotToTheRight.position.y);
        z = calculateComponentPosition(slotToTheLeft.position.z, slotToTheRight.position.z);
    } else {
        let lastSlot = group.getObjectById(closet_slots_faces_ids[slot - 2]);
        width = calculateDistance(lastSlot.position.x, rightFace.position.x);
        x = calculateComponentPosition(lastSlot.position.x, rightFace.position.x);
        y = calculateComponentPosition(lastSlot.position.y, rightFace.position.y);
        z = calculateComponentPosition(lastSlot.position.z, rightFace.position.z);
    }

    var shelf = new Shelf([width, height, depth, x, y, z]);
    var meshID = generateParellepiped(width, height, depth, x, y, z, material, group);
    closet.addShelf(shelf);
    closet_shelves_ids.push(meshID);
}

function generateDrawer(slot) {

    var leftFace = group.getObjectById(closet_faces_ids[2]);
    var rightFace = group.getObjectById(closet_faces_ids[3]);
    var depthDrawer = 3;
    var heightDrawer = 15;
    var depthCloset = closet.getClosetDepth();
    var width;
    var x, y, z;
    var spaceDrawerModule = 10;

    //For now this follows the same logic as the pole, it should be changed to whatever dimensions the shelf is allowed to have
    if (closet_slots_faces_ids.length == 0) {
        width = getCurrentClosetWidth();
        x = calculateComponentPosition(rightFace.position.x, leftFace.position.x);
        y = calculateComponentPosition(rightFace.position.y, leftFace.position.y);
        z = calculateComponentPosition(rightFace.position.z, leftFace.position.z);
    } else if (slot == 1) {
        let firstSlot = group.getObjectById(closet_slots_faces_ids[0]);
        width = calculateDistance(leftFace.position.x, firstSlot.position.x);
        x = calculateComponentPosition(leftFace.position.x, firstSlot.position.x);
        y = calculateComponentPosition(leftFace.position.y, firstSlot.position.y);
        z = calculateComponentPosition(leftFace.position.z, firstSlot.position.z);
    } else if (slot > 1 && slot <= closet_slots_faces_ids.length) {
        let slotToTheLeft = group.getObjectById(closet_slots_faces_ids[slot - 2]);
        let slotToTheRight = group.getObjectById(closet_slots_faces_ids[slot - 1]);
        width = calculateDistance(slotToTheLeft.position.x, slotToTheRight.position.x);
        x = calculateComponentPosition(slotToTheLeft.position.x, slotToTheRight.position.x);
        y = calculateComponentPosition(slotToTheLeft.position.y, slotToTheRight.position.y);
        z = calculateComponentPosition(slotToTheLeft.position.z, slotToTheRight.position.z);
    } else {
        let lastSlot = group.getObjectById(closet_slots_faces_ids[slot - 2]);
        width = calculateDistance(lastSlot.position.x, rightFace.position.x);
        x = calculateComponentPosition(lastSlot.position.x, rightFace.position.x);
        y = calculateComponentPosition(lastSlot.position.y, rightFace.position.y);
        z = calculateComponentPosition(lastSlot.position.z, rightFace.position.z);
    }
    var module = new Module([width, depthDrawer, depthCloset, x, y - (spaceDrawerModule / 4), z], ///Base
        [width, depthDrawer, depthCloset, x, y + heightDrawer + (spaceDrawerModule / 4), z], ///Cima
        [depthDrawer, heightDrawer + (spaceDrawerModule / 4), depthCloset, x - (width / 2), y + (heightDrawer / 2), z], ///Left
        [depthDrawer, heightDrawer + (spaceDrawerModule / 4), depthCloset, x + (width / 2), y + (heightDrawer / 2), z]); ///Rigtht
    var borders = module.module_faces;
    for (var i = 0; i < borders.length; i++) {
        closet_modules_ids.push(generateParellepiped(borders[i][0],
            borders[i][1], borders[i][2], borders[i][3],
            borders[i][4], borders[i][5], material, group));
    }
    var drawer = new Drawer([width - spaceDrawerModule, depthDrawer, depthCloset, x, y + (depthDrawer / 2), z], ///Base
        [width - spaceDrawerModule, heightDrawer, depthDrawer, x, y + (heightDrawer / 2), z + (depthCloset / 2) - (depthDrawer / 2)], ///Frent
        [depthDrawer, heightDrawer, depthCloset - (depthDrawer / 2), x - (width / 2) + (spaceDrawerModule / 2), y + (heightDrawer / 2), z], ///Left
        [depthDrawer, heightDrawer, depthCloset - (depthDrawer / 2), x + (width / 2) - (spaceDrawerModule / 2), y + (heightDrawer / 2), z], ///Right
        [width - spaceDrawerModule, heightDrawer, depthDrawer, x, y + (heightDrawer / 2), z - (depthCloset / 2) + (depthDrawer / 2)],
        slot); ///Back
    var borders_drawer = drawer.drawer_faces;

    for (var i = 0; i < borders_drawer.length; i++) {
        closet_drawers_ids.push(generateParellepiped(borders_drawer[i][0],
            borders_drawer[i][1], borders_drawer[i][2], borders_drawer[i][3],
            borders_drawer[i][4], borders_drawer[i][5], material, group));
    }

    closet.addModule(module);
    closet.addDrawer(drawer);
}

function generateHingedDoor(slot) {
    var leftFace = group.getObjectById(closet_faces_ids[2]);
    var rightFace = group.getObjectById(closet_faces_ids[3]);
    var depth = 3;
    var height = closet.getClosetHeight();
    var depth_closet = closet.getClosetDepth();
    var width;
    var x, y, z;

    //For now this follows the same logic as the pole, it should be changed to whatever dimensions the shelf is allowed to have
    if (closet_slots_faces_ids.length == 0) {
        width = getCurrentClosetWidth();
        x = calculateComponentPosition(rightFace.position.x, leftFace.position.x);
        y = calculateComponentPosition(rightFace.position.y, leftFace.position.y);
        z = calculateComponentPosition(rightFace.position.z, leftFace.position.z);
    } else if (slot == 1) {
        let firstSlot = group.getObjectById(closet_slots_faces_ids[0]);
        width = calculateDistance(leftFace.position.x, firstSlot.position.x);
        x = calculateComponentPosition(leftFace.position.x, firstSlot.position.x);
        y = calculateComponentPosition(leftFace.position.y, firstSlot.position.y);
        z = calculateComponentPosition(leftFace.position.z, firstSlot.position.z);
    } else if (slot > 1 && slot <= closet_slots_faces_ids.length) {
        let slotToTheLeft = group.getObjectById(closet_slots_faces_ids[slot - 2]);
        let slotToTheRight = group.getObjectById(closet_slots_faces_ids[slot - 1]);
        width = calculateDistance(slotToTheLeft.position.x, slotToTheRight.position.x);
        x = calculateComponentPosition(slotToTheLeft.position.x, slotToTheRight.position.x);
        y = calculateComponentPosition(slotToTheLeft.position.y, slotToTheRight.position.y);
        z = calculateComponentPosition(slotToTheLeft.position.z, slotToTheRight.position.z);
    } else {
        let lastSlot = group.getObjectById(closet_slots_faces_ids[slot - 2]);
        width = calculateDistance(lastSlot.position.x, rightFace.position.x);
        x = calculateComponentPosition(lastSlot.position.x, rightFace.position.x);
        y = calculateComponentPosition(lastSlot.position.y, rightFace.position.y);
        z = calculateComponentPosition(lastSlot.position.z, rightFace.position.z);
    }

    var meshID = generateParellepiped(width, height, depth, x, y, z + (depth_closet / 2), material, group);
    var hingedDoor = new HingedDoor([width, height, depth, x, y, z + (depth_closet / 2)], slot, meshID);
    closet.addHingedDoor(hingedDoor);
    closet_hinged_doors_ids.push(meshID);
}

function generateSlidingDoor() {
    var leftFace = group.getObjectById(closet_faces_ids[2]);
    var rightFace = group.getObjectById(closet_faces_ids[3]);
    var topFace = group.getObjectById(closet_faces_ids[1]);
    var bottomFace = group.getObjectById(closet_faces_ids[0]);
    var height = closet.getClosetHeight();
    var width = closet.getClosetWidth();
    var y = closet.getClosetDepth() / 2;

    var front_door = new SlidingDoor([width / 2, (height - thickness), 5, leftFace.position.x / 2, leftFace.position.y, y + 7]);

    var front_frame = new Module([width, thickness, 5, bottomFace.position.x, bottomFace.position.y, y + 7],
        [width, thickness, 5, topFace.position.x, topFace.position.y, y + 7],
        [thickness, height, 5, leftFace.position.x, leftFace.position.y, y + 7],
        [thickness, height, 5, rightFace.position.x, rightFace.position.y, y + 7]);

    var back_door = new SlidingDoor([width / 2, (height - thickness), 5, rightFace.position.x / 2, rightFace.position.y, y + 2]);

    var back_frame = new Module([width, thickness, 5, bottomFace.position.x, bottomFace.position.y, y + 2],
        [width, thickness, 5, topFace.position.x, topFace.position.y, y + 2],
        [thickness, height, 5, leftFace.position.x, leftFace.position.y, y + 2],
        [thickness, height, 5, rightFace.position.x, rightFace.position.y, y + 2]);

    //Adds front frame
    var borders = front_frame.module_faces;
    for (var i = 0; i < borders.length; i++) {
        generateParellepiped(borders[i][0],
            borders[i][1], borders[i][2], borders[i][3],
            borders[i][4], borders[i][5], material, group);
    }

    //Adds front door
    var front_door_mesh_id = generateParellepiped(
        front_door.sliding_door_axes[0],
        front_door.sliding_door_axes[1],
        front_door.sliding_door_axes[2],
        front_door.sliding_door_axes[3],
        front_door.sliding_door_axes[4],
        front_door.sliding_door_axes[5],
        material, group);

    //Adds back door
    var back_door_mesh_id = generateParellepiped(
        back_door.sliding_door_axes[0],
        back_door.sliding_door_axes[1],
        back_door.sliding_door_axes[2],
        back_door.sliding_door_axes[3],
        back_door.sliding_door_axes[4],
        back_door.sliding_door_axes[5],
        material, group);

    closet.addSlidingDoor(front_door);
    closet.addSlidingDoor(back_door);

    closet_sliding_doors_ids.push(front_door_mesh_id);
    closet_sliding_doors_ids.push(back_door_mesh_id);

    //Adds back frame
    var borders = back_frame.module_faces;
    for (var i = 0; i < borders.length; i++) {
        generateParellepiped(borders[i][0],
            borders[i][1], borders[i][2], borders[i][3],
            borders[i][4], borders[i][5], material, group);
    }
}


/**
 * Calculates a pole's height
 * @param {Number} topPosition position of the top surface of the pole 
 * @param {Number} bottomPosition position of the bottom surface of the pole
 */
function calculatePoleHeight(topPosition, bottomPosition) {
    return Math.abs(topPosition - bottomPosition);
}

/**
 * Calculates a pole's xyz position
 * @param {Number} leftMostCoordinate xyz coordinate of a closet's wall or a slot that is more to the left
 * @param {Number} rightMostCoordinate xyz coordinate of a closet's wall or a slot that is more to the right
 */
function calculateComponentPosition(leftMostCoordinate, rightMostCoordinate) {
    return (leftMostCoordinate + rightMostCoordinate) / 2;
}

function calculateDistance(topPosition, bottomPosition) {
    return Math.abs(topPosition - bottomPosition);
}

/**
 * Animates the scene
 */
function animate() {
    //animate the scene at 60 frames per second
    //setTimeout(function () {
    requestAnimationFrame(animate);
    //}, 1000 / 60);
    controls.update();
    render();
}

/**
 * Renders the scene
 */
function render() {
    renderer.render(scene, camera);
}

/**
 * Initializes the graphic representation controls
 */
function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.target = new THREE.Vector3(0, 0, 0);

    controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;

    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI / 2;

    canvasWebGL.addEventListener('mousedown', onDocumentMouseDown, false);
    canvasWebGL.addEventListener('mousemove', onDocumentMouseMove, false);
    canvasWebGL.addEventListener('mouseup', onDocumentMouseUp, false);
}

/**
 * Initializes the graphic representation camera
 */
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 1000);
    camera.position.y = 400;
    camera.position.z = 400;
    camera.rotation.x = .70;
}

/**
 * Computes the new scale value based on the initial scale value, new scale value and the current scale value
 * @param {number} initialScaleValue Number with the initial scale value
 * @param {number} newScaleValue Number with the new scale value
 * @param {number} currentScaleValue Number with the current scale value
 */
function getNewScaleValue(initialScaleValue, newScaleValue, currentScaleValue) {
    if (initialScaleValue == 0) return 0;
    return (newScaleValue * 1) / initialScaleValue;
}

/**
 * Remove when found a better way
 * @deprecated No need to use this function since the material is now a global variable.
 */
function createMaterialWithTexture() {

    //var texture = new THREE.TextureLoader().load( '../Renderer/textures/cherry_wood_cabinets.jpg' );
    //var material = new THREE.MeshBasicMaterial( { map: texture } );


    //return material; 
    return new THREE.MeshNormalMaterial();
}


function renderDroppedComponent(event){
    var componentData = event.detail.componentData;
    var rect = event.detail.boundingRect;
    var x = event.detail.clientX;
    var y = event.detail.clientY;
    mouse.x = (x - rect.left) / (canvasWebGL.clientWidth / 2.0) - 1.0; //Get mouse x position
    mouse.y = -((y - rect.bottom) / (canvasWebGL.clientHeight / 2.0) + 1.0); //Get mouse y position
    raycaster.setFromCamera(mouse, camera); //Set raycast position
    //Finds all intersected objects (closet faces)
    var intersects = raycaster.intersectObjects(scene.children[0].children);

    //Check if the raycaster intersected anything
    if (intersects.length > 0) {
        //Gets the raycaster point
        var raycasterPointX = intersects[0].point.x;
        
        //Snapping to know where the component is going to be rendered

        if(closet_slots_faces_ids.length == 0){
            addComponent(componentData, 0);
        }else if(closet_slots_faces_ids){

            var distanceFromRaycasterRayToSlot = [];

            for(let i = 0; i < closet_slots_faces_ids.length; i++){
                let currentSlot = group.getObjectById(closet_slots_faces_ids[i]);

                distanceFromRaycasterRayToSlot.push(
                    Math.abs(currentSlot.position.x - raycasterPointX)
                );
            }

            var closetRightFace = group.getObjectById(closet_faces_ids[3]);
            var minDistance = Math.min.apply(null, distanceFromRaycasterRayToSlot);
            var distanceFromRaycasterRayToClosetRightFace = Math.abs(closetRightFace.position.x - raycasterPointX);

            if(minDistance < distanceFromRaycasterRayToClosetRightFace){
                let slotId = distanceFromRaycasterRayToSlot.indexOf(minDistance) + 1;
                addComponent(componentData, slotId);
            }else{
                addComponent(componentData,closet_slots_faces_ids.length+1);
            }
        }
    }else{
        alert("You have to drop the component inside the closet!");
    }
}

/**
 * Register the events that can be communicated through the document
 */
function registerEvents() {
    
    document.addEventListener("dropComponent", function(dropComponentEvent){
        renderDroppedComponent(dropComponentEvent);
    });

    document.addEventListener("changeDimensions", function (changeDimensionsEvent) {
        changeClosetDimensions(changeDimensionsEvent.detail.width, changeDimensionsEvent.detail.height,
            changeDimensionsEvent.detail.depth, changeDimensionsEvent.detail.index);
    });

    document.addEventListener("forceOnMouseUp", function (forceOnMouseUpEvent) {
        onDocumentMouseUp(forceOnMouseUpEvent);
    });

    document.addEventListener("changeSlots", function (changeSlotsEvent) {
        changeClosetSlots(changeSlotsEvent.detail.slots);
    });

    document.addEventListener("reloadClosetSlots", function (reloadClosetSlotsEvent) {
        reloadClosetSlots2(reloadClosetSlotsEvent.detail.slotWidths);
    });

    document.addEventListener("changeMaterial", function (changeMaterialEvent) {
        applyTexture(changeMaterialEvent.detail.material);
    });

    document.addEventListener("addComponent", function (addComponentEvent) {
        addComponent(addComponentEvent.component, addComponentEvent.slots);
    });

    document.addEventListener("changeShininess", function (changeShininessEvent) {
        changeShininess(changeShininessEvent.detail.shininess);
    });

    document.addEventListener("changeColor", function (changeColorEvent) {
        changeColorEvent(changeColorEvent.detail.color);
    });
}

/**
 * Represents the action that occurs when the mouse's left button is pressed (mouse down),
 * which is recognizing the object being clicked on, setting it as the selected one if
 * it is a slot and disabling the rotation control
 */
function onDocumentMouseDown(event) {
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    //Finds all intersected objects (closet faces)
    var intersects = raycaster.intersectObjects(scene.children[0].children);

    //Checks if any closet face was intersected
    if (intersects.length > 0) {
        //Gets the closest (clicked) object
        var face = intersects[0].object;

        //Checks if the selected closet face isn't a slot
        if (document.getElementById("dimensions").style.display != "none") {
            if ((group.getObjectById(closet_faces_ids[3])) == (face) ||
                (group.getObjectById(closet_faces_ids[2])) == (face)) {
                //Disables rotation while moving the face
                controls.enabled = false;
                //Sets the selection to the current face
                selected_face = face;
                if (raycaster.ray.intersectPlane(plane, intersection)) {
                    offset = intersection.x - selected_face.position.x;
                }
            }
        }

        if (document.getElementById("slots").style.display != "none") {
            //Checks if the selected closet face is a slot 
            for (var i = 0; i < closet_slots_faces_ids.length; i++) {
                var closet_face = group.getObjectById(closet_slots_faces_ids[i]);

                if ((closet_face) == (face)) {
                    //Disables rotation while moving the slot
                    controls.enabled = false;
                    //Sets the selection to the current slot
                    selected_slot = face;
                    if (raycaster.ray.intersectPlane(plane, intersection)) {
                        offset = intersection.x - selected_slot.position.x;
                    }
                }
            }
        }

        if (document.getElementById("components").style.display != "none") {
            //Checks if the selected object is a pole
            for (let j = 0; j < closet_poles_ids.length; j++) {
                let pole = group.getObjectById(closet_poles_ids[j]);
                if (pole == face) {
                    controls.enabled = false;
                    selected_component = face;
                    if (raycaster.ray.intersectPlane(plane, intersection)) {
                        offset = intersection.x - selected_component.position.x;
                    }
                }
            }

            //Checks if the selected object is a shelf
            for (let j = 0; j < closet_shelves_ids.length; j++) {
                let shelf = group.getObjectById(closet_shelves_ids[j]);
                if (shelf == face) {
                    controls.enabled = false;
                    selected_component = face;
                    if (raycaster.ray.intersectPlane(plane, intersection)) {
                        offset = intersection.x - selected_component.position.x;
                    }
                }
            }

            var flagOpen = false;
            var flagClose = false;
            var j = 0;

            //Checks if the selected object is a door

            while (!flagOpen && !flagClose && j < closet_sliding_doors_ids.length) {
                slidingDoor = group.getObjectById(closet_sliding_doors_ids[j]);
                if (slidingDoor == face) {
                    controls.enabled = false;
                    if (slidingDoor.position.x < 0) {
                        flagClose = true; //"Closing" ==> slide door to the right
                    } else {
                        flagOpen = true; //"Opening" ==> slide door to the left
                    }
                }
                j++;
            }

            if (flagOpen) {
                requestAnimationFrame(slideDoorToLeft);
            } else if (flagClose) {
                requestAnimationFrame(slideDoorToRight);
            }

            flagOpen = false;
            flagClose = false;
            j = 0;

            while (!flagOpen && !flagClose && j < closet_drawers_ids.length) {
                //Always get the front face of any drawer at index 5*j+1
                var drawer_front_face = group.getObjectById(closet_drawers_ids[5 * j + 1]);
                //Check if the selected object is a drawer's front face
                if (drawer_front_face == face) {
                    controls.enabled = false;
                    var drawer_base_face = group.getObjectById(closet_drawers_ids[5 * j]);
                    var drawer_left_face = group.getObjectById(closet_drawers_ids[5 * j + 2]);
                    var drawer_right_face = group.getObjectById(closet_drawers_ids[5 * j + 3]);
                    var drawer_back_face = group.getObjectById(closet_drawers_ids[5 * j + 4]);
                    if (drawer_front_face.position.z >= 130) {
                        flagClose = true;
                    } else {
                        flagOpen = true;
                    }
                }
                j++;
            }
            if (flagOpen) {
                requestAnimationFrame(function () {
                    openDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
                });
            } else if (flagClose) {
                requestAnimationFrame(function () {
                    closeDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
                });
            }


            j = 0;
            flagOpen = false;
            flagClose = false;
            while (!flagOpen && !flagClose && j < closet_hinged_doors_ids.length) {
                hingedDoor = group.getObjectById(closet_hinged_doors_ids[j]);
                var closet_face = group.getObjectById(closet_faces_ids[0]);
                if (hingedDoor == face) {
                    controls.enabled = false;
                    if (hingedDoor.rotation.y < 0) {
                        flagClose = true;
                    } else {
                        flagOpen = true;
                    }
                }
                j++;
            }
            if (flagOpen) {
                requestAnimationFrame(openHingedDoor);
            } else if (flagClose) {
                requestAnimationFrame(closeHingedDoor);
            }
        }
    }
}

var slideDoorToLeft = function () {
    if (doesClosetHaveOpenDrawers()) {
        waitingDoors.push(slideDoorToLeftAnimation);
        closeAllOpenDrawers();
    } else {
        slideDoorToLeftAnimation();
    }
}

function slideDoorToLeftAnimation() {
    let closet_left = group.getObjectById(closet_faces_ids[2]);
    let distanceFromDoorToLeftFace = Math.abs(slidingDoor.position.x - closet_left.position.x);
    let position = (Math.abs(closet_left.position.x - closet_left.geometry.parameters.width) / 2) - 2;
    if (position < distanceFromDoorToLeftFace) {
        slidingDoor.translateX(-1);
        requestAnimationFrame(slideDoorToLeft);
        render();
        controls.update();
    }
}

var slideDoorToRight = function () {
    if (doesClosetHaveOpenDrawers()) {
        waitingDoors.push(slideDoorToRightAnimation);
        closeAllOpenDrawers();
    } else {
        slideDoorToRightAnimation();
    }
}

function slideDoorToRightAnimation() {
    let closet_right = group.getObjectById(closet_faces_ids[3]);
    let distanceFromDoorToRightFace = Math.abs(slidingDoor.position.x - closet_right.position.x);
    let position = (Math.abs(closet_right.position.x + closet_right.geometry.parameters.width) / 2) - 2;
    if (position < distanceFromDoorToRightFace) {
        slidingDoor.translateX(1);
        requestAnimationFrame(slideDoorToRight);
        render();
        controls.update();
    }
}

var incrementHingedDoor = 100;

var openHingedDoor = function () {
    if (hingedDoor.rotation.y > (-Math.PI / 2)) {
        var rotationX = (hingedDoor.geometry.parameters.width / 2);
        hingedDoor.translateX(-rotationX);
        hingedDoor.rotation.y -= Math.PI / incrementHingedDoor;
        hingedDoor.translateX(rotationX);
        requestAnimationFrame(openHingedDoor);
        render();
        controls.update();
    }
}

var closeHingedDoor = function () {
    var hingedDoorSlot = getHingedDoorSlot(hingedDoor);
    if (doesSlotHaveOpenDrawers(hingedDoorSlot)) {
        waitingDoors.push(closeHingedDoorAnimation);
        closeSlotOpenDrawers(hingedDoorSlot);
    } else {
        closeHingedDoorAnimation();
    }
}

function closeHingedDoorAnimation() {
    if (hingedDoor.rotation.y < 0) {
        var rotationX = hingedDoor.geometry.parameters.width / 2;
        hingedDoor.translateX(-rotationX);
        hingedDoor.rotation.y += Math.PI / incrementHingedDoor;
        hingedDoor.translateX(rotationX);
        requestAnimationFrame(closeHingedDoor);
        render();
        controls.update();
    } else {
        isHingedDoorClosed = true;
    }
}

function getHingedDoorSlot(hingedDoorMesh) {
    for (let i = 0; i < closet.hingedDoors.length; i++) {
        if (hingedDoorMesh.id == closet.hingedDoors[i].meshId) {
            return closet.hingedDoors[i].slotId;
        }
    }
    return;
}

var incrementDrawer = 1;

var openDrawer = function (drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face) {
    if (drawer_front_face.position.z <= 130) {

        drawer_front_face.translateZ(incrementDrawer);
        drawer_back_face.translateZ(incrementDrawer);
        drawer_base_face.translateZ(incrementDrawer);
        drawer_left_face.translateZ(incrementDrawer);
        drawer_right_face.translateZ(incrementDrawer);

        requestAnimationFrame(function () {
            openDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
        });
        render();
        controls.update();
    } else {
        openDrawers.push(true);
    }
}

var closeDrawer = function (drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face) {
    var closet_front = Math.abs(group.getObjectById(closet_faces_ids[4]).position.z);
    if (drawer_front_face.position.z > closet_front) {
        drawer_front_face.translateZ(-incrementDrawer);
        drawer_back_face.translateZ(-incrementDrawer);
        drawer_base_face.translateZ(-incrementDrawer);
        drawer_left_face.translateZ(-incrementDrawer);
        drawer_right_face.translateZ(-incrementDrawer);
        requestAnimationFrame(function () {
            closeDrawer(drawer_front_face, drawer_back_face, drawer_base_face, drawer_left_face, drawer_right_face);
        });
        render();
        controls.update();
    } else {
        console.log(openDrawers);
        openDrawers.pop();
        if (openDrawers.length == 0) {
            while (waitingDoors.length != 0) {
                waitingDoors.pop()();
                //isDrawerClosed = false;
            }
        }
    }
}

/**
 * Represents the action that occurs when the mouse's left button is released, which is
 * setting the selected object as null, since it is no longer being picked, and enabling
 * the rotation control
 */
function onDocumentMouseUp(event) {
    //Sets the selected slot to null (the slot stops being selected)
    selected_slot = null;
    //Sets the selected face to null (the face stops being selected)
    selected_face = null;
    //Sets the selected pole to null (the pole stops being selected)
    selected_component = null;
    //Sets the selected door to null (the door stops being selected)
    selected_door = null;
    //Enables rotation again
    controls.enabled = true;
}

/**
 * Represents the action that occurs when the mouse is dragged (mouse move), which
 * is interacting with the previously picked object on mouse down (moving it accross
 * the x axis)
 */
function onDocumentMouseMove(event) {
    event.preventDefault();

    var rect = event.target.getBoundingClientRect();
    var x = event.clientX;
    var y = event.clientY;
    mouse.x = (x - rect.left) / (canvasWebGL.clientWidth / 2.0) - 1.0; //Get mouse x position
    mouse.y = -((y - rect.bottom) / (canvasWebGL.clientHeight / 2.0) + 1.0); //Get mouse y position
    raycaster.setFromCamera(mouse, camera); //Set raycast position

    //If the selected object is a slot
    if (selected_slot) {
        moveSlot();
        return;
    }

    //If the selected object is a closet face
    if (selected_face) {
        moveFace();
        return;
    }

    //If the selected object is a closet pole orshelf
    if (selected_component) {
        moveComponent();
        return;
    }

    if (selected_door) {
        moveDoor();
        return;
    }

    var intersects = raycaster.intersectObjects(scene.children[0].children);
    if (intersects.length > 0) {
        //Updates plane position to look at the camera
        var face = intersects[0].object;
        plane.setFromNormalAndCoplanarPoint(camera.position, face.position);

        if (hovered_object !== face) hovered_object = face;
    } else {
        if (hovered_object !== null) hovered_object = null;
    }
}

/**
 * Moves the slot across the defined plan that intersects the closet, without overlapping the closet's faces
 */
function moveSlot() {
    if (raycaster.ray.intersectPlane(plane, intersection) && document.getElementById("slotCheckbox").checked == true) {
        var newPosition = intersection.x - offset; //Subtracts the offset to the x coordinate of the intersection point
        var valueCloset = group.getObjectById(closet_faces_ids[2]).position.x;
        if (Math.abs(newPosition) < Math.abs(valueCloset)) { //Doesn't allow the slot to overlap the faces of the closet
            selected_slot.position.x = newPosition;
            var container = document.getElementById("slotDiv");

            for (let i = 0; i < closet_slots_faces_ids.length; i++) {
                if (group.getObjectById(closet_slots_faces_ids[i]) == selected_slot) {
                    var span = container.childNodes[i + 1];
                    var conversion = parseInt(((newPosition + group.getObjectById(closet_faces_ids[3]).position.x) * getCurrentClosetWidth() * 2) /
                        (Math.abs(group.getObjectById(closet_faces_ids[3]).position.x) + Math.abs(group.getObjectById(closet_faces_ids[2]).position.x)));
                    span.childNodes[3].value = conversion;
                    span.childNodes[1].textContent = conversion;
                }
            }
        }
    }
}

/**
 * Moves the door across the defined plan that intersects the closet, without overlapping the closet's faces
 */
function moveDoor() {
    if (raycaster.ray.intersectPlane(plane, intersection)) {
        var newPosition = intersection.x - offset; //Subtracts the offset to the x coordinate of the intersection point
        var leftFacePosition = group.getObjectById(closet_faces_ids[2]).position.x;
        if (Math.abs(newPosition) < Math.abs(leftFacePosition) - Math.abs(leftFacePosition) / 2) selected_door.position.x = newPosition;
    }

    var intersects = raycaster.intersectObjects(scene.children[0].children);
    if (intersects.length > 0) {
        //Updates plane position to look at the camera
        var object = intersects[0].object;
        plane.setFromNormalAndCoplanarPoint(camera.position, object.position);

        if (hovered_object !== object) hovered_object = object;
    } else if (hovered_object !== null) hovered_object = null;
}

/**
 * Moves a component across the y axis without overlapping the slots planes or the closets planes
 */
function moveComponent() {
    if (raycaster.ray.intersectPlane(plane, intersection)) {
        var newPosition = intersection.y - offset; //Subtracts the offset to the y coordinate of the intersection point
        var bottomFacePosition = group.getObjectById(closet_faces_ids[0]).position.y;
        var topFacePosition = group.getObjectById(closet_faces_ids[1]).position.y;

        if (Math.abs(newPosition) < Math.abs(topFacePosition) - thickness &&
            newPosition >= bottomFacePosition + thickness) {
            selected_component.position.y = newPosition;
        }
    }

    var intersects = raycaster.intersectObjects(scene.children[0].children);
    if (intersects.length > 0) {
        //Updates plane position to look at the camera
        var object = intersects[0].object;
        plane.setFromNormalAndCoplanarPoint(camera.position, object.position);

        if (hovered_object !== object) hovered_object = object;
    } else if (hovered_object !== null) hovered_object = null;
}


/**
 * Moves the face across the defined plan that intersects the closet, without overlapping the closet's slots
 */
function moveFace() {
    if (raycaster.ray.intersectPlane(plane, intersection)) {

        var rightFacePosition = intersection.x - offset + selected_face.position.x; //Position of the right closet face
        var leftFacePosition = -intersection.x - offset - selected_face.position.x; //Position of the left closet face

        if (closet_slots_faces_ids.length == 0) {

            var conversion = parseInt(((rightFacePosition + group.getObjectById(closet_faces_ids[3]).position.x) * getCurrentClosetWidth() * 2) /
                (Math.abs(group.getObjectById(closet_faces_ids[3]).position.x) + Math.abs(group.getObjectById(closet_faces_ids[2]).position.x)));

            //Checks if the selected face is the right face of the closet
            if (selected_face == group.getObjectById(closet_faces_ids[3])) {
                selected_face.position.x = rightFacePosition;

                document.getElementById("width").value = conversion;

                changeClosetDimensions(rightFacePosition, closet.getClosetHeight(), closet.getClosetDepth(), 3);
            }

            //Checks if the selected face is the left face of the closet
            else if (selected_face == group.getObjectById(closet_faces_ids[2])) {
                var conversion = parseInt(((leftFacePosition + group.getObjectById(closet_faces_ids[3]).position.x) * getCurrentClosetWidth() * 2) /
                    (Math.abs(group.getObjectById(closet_faces_ids[3]).position.x) + Math.abs(group.getObjectById(closet_faces_ids[2]).position.x)));

                selected_face.position.x = leftFacePosition;
                document.getElementById("width").value = conversion;

                changeClosetDimensions(leftFacePosition, closet.getClosetHeight(), closet.getClosetDepth(), 2);
            }

        } else {

            var rightSlotPosition = group.getObjectById(closet_slots_faces_ids[closet_slots_faces_ids.length - 1]).position.x; //Position of the last (more to the right) slot 
            var leftSlotPosition = -group.getObjectById(closet_slots_faces_ids[0]).position.x; //Position of the first (more to the left) slot

            /**
             * Checks if...
             * - ... the selected face is the right face of the closet
             * - ... the position of the face doesn't overlap the position of the last (more to the right) slot
             */
            if (selected_face == group.getObjectById(closet_faces_ids[3]) &&
                rightFacePosition - rightSlotPosition > rightSlotPosition + rightFacePosition / 2) {

                var conversion = parseInt(((rightFacePosition + group.getObjectById(closet_faces_ids[3]).position.x) * getCurrentClosetWidth() * 2) /
                    (Math.abs(group.getObjectById(closet_faces_ids[3]).position.x) + Math.abs(group.getObjectById(closet_faces_ids[2]).position.x)));

                selected_face.position.x = rightFacePosition;
                document.getElementById("width").value = conversion;

                changeClosetDimensions(rightFacePosition, closet.getClosetHeight(), closet.getClosetDepth(), 3);
            }
            /**
             * Checks if...
             * - ... the selected face is the left face of the closet
             * - ... the position of the face doesn't overlap the position of the first (more to the left) slot
             */
            else if (selected_face == group.getObjectById(closet_faces_ids[2]) &&
                leftFacePosition - leftSlotPosition > leftSlotPosition + leftFacePosition / 2) {
                var conversion = parseInt(((leftFacePosition + group.getObjectById(closet_faces_ids[3]).position.x) * getCurrentClosetWidth() * 2) /
                    (Math.abs(group.getObjectById(closet_faces_ids[3]).position.x) + Math.abs(group.getObjectById(closet_faces_ids[2]).position.x)));

                selected_face.position.x = leftFacePosition;
                document.getElementById("width").value = conversion;

                changeClosetDimensions(leftFacePosition, closet.getClosetHeight(), closet.getClosetDepth(), 2);
            }
        }
    }
}

/**
 * Returns the current closet width
 */
function getCurrentClosetWidth() {
    return closet.getClosetWidth();
}

/**
 * Returns the current closet height
 */
function getCurrentClosetHeight() {
    return closet.getClosetHeight();
}

/**
 * Returns the current closet depth
 */
function getCurrentClosetDepth() {
    return closet.getClosetDepth();
}