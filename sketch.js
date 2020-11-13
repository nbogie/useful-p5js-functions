/*jslint browser: true */
/* global background, BLEND, blendMode, CENTER, circle, color, constrain, createCanvas, createVector, ellipse, fill, fract, lerpColor, height, map, mouseX, mouseY, noLoop, norm, noStroke, pop, push, random, rect, rectMode, rotate, SCREEN, square, translate, width, windowHeight, windowWidth */
// palettes: https://nice-colours-quicker.netlify.app/
//           https://chromotome-quicker.netlify.app/
// starting functions at https://github.com/nbogie/useful-p5js-functions
"use strict";


const palette = {
  "name": "roygbiv-toned",
  "colors": [
    "#817c77",
    "#396c68",
    "#89e3b7",
    "#f59647",
    "#d63644",
    "#893f49",
    "#4d3240"
  ],
	"background": "#f2f2f2",
  "size": 7
}

function setup() {
	createCanvas(windowWidth*0.8, windowHeight);
	background(palette.background);
	rectMode(CENTER);
	noStroke();
}

function draw() {
	blendMode(SCREEN)
	const bgColor = color(palette.background);
	bgColor.setAlpha(10)
	background(bgColor)
	blendMode(BLEND)
	circle(mouseX, mouseY, 20);
	fill(random(palette.colors));
	withProbability(0.015, () => rect(mouseX, mouseY, 100, 100, 5));	
	const sz = mapConstrained(mouseX, 0, width, 10, 100);
	circle(random(width), 300, sz);
}

function mapConstrained(v, inLow, inHigh, outLow, outHigh){
	return constrain(map(v, inLow, inHigh, outLow, outHigh), outLow, outHigh);
}

function normConstrained(v, inLow, inHigh){
	return constrain(norm(v, inLow, inHigh), 0, 1);
}

function withProbability(p, fn) {
	if (random() < p) {
		fn();
	}
}

function repeat(n, fn) {
	for (let i = 0; i < n; i++) {
		fn();
	}
}

function repeatRandomChoice(n, fns) {
	if (fns.length > 0) {
		for (let i = 0; i < n; i++) {
			let chosenFn = random(fns);
			chosenFn();
		}
	}
}



//call fn n times, passing a fraction from 0 to 1
function repeat0To1(n, fn) {
	for (let i = 0; i < n; i++) {
		fn(i / (n - 1));
	}
}


//Make an array by calling the given `makeOneFn` function `num` times.
function makeArray(num, makeOneFn) {
	let result = [];
	for (let i = 0; i < num; i++) {
		result.push(makeOneFn());
	}
	return result;
}



function distributeUpTo(total, max, fn) {
	repeat(total, function(ix) {
		var val = (ix * max) / total;
		return fn(val);
	});
}

function collectDistributedBetween(numSamples, min, max, fn) {
	var result = [];
	distributeBetween(numSamples, min, max, function(v, ix) {
		return result.push(fn(v, ix));
	});
	return result;
}

function distributeBetween(numSamples, min, max, fn) {
	repeat(numSamples, function(ix) {
		var range = max - min;
		var val = min + (ix * range) / numSamples;
		return fn(val, ix);
	});
}


//From jeremy douglass: 
//https://discourse.processing.org/t/how-do-i-cycle-lerp-between-multiple-colors/13441/5
function lerpColors(amt, colors, colorModeForInterpolation = RGB) {
	if (colors.length === 1) {
		return colors[0];
	}
	let cunit = 1 / (colors.length - 1);
	colorMode(colorModeForInterpolation);
	return lerpColor(colors[floor(amt / cunit)], colors[ceil(amt / cunit)], amt % cunit / cunit);
}

function snap(v, gridSize = 50) {
	return round(v / gridSize) * gridSize
}


// Positions
function randomScreenPos() {
	return createVector(random(width), random(height));
}

function centerScreenPos() {
	return createVector(width / 2, height / 2);
}

function mousePos() {
	return createVector(mouseX, mouseY);
}


function aroundMouse(amt) {
	return aroundPos(mousePos(), amt);
}

function aroundPos(pos, amt) {
	let v = amt / 2;
	return {
		x: pos.x + random(-v, v),
		y: pos.y + random(-v, v)
	};
}

//mirrorX: position of mirror
// where to draw (original)
// drawFn(x, y): a callback to draw at a given x and y
function withSymmetryAround(mirrorX, x, y, drawFn) {
	const reflectedX = mirrorX * 2 - x;
	if (x < mirrorX) {
		drawFn(x, y);
		drawFn(reflectedX, y);
	}
}


function calculateTextCenter(words) {
	//figure the bounds for an arbitrary text size sz
	// then see how much that needs to be scaled up (sc) to fit the width,
	// then scale up the textSize sz *= sc
	let sizeOfText = 100;
	let bounds = font.textBounds(words, 0, 0, sizeOfText);
	sizeOfText *= 0.9 * width / bounds.w;

	//figure w and h to correctly position
	bounds = font.textBounds(words, 0, 0, sizeOfText);
	let x = width / 2 - bounds.w * 0.5;
	let y = height / 2 + bounds.h / 2;
	return {
		sizeOfText,
		pos: {
			x,
			y
		}
	};
}


//Find a suitable side length for a square canvas that is:
// * Definitely small enough to fit on the current device
// * No bigger than `mx`
// * A multiple of `multiple`
//
// Example usage:
// const dim = calcSquareCanvasSideHavingMultipleAndMax(100, 600);
// createCanvas(dim, dim);
function calcSquareCanvasSideHavingMultipleAndMax(multiple, mx) {
	const snapDownTo = (v, m) => m * floor(v / m);
	const smallerSide = min(windowWidth, windowHeight);
	const smaller = min(mx, smallerSide);
	return snapDownTo(smaller, multiple);
}
// Creates a function that can be repeatedly called to get values pulled, cycling, from an array.
// Example usage: 
// let colourCycler = generateCycler([ "#774f38", "#e08e79", "#f1d4af", "#ece5ce", "#c5e0dc" ]);
// for (let d = 600; d > 0; d -= 40){
//   fill(colourCycler());
//   circle(random(600), random(600), 100);
// }
function generateCycler(arr) {
	let ix = 0;
	// This function is closed over arr and ix
	// i.e. it has access to them and can find their current values and update them.
	// It does NOT capture the value of them when the function is created!
	function nextFn() {
		let res = arr[ix];
		ix = (ix + 1) % arr.length;
		return res;
	}
	return nextFn;
}


// Example usage:
// let gen = cycleGen(["#774f38", "#e08e79", "#f1d4af", "#ece5ce", "#c5e0dc"]);
// for (let d = 600; d > 0; d -= 40){
// 	fill(gen.next().value);
// 	circle(random(600), random(600), 100);
// }
function* cycleGenerator(arr) {
	while (true) {
		yield* arr;
	}
}
function centeredTextToPoints(words, font, size) {
	push(); // we'll want to revert our change to textFont
	const bounds = font.textBounds(words, 0, 0, size)
	textFont(font, size);
	textAscent();
	const points = font.textToPoints(words,
		width / 2 - bounds.w / 2,
		height / 2 + bounds.h / 2 - textDescent() / 2,
		size, {
			sampleFactor: 0.1,
			simplifyThreshold: 0
		});
	pop();
	return points;
}
