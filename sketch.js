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


function withProbability(p, fn){
	if (random() < p){
		fn();
	}
}

function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn();
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

//From jeremy douglass: 
//https://discourse.processing.org/t/how-do-i-cycle-lerp-between-multiple-colors/13441/5
function lerpColors(amt, colors, colorModeForInterpolation=RGB) {
	if (colors.length === 1) {
		return colors[0];
	}
	let cunit = 1 / (colors.length - 1);
	colorMode(colorModeForInterpolation);
	return lerpColor(colors[floor(amt / cunit)], colors[ceil(amt / cunit)], amt % cunit / cunit);
}
