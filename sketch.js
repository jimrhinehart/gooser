//  Gooser!
//
//  Frogger . . . but with a goose. Because why not?
//
//  By Jim Rhinehart (jr88keys)
//  jimrhinehart [at] gmail <dot> com
//
//  Uses q5play for graphics
//  Uses SuperCollider for sounds



await Canvas(480, 640);
displayMode('maxed');
await loadFont('assets/LT.ttf');

const bg = await loadImage('assets/background.png');
const poop = await loadImage('assets/poop.png');
const levels = await loadJSON('levels.json');
const gooseSprites = await loadImage('assets/gooses.png');
const barrel = await loadImage('assets/barrels.png');

const totalLevels = levels.level.length;

const musicStartScreen = await loadAudio('assets/audio/gameStart.flac');
const musicLevelCleared = await loadAudio('assets/audio/levelComplete.flac');
const splatMusic = await loadAudio('assets/audio/splat.flac');
let levelMusic = [];

levelMusic[0] = await loadAudio('assets/audio/level1.flac');
levelMusic[1] = await loadAudio('assets/audio/level2.flac');
levelMusic[2] = await loadAudio('assets/audio/level3.flac');
levelMusic[3] = await loadAudio('assets/audio/level4.flac');
levelMusic[4] = await loadAudio('assets/audio/level5.flac');
levelMusic[5] = await loadAudio('assets/audio/level6.flac');
levelMusic[6] = await loadAudio('assets/audio/level7.flac');


const dieRoad = await loadSound('assets/audio/dieRoad.flac');
const dieWater = await loadSound('assets/audio/dieWater.flac');
const raceCar = await loadSound('assets/audio/raceCar.flac');
const topPoop = await loadSound('assets/audio/topPoop.flac');
const poopSound = await loadSound('assets/audio/poop.flac');
const splatSound = await loadSound('assets/audio/squish.flac');
const pacSound = await loadSound('assets/audio/pacSound.flac');

let gameState = preGame;

let currentLevel = -1;
let speedScale = 1;
// allSprites.debug = true;

let cars = new Group();
cars.scale = 2;
cars.physics = 'kinematic';

let critters = new Group();
critters.physics = 'kinematic';
critters.scale = 2;

let poops = new Group();
poops.scale = 2;
poops.physics = 'static';

let goose;


let gooseSplat;
gooseSplat = new Sprite();
gooseSplat.width = 32;
gooseSplat.height = 32;
gooseSplat.addAni('assets/splat2.png', 8);
gooseSplat.scale = 2;
gooseSplat.visible = false;
gooseSplat.physics = 'static';
gooseSplat.ani.noLoop();





//////////////////////  Flags

let isSwimming = false;
let isPlaying = false;
let poopPlayed = false;
let poopFlag = false;
let gooseSplatted = false;

q5.draw = function () {
    gameState();
}

function initGame() {

/*
        Car group - road things
*/

    levels.level[currentLevel].cars.forEach(addVehicles);

    function addVehicles(vehicle) {
        let temp = new cars.Sprite(vehicle.x, (vehicle.y * 32) - halfHeight, 32, 32);
        temp.img = vehicle.image;
        temp.setSpeedAndDirection(vehicle.speed * speedScale, vehicle.direction);
        temp.w = vehicle.w;
        temp.h = vehicle.h;
    };

/*
        Critter group - water things
*/

    levels.level[currentLevel].critters.forEach(addFloaty);

    function addFloaty(floaty) {
        let temp = new critters.Sprite(floaty.x, (floaty.y * 32) - halfHeight, 98, 32);
        if (floaty.image == "assets/barrels.png") {
            console.log("Barrel!");
            temp.addAni(barrel, 4);
        }
        else {
            temp.addAni(floaty.image, 2);
        }
        // temp.addAni(floaty.image, 2);
        temp.setSpeedAndDirection(floaty.speed * speedScale, floaty.direction);
        temp.ani.frameDelay = floaty.frameDelay;
        temp.w = floaty.w;
        temp.h = floaty.h;
    };

    gameState = runGame;
}

