/*jslint browser: true */
/*global color, circle,square,random, createVector,createCanvas, windowWidth, windowHeight, rectMode, CENTER, noStroke, fill, push, pop, rotate, translate, background, lerpColor, rect, ellipse, mouseX, mouseY */
"use strict";

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	rectMode(CENTER);
	noStroke();
}

function draw() {
	circle(mouseX, mouseY, 20);
	withProbability(0.015, () => rect(mouseX, mouseY, 100, 100, 5));
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

function repeatRandomChoice(n, arr) {
	if (arr.length > 0) {
		for (let i = 0; i < n; i++) {
			let chosenFn = random(arr);
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


function randomScreenPosition() {
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
