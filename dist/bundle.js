/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ClassProto {
    declareDefaults() {
        this.defaults = {};
    }
    extendDefaults(o = {}) {
        this.props = Object.assign({}, this.defaults, o);
    }
    init() {
    }
    constructor(o = {}) {
        this.declareDefaults();
        this.extendDefaults(o);
        this.init();
    }
    set(o = {}) {
        this.props = Object.assign({}, this.props, o);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClassProto;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SideType; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__class_proto__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nn__ = __webpack_require__(2);


var SideType;
(function (SideType) {
    SideType[SideType["Left"] = 0] = "Left";
    SideType[SideType["Right"] = 1] = "Right";
})(SideType || (SideType = {}));
const BAT_WIDTH = 5;
const BAT_COLOR = '#333';
class Bat extends __WEBPACK_IMPORTED_MODULE_0__class_proto__["a" /* ClassProto */] {
    constructor(o = {}) {
        super(o);
        this.getFeatures = (ball) => {
            let feature1 = ball.props.angle / 180;
            // invert angle by x value for right bat to keep angle the same for both sides
            if (this.props.side === SideType.Right) {
                feature1 = -feature1;
            }
            const feature2 = this.props.top / this.props.canvas.height;
            const dX = this.props.front - ball.props.x;
            const dY = (this.props.top + (this.props.height / 2)) - ball.props.y;
            const maxNorm = Math.sqrt((Math.pow(this.props.canvas.height, 2)) + (Math.pow(this.props.canvas.width, 2)));
            const feature3 = Math.sqrt((Math.pow(dX, 2)) + (Math.pow(dY, 2))) / maxNorm;
            const feature4 = ((this.props.canvas.height / 2) - this.props.ball.props.y) / (this.props.canvas.height / 2);
            const feature5 = this.props.canvas.height / (this.props.ball.props.y - (this.props.top + (this.props.height / 2)));
            return [[1, feature1, feature2, feature3, feature4]];
        };
    }
    declareDefaults() {
        const defaults = {
            side: SideType.Left,
            top: 105,
            height: 100,
            speed: 5,
            canvas: null,
            ball: null,
            parameters: [],
            front: BAT_WIDTH,
            fitness: 0,
            distance: 0,
            hits: 0
        };
        this.defaults = defaults;
    }
    init() {
        const { parameters, side, canvas } = this.props;
        this.nn = new __WEBPACK_IMPORTED_MODULE_1__nn__["a" /* NeuralNetwork */]({ parameters });
        this.props.front = (side === SideType.Left) ? BAT_WIDTH : canvas.width - BAT_WIDTH;
    }
    blame() {
        this.props.hits / 1.25;
    }
    set(o) {
        super.set(o);
        const { side, canvas } = this.props;
        this.props.front = (side === SideType.Left) ? BAT_WIDTH : canvas.width - BAT_WIDTH;
    }
    tick() {
        const { top, canvas, height, speed } = this.props;
        const features = this.getFeatures(this.props.ball);
        const activation = this.nn.getActivations(features);
        const currentTop = top;
        const newTop = (activation === __WEBPACK_IMPORTED_MODULE_1__nn__["b" /* NeuralNetworkActivationType */].Top)
            ? Math.max(0, top - speed)
            : Math.min(canvas.height, top + height + speed) - height;
        this.props.top = newTop;
        this.props.distance += Math.abs(currentTop - newTop);
        this.render();
    }
    hit() {
        this.props.hits++;
    }
    render() {
        const { side, canvas, top, height } = this.props;
        canvas.ctx.fillStyle = BAT_COLOR;
        if (side === SideType.Left) {
            canvas.ctx.fillRect(0, top, BAT_WIDTH, height);
        }
        else {
            canvas.ctx.fillRect(canvas.width - BAT_WIDTH, top, canvas.width, height);
        }
    }
    getFitness() { return (this.props.distance / (this.props.canvas.height / 2)) + (this.props.hits); }
    getParameters() { return this.nn.getParameters(); }
    mate(bat, mutationRate) {
        const newParameters = this.nn.mate(bat.nn, mutationRate, this.getFitness(), bat.getFitness());
        return new Bat({
            canvas: this.props.canvas,
            parameters: newParameters
        });
    }
    createAccessor(mutationRate) {
        return new Bat({
            canvas: this.props.canvas,
            parameters: this.nn.createSuccessor(mutationRate)
        });
    }
    clone() {
        return new Bat({
            canvas: this.props.canvas,
            parameters: this.props.parameters
        });
    }
    cteateChildParameters(params) {
        // code to mutate params
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bat;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NeuralNetworkActivationType; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__class_proto__ = __webpack_require__(0);

var NeuralNetworkActivationType;
(function (NeuralNetworkActivationType) {
    NeuralNetworkActivationType[NeuralNetworkActivationType["Top"] = 0] = "Top";
    NeuralNetworkActivationType[NeuralNetworkActivationType["Bottom"] = 1] = "Bottom";
})(NeuralNetworkActivationType || (NeuralNetworkActivationType = {}));
;
const arrayCopy = (array = []) => {
    if (!(array instanceof Array)) {
        return array;
    }
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result[i] = arrayCopy(array[i]);
    }
    return result;
};
class NeuralNetwork extends __WEBPACK_IMPORTED_MODULE_0__class_proto__["a" /* ClassProto */] {
    declareDefaults() {
        const defaults = {
            parameters: []
        };
        this.defaults = defaults;
    }
    getActivations(features) {
        const { parameters } = this.props;
        const params1 = parameters[0];
        const biasParams1 = new Array(params1[0].length).fill(1);
        let a1 = sigmoidAll(multiply(features, [biasParams1, ...params1]));
        const params2 = parameters[1];
        const biasParams2 = new Array(params2[0].length).fill(1);
        const biasA1 = [[1, ...a1[0]]];
        const a2 = multiply(biasA1, [biasParams2, ...params2]);
        const result = a2[0];
        // calculate activation units and return the max value
        return result[0] > result[1] ? NeuralNetworkActivationType.Top : NeuralNetworkActivationType.Bottom;
    }
    createSuccessor(mutationRate) { }
    getParameters() {
        return this.props.parameters;
    }
    mate(nn, mutationRate, fitness1, fitness2) {
        const params1 = this.props.parameters;
        const params2 = nn.getParameters();
        const resultParams = arrayCopy(params1);
        const rate = fitness1 / (fitness1 + fitness2);
        // console.log(`fitness1: ${fitness1}, fitness2: ${fitness2}, probability of 2: ${1 - rate}`);
        for (let k = 0; k < params2.length; k++) {
            const layer = params2[k];
            for (let i = 0; i < layer.length; i++) {
                const row = layer[i];
                for (let j = 0; j < row.length; j++) {
                    if (Math.random() > rate) {
                        resultParams[k][i][j] = row[j];
                    }
                    if (Math.random() <= mutationRate) {
                        // console.log(`> mutation occurred`);
                        resultParams[k][i][j] = (6 * Math.random()) - 3;
                    }
                }
            }
        }
        return resultParams;
    }
    constructor(o = {}) { super(o); }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NeuralNetwork;

const sigmoidSingle = (z) => {
    return 1 / (1 + Math.exp(-z));
};
const sigmoidAll = (m) => {
    for (let i = 0; i < m.length; i++) {
        const item = m[i];
        if (item instanceof Array) {
            m[i] = sigmoidAll(item);
        }
        else {
            m[i] = sigmoidSingle(item);
        }
    }
    return m;
};
const multiply = (m1, m2) => {
    const m1_size1 = m1.length;
    const m1_size2 = m1[0].length;
    const m2_size1 = m2.length;
    const m2_size2 = m2[0].length;
    const resultRow = new Array(m2_size2).fill(0);
    const result = new Array(m1_size1).fill(resultRow);
    for (let i = 0; i < result[0].length; i++) {
        result[0][i] = vecMatrixMul(m1[0], m2, i);
    }
    return result;
};
const vecMatrixMul = (vec, matrix, index) => {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * matrix[i][index];
    }
    return sum;
};
const randomMatrix = (m, n) => {
    const matrix = [];
    for (let i = 0; i < m; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
            matrix[i][j] = (6 * Math.random()) - 3;
        }
    }
    return matrix;
};
const randomParameters = (layers) => {
    const parameters = [];
    for (let i = 1; i < layers.length; i++) {
        const layer = layers[i];
        const prevLayer = layers[i - 1];
        parameters.push(randomMatrix(prevLayer, layer));
    }
    return parameters;
};
/* harmony export (immutable) */ __webpack_exports__["c"] = randomParameters;



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__canvas__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ball__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bat__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nn__ = __webpack_require__(2);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




const settings = {
    speed: 1,
    mutationRate: 0,
    generation: 0,
    fitness: .5,
    maxFitness: 0
};
const gui = new dat.GUI();
gui.add(settings, 'speed', 0, 16);
gui.add(settings, 'generation').listen();
gui.add(settings, 'fitness').listen();
gui.add(settings, 'maxFitness').listen();
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
const SEPARATOR = '-=-=-=-=-=-=-=-=-=-=-';
const SMALL_SEPARATOR = '---------------------';
const NN_LAYERS = [4, 15, 2];
;
const rand = (min, max) => {
    return Math.round(min + (Math.random() * (max - min)));
};
class Evolution {
    constructor() {
        this.isPlaying = false;
        this.play = (ball, leftBat, rightBat) => {
            if (this.isPlaying === false) {
                this.isPlaying = true;
                if (ball) {
                    this.roundActive = [leftBat, rightBat, ball];
                }
                this.loop();
            }
        };
        this.loop = () => {
            if (this.isPlaying === false) {
                return;
            }
            this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.roundActive.length; i++) {
                this.roundActive[i].tick(performance.now());
            }
            this.animationFrame = setTimeout(this.loop, 1000 / (60 * settings.speed));
        };
        this.canvas = new __WEBPACK_IMPORTED_MODULE_0__canvas__["a" /* Canvas */]();
        this.createInitialRound();
    }
    createInitialRound() {
        const batOptions = { canvas: this.canvas };
        this.batsPool = [];
        for (let i = 0; i < 50; i++) {
            const leftBat = new __WEBPACK_IMPORTED_MODULE_2__bat__["a" /* Bat */](Object.assign({}, batOptions, { side: __WEBPACK_IMPORTED_MODULE_2__bat__["b" /* SideType */].Left, parameters: Object(__WEBPACK_IMPORTED_MODULE_3__nn__["c" /* randomParameters */])(NN_LAYERS) }));
            const rightBat = new __WEBPACK_IMPORTED_MODULE_2__bat__["a" /* Bat */](Object.assign({}, batOptions, { side: __WEBPACK_IMPORTED_MODULE_2__bat__["b" /* SideType */].Right, parameters: Object(__WEBPACK_IMPORTED_MODULE_3__nn__["c" /* randomParameters */])(NN_LAYERS) }));
            this.batsPool.push(leftBat, rightBat);
        }
        this.runBatsQueue();
    }
    runBatsQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(SEPARATOR);
            console.log('');
            console.log(`> Starting selection pool # ${++settings.generation}`);
            this.roundNumber = 0;
            const processed = [];
            let maxFitness = 0;
            const len = this.batsPool.length;
            while (this.batsPool.length > 1) {
                yield this.evaluateRound(this.batsPool[0], this.batsPool[1], performance.now());
                // remove the bats that were playing in bat
                const bat1 = this.batsPool.shift();
                const bat2 = this.batsPool.shift();
                processed.push(bat1);
                processed.push(bat2);
                if (maxFitness < bat1.getFitness()) {
                    maxFitness = bat1.getFitness();
                }
                if (maxFitness < bat2.getFitness()) {
                    maxFitness = bat2.getFitness();
                }
                settings.maxFitness = maxFitness;
                // add the winner bat at the end
                // console.log(`> (${settings.generation}) max fitness so far: ${maxFitness} / ${settings.fitness}`);
            }
            console.log(SMALL_SEPARATOR);
            console.log('');
            let selected = this.select(processed);
            settings.mutationRate = 0.005 * ((100 - selected.length) / (len));
            console.log(`> selected: ${selected.length}, mutationRate: ${settings.mutationRate}`);
            if (selected.length < 5) {
                settings.mutationRate *= (1 + (5 - selected.length));
                console.log(`> few made it, new mutation rate is: ${settings.mutationRate}`);
            }
            if (selected.length < 2) {
                selected = [...this.prevSelected, ...(selected || [])];
                console.log('!no improvement!');
            }
            const mated = this.mateSpecies(selected);
            console.log('');
            console.log(SMALL_SEPARATOR);
            this.batsPool = mated;
            this.prevSelected = selected;
            this.runBatsQueue();
            console.log(SEPARATOR);
        });
    }
    select(processed) {
        let filtered = [];
        let fitnessSum = 0;
        let fitnessMin = settings.fitness;
        let fitnessMax = 0;
        for (let i = 0; i < processed.length; i++) {
            const item = processed[i];
            const itemFitness = item.getFitness();
            if (itemFitness >= settings.fitness) {
                filtered.push(item);
                fitnessSum += itemFitness;
                if (fitnessMin >= itemFitness || (fitnessMin === settings.fitness)) {
                    fitnessMin = itemFitness;
                }
                if (itemFitness > fitnessMax) {
                    fitnessMax = itemFitness;
                }
                // console.log(`> specie passed selection: ${itemFitness},  `, item.getParameters())
            }
        }
        const SLICE_RATE = 100;
        if (filtered.length > SLICE_RATE) {
            filtered.sort((a, b) => {
                return b.getFitness() - a.getFitness();
            });
            filtered = filtered.slice(0, SLICE_RATE);
            const prevFitnessMin = fitnessMin;
            fitnessMin = filtered[filtered.length - 1].getFitness();
            console.log(`< Slice, new fitnessMin: ${fitnessMin}, previous fitnessMin: ${prevFitnessMin}`);
        }
        const fitnessMean = fitnessSum / filtered.length;
        console.log(`> ${filtered.length}/${processed.length} species passed selection with fitness of ${settings.fitness}, fitness mean is - ${fitnessMean}, fitness min is ${fitnessMin}`);
        if (filtered.length > 1) {
            // settings.fitness = (settings.fitness + (((fitnessMean - settings.fitness) / 2)) / 2) || fitnessMin;
            settings.fitness = fitnessMin;
        }
        return filtered;
    }
    mateSpecies(items) {
        const mated = [];
        const itemsCount = Math.max(4 * items.length, 125);
        console.log(`> mating with ${settings.mutationRate} mutation rate`);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            while (mated.length < itemsCount) {
                const j = rand(0, items.length - 1);
                if (i === j) {
                    continue;
                }
                const item1 = item;
                const item2 = items[j];
                mated.push(item1.mate(item2, settings.mutationRate));
            }
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            mated.push(item.clone());
        }
        mated.sort((a, b) => {
            return b.getFitness() - a.getFitness();
        });
        // shuffle(mated);
        console.log(`> ${items.length} species mated, new generation is ${mated.length} species`);
        return mated;
    }
    evaluateRound(leftBat, rightBat, startTime) {
        return new Promise((resolve) => {
            const ball = new __WEBPACK_IMPORTED_MODULE_1__ball__["a" /* Ball */]({
                canvas: this.canvas,
                leftBat,
                rightBat,
                startTime,
                onFail: (side) => {
                    this.stop();
                    resolve();
                }
            });
            leftBat.set({
                ball,
                startTime,
                side: __WEBPACK_IMPORTED_MODULE_2__bat__["b" /* SideType */].Left
            });
            rightBat.set({
                ball,
                startTime,
                side: __WEBPACK_IMPORTED_MODULE_2__bat__["b" /* SideType */].Right
            });
            this.stop();
            this.play(ball, leftBat, rightBat);
        });
    }
    stop() {
        this.isPlaying = false;
        clearTimeout(this.animationFrame);
    }
}
new Evolution();


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__class_proto__ = __webpack_require__(0);

