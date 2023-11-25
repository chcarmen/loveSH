function render() {
	var grey = '#bdc3c7';
	if (gameState === 0) {
		grey = "rgb(220, 223, 225)";
	}
	
	ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
	clearGameBoard();

	var img = document.getElementById("showPlace");
	ctx.drawImage(img, 0, 0, 4928, 3264, 0, 0, trueCanvas.width, trueCanvas.height);
	if (gameState === 1 || gameState === 2 || gameState === -1 || gameState === 0) {
		if (op < 1) {
			op += 0.01;
		}
		ctx.globalAlpha = op;
		drawPolygon(trueCanvas.width / 2 , trueCanvas.height / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, "rgb(255, 255, 255, 0.2)", 4, '#ffffff');
		drawTimer();
		ctx.globalAlpha = 1;
	}

	var i;
	for (i = 0; i < MainHex.blocks.length; i++) {
		for (var j = 0; j < MainHex.blocks[i].length; j++) {
			var block = MainHex.blocks[i][j];
			block.draw(true, j);
		}
	}
	for (i = 0; i < blocks.length; i++) {
		blocks[i].draw();
	}

	MainHex.draw();
	
	height = 2 * MainHex.sideLength;
	var maxR = 0.15, minR = 0.05;//大五角星的半径，小五角星的半径
	var maxX = 0.25, maxY = 0.25;//大五星的位置   
	// 小五角星的位置
	var minX = [0.50, 0.60, 0.60, 0.50]; 
	var minY = [0.10, 0.20, 0.35, 0.45];   
	// 画大 ☆   
	var ox = height * maxX, oy = height * maxY;
	var base_x = trueCanvas.width / 2 - MainHex.sideLength / 4 * 3;
	var base_y = trueCanvas.height / 2 - MainHex.sideLength / 4 * 3;
	create5star(base_x + ox, base_y + oy, height * maxR, "#ff0", 0);//绘制五角星   
	
	// 画小 ★   
	for (var idx = 0; idx < 4; idx++) {   
		var sx = minX[idx] * height, sy = minY[idx] * height;  
		// 计算大五角星圆心和小五角星圆心连线的斜率（也就是画布旋转的弧度值）
		var theta = Math.atan((oy - sy) / (ox - sx));   
		create5star(base_x + sx, base_y + sy, height * minR, "#ff0", -Math.PI / 2 + theta);   
	}

	if (gameState ==1 || gameState ==-1 || gameState === 0) {
		drawScoreboard();
	}

	for (i = 0; i < MainHex.texts.length; i++) {
		var alive = MainHex.texts[i].draw();
		if(!alive){
			MainHex.texts.splice(i,1);
			i--;
		}
	}

	if ((MainHex.ct < 650 && (gameState !== 0) && !MainHex.playThrough)) {
		if (MainHex.ct > (650 - 50)) {
			ctx.globalAlpha = (50 - (MainHex.ct - (650 - 50)))/50;
		}

		if (MainHex.ct < 50) {
			ctx.globalAlpha = (MainHex.ct)/50;
		}

		//renderBeginningText();
		ctx.globalAlpha = 1;
	}

	if (gameState == -1) {
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = 'rgb(236,240,241)';
		ctx.fillRect(0, 0, trueCanvas.width, trueCanvas.height);
		ctx.globalAlpha = 1;
	}

	settings.prevScale = settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	settings.blockHeight = settings.baseBlockHeight * settings.scale;

    var tips = '<h3>上海地标</h3>\
                <hr></hr>\
                <br></br>\
                <p>浦东</p>\
                <p>徐汇</p>\
                <p>奉贤</p>\
                <p>闵行</p>\
                <p>普陀</p>\
                <p>嘉定</p>\
                <p>宝山</p>\
                <p>黄埔</p>\
                <p>杨浦</p>\
                <p>松江</p>';

    $("#tips").html(tips);
}

function renderBeginningText() {
	var upperheight = (trueCanvas.height/2) - ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (5/6);
	var lowerheight = (trueCanvas.height/2) + ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (11/16);
    var text = '';
    var mob, fontSize;
    if(/mobile|Mobile|iOS|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        mob = true;
        input_text = 'Tap the screen\'s left and right'
        action_text = 'sides to rotate the hexagon'
        score_text = 'Match 3+ blocks to score'
        fontSize = 35
    } else {
        mob = false
        input_text = 'Use the right and left arrow keys'
        action_text = 'to rotate the hexagon'
        score_text = 'Match 3+ blocks to score!'
        fontSize = 27
    }
	renderText((trueCanvas.width)/2 + 2 * settings.scale,upperheight-0*settings.scale, fontSize, '#2c3e50', input_text);
	renderText((trueCanvas.width)/2 + 2 * settings.scale,upperheight+33*settings.scale, fontSize, '#2c3e50', action_text);
    if (!mob) {
	   drawKey("",(trueCanvas.width)/2 + 2 * settings.scale-2.5,upperheight+38*settings.scale);
    }

	renderText((trueCanvas.width)/2 + 2 * settings.scale,lowerheight,fontSize, '#2c3e50', score_text);
}

function drawKey(key, x, y) {
	ctx.save();
	switch (key) {
		case "left":
			ctx.translate(x, y + settings.scale * 13);
			ctx.rotate(3.14159);
			ctx.font = "20px Fontawesome";
			ctx.scale(settings.scale, settings.scale);
			ctx.fillText(String.fromCharCode("0xf04b"), 0, 0);
			break;
		case "right":
			ctx.font = "20px Fontawesome";
			ctx.translate(x , y + settings.scale * 27.5);
			ctx.scale(settings.scale, settings.scale);
			ctx.fillText(String.fromCharCode("0xf04b"), 0, 0);
			break;
		
		default:
			drawKey("left", x - 5, y);
			drawKey("right", x + 5, y);
	}
	ctx.restore();
}
