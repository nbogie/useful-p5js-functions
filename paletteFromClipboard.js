//Usage: 	listenForPalettePaste(restartWithNewPalette);

//TODO: don't listen only for a palette string - also from:
//    - urls to palette sites //e.g. https://www.colourlovers.com/palette/443995/i_demand_a_pancake
//    - pasted images
//    - or from the webcam?

//experimental
//tried registering on the canvas, more specifically, but it doesn't get the event.  don't know why.
//It's not good that the document body gets the listener: the body may have other dom elements like text fields for whom the paste event is intended.
function listenForPalettePaste(callback) {
	document.body.onpaste = (event) => handlePaste(event, callback);
}


//given a clipboard event, attempt to parse a palette string from it. 
//if successful, invoke the given callback, handing it the palette, which will be an array of strings.
//https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData
function handlePaste(clipboardEvent, callback) {
	var pastedText = clipboardEvent.clipboardData.getData("text");
	if (!pastedText) {
		return;
	}
	const maybePalette = parsePalette(pastedText);
	if (maybePalette && maybePalette.length > 0) {
		callback(maybePalette);
	}
}

function parsePalette(maybePaletteStr) {
	//did we get given a string?
	if (!maybePaletteStr || typeof maybePaletteStr !== "string") {
		console.warn("pasted palette: no string given");

		return null;
	}
	
	let str = maybePaletteStr.trim();
	
	//is it only composed of hex characters, or comma space or # characters?
	if (!(/^[#0-9a-f, ]+$/i).test(str)) {
		console.warn("pasted palette: unexpected characters.  only hexadecimal or , #");
		return null;
	}
	
	//ok break it by comma
	let palette = str.split(",").map(v => v.trim())
	
	if (palette.length === 0 || palette.length > 256){
		console.warn("pasted palette: zero or too many colours");
		return null;
	}
	
	const lens = palette.map(str => str.length);
	
	if (max(lens) > 10) {
		console.warn("pasted palette has some too-big colour strings");
		return null;
	}
	
	return palette;
}