;
class Canvas extends __WEBPACK_IMPORTED_MODULE_0__class_proto__["a" /* ClassProto */] {
    declareDefaults() {
        this.defaults = {
            width: 1000,
            height: 500,
            parent: document.body
        };
    }
    init() {
        const { width, height, parent } = this.props;
        this.width = width;
        this.height = height;
        const canvas = document.createElement('canvas');
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.border = `2px solid #aaa`;
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        parent.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Canvas;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__class_proto__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_get_radial_point__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bat__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_get_lines_intersection__ = __webpack_require__(8);




;
;
class Ball extends __WEBPACK_IMPORTED_MODULE_0__class_proto__["a" /* ClassProto */] {
    declareDefaults() {
        this.defaults = {
            angle: 0,
            speed: 6,
            radius: 4,
            x: 0,
            y: 0,
            canvas: null,
            onFail() { },
            leftBat: null,
            rightBat: null
        };
    }
    init() {
        const { canvas } = this.props;
        this.props.x = canvas.width / 2;
        this.props.y = canvas.height / 2;
        const coef = Math.random() <= .5 ? 1 : -1;
        this.props.angle = coef * parseInt(`${(90 * Math.random()) + 45}`, 10);
    }
    tick() {
        const { x, y, speed, angle, radius } = this.props;
        const newPoint = Object(__WEBPACK_IMPORTED_MODULE_1__helpers_get_radial_point__["a" /* getRadialPoint */])(x, y, speed, angle);
        let isVerticalBound = false;
        let isBat = false;
        const topBoundIntersection = this.checkVerticalBound(newPoint, 'top');
        if (topBoundIntersection != void 0) {
            this.props.x = topBoundIntersection.x;
            this.props.y = topBoundIntersection.y;
            this.props.angle = topBoundIntersection.angle || 1;
            newPoint.x = this.props.x;
            newPoint.y = this.props.y;
            isVerticalBound = true;
        }
        const bottomBoundIntersection = this.checkVerticalBound(newPoint, 'bottom');
        if (bottomBoundIntersection != void 0 && !isVerticalBound) {
            this.props.x = bottomBoundIntersection.x;
            this.props.y = bottomBoundIntersection.y;
            this.props.angle = bottomBoundIntersection.angle || 1;
            newPoint.x = this.props.x;
            newPoint.y = this.props.y;
            isVerticalBound = true;
        }
        const leftBatIntersection = this.checkBat(newPoint, 'left');
        if (leftBatIntersection != void 0) {
            this.props.x = leftBatIntersection.x;
            this.props.y = leftBatIntersection.y;
            this.props.angle = leftBatIntersection.angle + (10 * Math.random() - 5);
            this.props.leftBat.hit();
            isBat = true;
        }
        const rightBatIntersection = this.checkBat(newPoint, 'right');
        if (rightBatIntersection != void 0 && !isBat) {
            this.props.x = rightBatIntersection.x;
            this.props.y = rightBatIntersection.y;
            this.props.angle = rightBatIntersection.angle + (10 * Math.random() - 5);
            this.props.rightBat.hit();
            isBat = true;
        }
        if (!isVerticalBound && !isBat) {
            const isLeftBound = this.checkLeftBound(newPoint);
            const isRightBound = this.checkRightBound(newPoint);
            if (!isLeftBound && !isRightBound) {
                this.props.x = newPoint.x;
                this.props.y = newPoint.y;
            }
        }
        this.render();
    }
    checkVerticalBound(newPoint, side) {
        const { canvas, radius, angle, x, y, speed } = this.props;
        const isIntersects = (side === 'top')
            ? newPoint.y <= 0
            : newPoint.y >= canvas.height;
        const boundLine = (side === 'top')
            ? [0, 0, canvas.width, 0]
            : [0, canvas.height, canvas.width, canvas.height];
        if (isIntersects) {
            const result = Object(__WEBPACK_IMPORTED_MODULE_3__helpers_get_lines_intersection__["a" /* getIntersection */])(boundLine[0], boundLine[1], boundLine[2], boundLine[3], x, y, newPoint.x, newPoint.y);
            if (result) {
                const newRadius = Math.sqrt(Math.pow(x - result.x, 2) + Math.pow(y - result.y, 2));
                const newPoint = Object(__WEBPACK_IMPORTED_MODULE_1__helpers_get_radial_point__["a" /* getRadialPoint */])(x, y, newRadius, angle);
                const newAngle = (angle > 0) ? 180 - angle : -180 - angle;
                return Object.assign({}, Object(__WEBPACK_IMPORTED_MODULE_1__helpers_get_radial_point__["a" /* getRadialPoint */])(newPoint.x, newPoint.y, Math.min(Math.abs(speed - newRadius), radius), newAngle), { angle: newAngle });
            }
        }
    }
    checkBat(point, side) {
        const { leftBat, rightBat, radius, angle, x, y, speed } = this.props;
        const bat = (side === 'left') ? leftBat : rightBat;
        const isIntersects = (side === 'left') ? point.x <= bat.props.front : point.x >= bat.props.front;
        const isBatTop = (point.y - radius) >= bat.props.top;
        const isBatBottom = (point.y + radius) <= bat.props.top + bat.props.height;
        if (isBatTop && isBatBottom) {
            if (isIntersects) {
                const result = Object(__WEBPACK_IMPORTED_MODULE_3__helpers_get_lines_intersection__["a" /* getIntersection */])(x, y, point.x, point.y, bat.props.front, bat.props.top, bat.props.front, bat.props.top + bat.props.height);
                if (result !== false) {
                    const newRadius = Math.sqrt(Math.pow(x - result.x, 2) + Math.pow(y - result.y, 2));
                    const newPoint = Object(__WEBPACK_IMPORTED_MODULE_1__helpers_get_radial_point__["a" /* getRadialPoint */])(x, y, newRadius, angle);
                    const newAngle = -angle;
                    return Object.assign({}, Object(__WEBPACK_IMPORTED_MODULE_1__helpers_get_radial_point__["a" /* getRadialPoint */])(newPoint.x, newPoint.y, Math.min(Math.abs(speed - newRadius), radius), newAngle), { angle: newAngle });
                }
            }
        }
    }
    checkLeftBound(newPoint) {
        const { radius, leftBat } = this.props;
        if (newPoint.x <= 0) {
            leftBat.blame();
            this.props.onFail(__WEBPACK_IMPORTED_MODULE_2__bat__["b" /* SideType */].Left);
            return true;
        }
    }
    checkRightBound(newPoint) {
        const { canvas, rightBat } = this.props;
        if (newPoint.x >= canvas.width) {
            rightBat.blame();
            this.props.onFail(__WEBPACK_IMPORTED_MODULE_2__bat__["b" /* SideType */].Right);
            return true;
        }
    }
    render() {
        const { canvas, x, y, radius, angle } = this.props;
        // console.log(angle, -angle);
        canvas.ctx.beginPath();
        canvas.ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        canvas.ctx.closePath();
        canvas.ctx.fillStyle = 'purple';
        canvas.ctx.fill();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Ball;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * `getRadialPoint` - function to get a point on imaginary circle
 *                    with provided parameters.
 *
 * `Note:` This function is explicetely recieves a target object to set
 *         the result on, this was made because producing a lot of
 *          new return objects on every animation frame will cause GC issues.
 *
 * @param {Number} centerX Circle's center `x` coordinate.
 * @param {Number} centerY Circle's center `y` coordinate.
 * @param {Number} radius Circle's radius.
 * @param {Number} angle Angle of a line from center to a point.
 * @return {Object} New point coordinates
 */
const getRadialPoint = (centerX, centerY, radius, angle) => {
    const radAngle = (angle - 90) * 0.017453292519943295; // Math.PI / 180
    return {
        x: centerX + (Math.cos(radAngle) * radius),
        y: centerY + (Math.sin(radAngle) * radius)
    };
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getRadialPoint;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// const slope = (x1, y1, x2, y2) => {
//   if (x1 == x2) return false;
//   return (y1 - y2) / (x1 - x2);
// };
// const yInt = (x1, y1, x2, y2) => {
//   if (x1 === x2) return y1 === 0 ? 0 : false;
//   if (y1 === y2) return y1;
//   const sl = slope(x1, y1, x2, y2);
//   return (sl === false) ? sl : y1 - (sl * x1);
// };
// const getXInt = (x1, y1, x2, y2) => {
//   var slope;
//   if (y1 === y2) return x1 == 0 ? 0 : false;
//   if (x1 === x2) return x1;
//   return (-1 * ((slope = slope(x1, y1, x2, y2)) * x1 - y1)) / slope;
// };
// export const getIntersection = (x11, y11, x12, y12, x21, y21, x22, y22) => {
//   var slope1, slope2, yint1, yint2, intx, inty;
//   if (x11 == x21 && y11 == y21) return { x: x11, y: y11};
//   if (x12 == x22 && y12 == y22) return { x: x12, y: y22};
//   slope1 = slope(x11, y11, x12, y12);
//   slope2 = slope(x21, y21, x22, y22);
//   if (slope1 === slope2) return false;
//   yint1 = yInt(x11, y11, x12, y12);
//   yint2 = yInt(x21, y21, x22, y22);
//   if (yint1 === yint2) return yint1 === false ? false : { x: 0, y: yint1};
//   if (slope1 === false) return { x: y21, y: slope2 * y21 + yint2};
//   if (slope2 === false) return { x: y11, y: slope1 * y11 + yint1};
//   intx = (slope1 * x11 + yint1 - yint2) / slope2;
//   return {
//     x: intx,
//     y: slope1 * intx + yint1
//   };
// }
const getIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom == 0) {
        return false;
    }
    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getIntersection;



/***/ })
/******/ ]);