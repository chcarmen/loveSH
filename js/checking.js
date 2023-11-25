function search(twoD,oneD){
	// Searches a two dimensional array to see if it contains a one dimensional array. indexOf doesn't work in this case
	for(var i=0;i<twoD.length;i++){
		if(twoD[i][0] == oneD[0] && twoD[i][1] == oneD[1]) {
			return true;
		}
	}
	return false;
}

function floodFill(hex, side, index, deleting) {
	if (hex.blocks[side] === undefined || hex.blocks[side][index] === undefined) return;

	//store the color
	var color = hex.blocks[side][index].color;
	//nested for loops for navigating the blocks
	for(var x =-1;x<2;x++){
		for(var y =-1;y<2;y++){
			//make sure the they aren't diagonals
			if(Math.abs(x)==Math.abs(y)){continue;}
			//calculate the side were exploring using mods
			var curSide =(side+x+hex.sides)%hex.sides;
			//calculate the index
			var curIndex = index+y;
			//making sure the block exists at this side and index
			if(hex.blocks[curSide] === undefined){continue;}
			if(hex.blocks[curSide][curIndex] !== undefined){
				// checking equivalency of color, if its already been explored, and if it isn't already deleted
				if(hex.blocks[curSide][curIndex].color == color && search(deleting,[curSide,curIndex]) === false && hex.blocks[curSide][curIndex].deleted === 0 ) {
					//add this to the array of already explored
					deleting.push([curSide,curIndex]);
					//recall with next block explored
					floodFill(hex,curSide,curIndex,deleting);
				}
			}
		}
	}
}

function get_str_from_comb(comb)
{
	var str = comb[0];
	for (i=1; i<comb.length; i++) {
		str += comb[i];
	}
	return str;
}

function consolidateBlocks(hex,side,index){
	//record which sides have been changed
	var sidesChanged =[];
	var deleting=[];
	var deletedBlocks = [];
	var i, j, k;
	for (i=0; i<hex.blocks[side].length; i++) {
		if (i != index && hex.blocks[side][i].color == hex.blocks[side][index].color) {
			deleting.push([side, i]);
		}
	}

	comb_found = false;
	for (i=0; i<combinations.length; i++) {
		if (hex.blocks[side].length < combinations[i].length) continue;
		for (j=0; j<combinations[i].length; j++) {
			var found = -1;
			for (k=0; k<hex.blocks[side].length; k++) {
				if (combinations[i][j] == hex.blocks[side][k].color) found = k;
			}
			if (found < 0) break;
		}
		if (j == combinations[i].length) {
			for (k=0; k<hex.blocks[side].length; k++) {
				if (combinations[i].indexOf(hex.blocks[side][k].color) != -1) {
					deleting.push([side, k]);
				}
			}

			var myDiv = document.getElementById("myDiv");
			myDiv.innerHTML = get_str_from_comb(combinations[i]);
			break;
		}
	}

	if(deleting.length<1){return;}

	for(i=0; i<deleting.length;i++) {
		var arr = deleting[i];
		//just making sure the arrays are as they should be
		if(arr !== undefined && arr.length==2) {
			//add to sides changed if not in there
			if(sidesChanged.indexOf(arr[0])==-1){
				sidesChanged.push(arr[0]);
			}
			//mark as deleted
			hex.blocks[arr[0]][arr[1]].deleted = 1;
			deletedBlocks.push(hex.blocks[arr[0]][arr[1]]);
		}
	}

	// add scores
	var now = MainHex.ct;
	if(now - hex.lastCombo < settings.comboTime ){
		settings.comboTime = (1/settings.creationSpeedModifier) * (waveone.nextGen/16.666667) * 3;
		hex.comboMultiplier += 1;
		hex.lastCombo = now;
		var coords = findCenterOfBlocks(deletedBlocks);
		hex.texts.push(new Text(coords['x'],coords['y'],"x "+hex.comboMultiplier.toString(),"bold Q","#fff",fadeUpAndOut));
	}
	else{
		settings.comboTime = 240;
		hex.lastCombo = now;
		hex.comboMultiplier = 1;
	}
	var adder = deleting.length * deleting.length * hex.comboMultiplier;
	hex.texts.push(new Text(hex.x,hex.y,"+ "+adder.toString(),"bold Q ",deletedBlocks[0].color,fadeUpAndOut));
		hex.lastColorScored = deletedBlocks[0].color;
	score += adder;

    const prize = document.getElementById("prize");
    prize.play();
}
