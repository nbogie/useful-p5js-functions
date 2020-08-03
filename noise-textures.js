
function drawNoisyBackground() {
	strokeWeight(0.5);
	stroke(random([255, 0]), random(20, 60));
	for (let i = 0; i < 4; i++) {
		let p = randomPos();
		line(p.x, 0, p.x, height);
	}
}
