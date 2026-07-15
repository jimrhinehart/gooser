
await Canvas(480, 640);
displayMode('maxed');
await loadFont('assets/LT.ttf');

let bg = await loadImage('assets/background.png');
let poop = await loadImage('assets/poop.png');
const levels = await loadJSON('levels.json');

let gameState = initGame;
let cars = new Group();
let crocs = new Group();
let poops = new Group();
let goose;
let isSwimming;

function initGame() {

/*
        Car group - road things
*/

    cars.scale = 2;
    cars.physics = 'kinematic';

    levels.cars.forEach(addVehicles);

    function addVehicles(vehicle) {
        let temp = new cars.Sprite(vehicle.x, (vehicle.y * 32) - halfHeight, 32, 32);
        temp.img = vehicle.image;
        temp.setSpeedAndDirection(vehicle.speed, vehicle.direction);
        temp.w = 26;
        temp.h = 26;
        temp.visible = false;
    };

/*
        Critter group - water things
*/

    crocs.physics = 'kinematic';
    crocs.scale = 2;
    // crocs.debug = true;

    levels.crocs.forEach(addFloaty);

    function addFloaty(floaty) {
        let temp = new crocs.Sprite(floaty.x, (floaty.y * 32) - halfHeight, 98, 32);
        temp.addAni(floaty.image, 2);
        temp.setSpeedAndDirection(floaty.speed, floaty.direction);
        temp.ani.frameDelay = floaty.frameDelay;
        temp.w = 94;
        temp.h = 24;
        temp.visible = false;
    };

/*      
        Poop group :-)
*/
    poops.scale = 2;
    poops.physics = 'static';
 
/*
        Goose stuff!
*/

    goose = new Sprite(0, halfHeight - 30, 64, 64);
    goose.w = 20;
    goose.h = 28;
    goose.speed = 0;
    goose.scale = 2;
    goose.direction = ('right');
    goose.physics = 'kinematic';
    goose.visible = false;

    isSwimming = false;

    goose.addAnis('assets/gooses.png', '64x64', {
        walk_u: {row: 0, frames: 16},
        walk_d: {row: 1, frames: 16},
        walk_l: {row: 2, frames: 16},
        walk_r: {row: 3, frames: 16},
        swim_u: {row: 4, frames: 1},
        swim_d: {row: 5, frames: 1},
        swim_l: {row: 6, frames: 1},
        swim_r: {row: 7, frames: 1},
        death:  {row: 8, frames: 8} 
    });

    // goose.debug = true;

    goose.changeAni('walk_r');
    gameState = startScreen;
}

q5.draw = function () {
    gameState();
}

function runGame() {

    clear();
    background(bg);

    goose.speed = 0.75;
    goose.visible = true;

    if (kb.presses('up')) goose.direction = ('up');
    if (kb.presses('down')) goose.direction = ('down');
    if (kb.presses('left')) goose.direction = ('left');
    if (kb.presses('right')) goose.direction = ('right');

    if (kb.presses('escape')) gameState = endGame;

    if (kb.presses(' ')) {
        let temp = new poops.Sprite(goose.x, goose.y+20);
        temp.img = poop; 
    } 

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
        if (car.x > halfWidth + 32) car.x = halfWidth - 32;
    });

    crocs.forEach((croc) => {
        if (croc.x < -halfWidth - 48) croc.x = halfWidth + 48;
        if (croc.x > halfWidth + 48) croc.x = -halfWidth - 48;
    });

    if (goose.overlaps(cars)) gameState = splat;

    if (goose.overlaps(crocs)) gameState = splat;

}

function splat() {
    clear();
    background(bg);
    cars.deleteAll();
    crocs.deleteAll();
    poops.deleteAll();
    goose.speed = 0;
    goose.changeAni('death');
    goose.ani.noLoop();
    goose.ani.frameDelay = 15;
    if (kb.presses(' ')) {
        goose.delete();
        gameState = initGame;
    }
}



function startScreen() {
    clear();
    background(bg);
    fill('white');
    textSize(64);
    text('Gooser!', -98, 24);
    textSize(48);
    text('press space to begin', -210, 80);
    if (kb.presses(' ')) {
        goose.speed = 0.75;
        goose.visible = true;

        cars.forEach((car) => {
            car.visible = true;
        });

        crocs.forEach((croc) => {
            croc.visible = true;
        });

        gameState = runGame;
    }
}