function runGame() {

    clear();
    background(bg);

    if (currentLevel == 0) {
        textSize(18);
        fill('white');
        text('Get to the top and poop!', -halfWidth + 100, halfHeight - 30);
    }; 

    levelMusic[currentLevel].play();

    goose.speed = 0.75;
    goose.visible = true;
    goose.changeAni('walk_r');

    if (kb.presses('up')) goose.direction = ('up');
    if (kb.presses('down')) goose.direction = ('down');
    if (kb.presses('left')) goose.direction = ('left');
    if (kb.presses('right')) goose.direction = ('right');

    if (kb.presses('escape')) gameState = endGame;

    if (kb.presses(' ')) {
        poopSound.play();
        let temp = new poops.Sprite(goose.x, goose.y+20);
        temp.img = poop;
        temp.w = 10;
        temp.h = 10;
        temp.layer = 1;
        if (goose.y+20 < -halfHeight + 64) {
            poopFlag = true;
            if (poopPlayed == false) {
                topPoop.play();
                poopPlayed = true;
            }
        }
    } 

    if (goose.y+20 < -halfHeight + 64 && currentLevel == 0) {
        textSize(18);
        fill('white');
        text('Good job - now poop!', -halfWidth + 130, -halfHeight + 30);
    }; 

    if (currentLevel == 0 && poopFlag == true) {
        textSize(18);
        fill('white');
        text('Now get back to the bottom!', -halfWidth + 130, -halfHeight + 60);
    }; 

    if (goose.y < -45 && goose.y > -275) isSwimming = true;
    else isSwimming = false;

    if (goose.direction == ('-90')) {
        if (isSwimming) goose.changeAni('swim_u');
        else goose.changeAni('walk_u');
    }
    if (goose.direction == ('90')) {
        if (isSwimming) goose.changeAni('swim_d');
        else goose.changeAni('walk_d');
    }
    if (goose.direction == ('180')) {
        if (isSwimming) goose.changeAni('swim_l');
        else goose.changeAni('walk_l');
    }

    if (goose.direction == ('0')) {
        if (isSwimming) goose.changeAni('swim_r');
        else goose.changeAni('walk_r');
    }

    if (goose.y < -halfHeight + 30) goose.y = -halfHeight + 30;
    if (goose.y > halfHeight - 30) goose.y = halfHeight - 30;
    if (goose.x < -halfWidth + 30) goose.x = -halfWidth + 30;
    if (goose.x > halfWidth - 30) goose.x = halfWidth - 30;

    cars.forEach((car) => {
        if (car.x < -halfWidth - 32) car.x = halfWidth + 32;
        if (car.x > halfWidth + 32) car.x = -halfWidth - 32;
    });

    critters.forEach((critter) => {
        if (critter.x < -halfWidth - 48) critter.x = halfWidth + 48;
        if (critter.x > halfWidth + 48) critter.x = -halfWidth - 48;
    });

    if (goose.overlaps(cars)) {
        levelMusic[currentLevel].pause();
        splatMusic.play();
        splatSound.play();
        gooseSplatted = true;
        gameState = splat;
    }

    if (goose.overlaps(critters)) {
        levelMusic[currentLevel].pause();
        splatMusic.play();
        splatSound.play();
        gooseSplatted = true;
        gameState = splat;
    }

    if (goose.y > halfHeight - 32 && poopFlag == true) {
        levelMusic[currentLevel].pause();
        gameState = levelCleared;
    }
}

function splat() {
    clear();
    background(bg);
    cars.deleteAll();
    critters.deleteAll();
    poops.deleteAll();
    goose.speed = 0;
    goose.visible = false;
    gooseSplat.x = goose.x;
    gooseSplat.y = goose.y;
    goose.ani.frameDelay = 15;
    gooseSplat.visible = true;
    if (gooseSplatted == true) {
        gooseSplat.ani.play();
        gooseSplatted = false;
    }
    currentLevel = -1;

    if (kb.presses(' ')) {
        gooseSplat.visible = false;
        gooseSplat.ani.pause();
        gooseSplat.ani.frame = 0;
        gameState = initGoose;
    }
}

function startScreen() {
    clear();
    background(bg);
    fill('white');
    textAlign(CENTER);
    textSize(64);
    text('Gooser!', 0, -140);
    textSize(48);
    text('Arrow keys to move', 0, -50);
    text('Space bar to poop', 0, 0);
    textSize(24);
    text('Get to the top, poop, and get back!', 0, 100);
    text('press space to begin', 0, 150);
    musicStartScreen.play();

    if (kb.presses(' ')) {
        musicStartScreen.pause();
        gameState = initGoose;
    }
}

function levelCleared() {
    clear();
    background(bg);
    fill('white');
    textAlign(CENTER);
    textSize(64);
    text('Level', 0, -100);
    text(currentLevel+1, 0, -40);
    text('Cleared!', 0, 20);
    cars.deleteAll();
    critters.deleteAll();
    poops.deleteAll();
    poopPlayed = false;
    if (isPlaying == false) {
        musicLevelCleared.play();
        isPlaying = true;
    }
    if (musicLevelCleared.ended) gameState = initGoose;
}    

function initGoose() {

    let startX = 0;
    let startY = halfHeight - 30;
    goose = new Sprite(startX, startY, 40, 40);
    // goose.visible = false;

    goose.addAnis(gooseSprites, '64x64', {
        walk_u: {row: 0, frames: 16},
        walk_d: {row: 1, frames: 16},
        walk_l: {row: 2, frames: 16},
        walk_r: {row: 3, frames: 16},
        swim_u: {row: 4, frames: 1},
        swim_d: {row: 5, frames: 1},
        swim_l: {row: 6, frames: 1},
        swim_r: {row: 7, frames: 1},
    });

    goose.w = 15;
    goose.h = 28;
    goose.x = startX;
    goose.y = startY;
    goose.speed = 0;
    goose.scale = 2;
    goose.direction = ('right');
    goose.physics = 'kinematic';
    goose.layer = 999;
    goose.visible = true;
    isSwimming = false;
    isPlaying = false;
    poopFlag = false;
    currentLevel++;
    if (currentLevel == totalLevels) {
        currentLevel = 0;
        speedScale += 0.25;
    }
    gameState = initGame;
}

function endGame() {
    clear();
    background(bg);
    fill('white');
    textAlign(CENTER);
    textSize(64);
    text('Bye!', 0, -100);
    cars.deleteAll();
    critters.deleteAll();
    poops.deleteAll();
    // goose.remove;
}

function preGame() {
    clear();
    background(bg);
    fill('white');
    textAlign(CENTER);
    textSize(30);
    text('(click the screen to begin)', 0, 10);
    if (mouseIsPressed) gameState = startScreen;
}
