(function () {
    'use strict';

    var canvas = document.querySelector('#myClock'),
        canvasContext = canvas.getContext('2d'),
        cX = canvas.width / 2,
        cY = canvas.height / 2,
        endX, endY,
        radius = 150,
        date,
        hours, 
        minutes, 
        seconds,
        clockFace = 'default'; // ค่าเริ่มต้นของหน้าปัด

    initTime();

    if (canvasContext) {
        drawClock();
    }

    setInterval(animateClock, 1000);

    function initTime() {
        date = new Date();
        hours = date.getHours() % 12;
        minutes = date.getMinutes();
        seconds = date.getSeconds();
    }

    function animateClock() {
        clearCanvas();
        refreshTime();
        drawClock();
    }

    function clearCanvas() {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    function refreshTime() {
        seconds += 1;
        if (seconds >= 60) { minutes += 1; seconds = 0; }
        if (minutes >= 60) { hours += 1; minutes = 0; }
        if (hours >= 12) { hours = 0; }
    }

    function drawClock() {
        drawClockBackground();
        drawSecondsHand();
        drawMinutesHand();
        drawHoursHand();
    }

    function drawHand(beginX, beginY, endX, endY, color = "black", width = 2) {
        canvasContext.beginPath();
        canvasContext.moveTo(beginX, beginY);
        canvasContext.lineTo(endX, endY);
        canvasContext.strokeStyle = color;
        canvasContext.lineWidth = width;
        canvasContext.stroke();
        canvasContext.closePath();
    }

    function drawSecondsHand() {
        var rotation = (seconds * Math.PI) / 30,
            handLength = 0.95 * radius;
        endX = cX + handLength * Math.sin(rotation);
        endY = cY - handLength * Math.cos(rotation);
        drawHand(cX, cY, endX, endY, "red", 2);
    }

    function drawMinutesHand() {
        var rotation = ((minutes + seconds / 60) * Math.PI) / 30,
            handLength = 0.9 * radius;
        endX = cX + handLength * Math.sin(rotation);
        endY = cY - handLength * Math.cos(rotation);
        drawHand(cX, cY, endX, endY);
    }

    function drawHoursHand() {
        var rotation = ((hours * 5 + minutes / 12) * Math.PI) / 30,
            handLength = 0.6 * radius;
        endX = cX + handLength * Math.sin(rotation);
        endY = cY - handLength * Math.cos(rotation);
        drawHand(cX, cY, endX, endY, "black", 4);
    }

    function drawClockBackground() {
        var correction = 1 / 300,
            shiftUnit = 1 / 170,
            shiftFactor = 1 / 30,
            angleInitialPosition = 2,
            angleCurrentPositionBegin = 0,
            angleCurrentPositionEnd = 0,
            repeat = 60,
            lineWidth = 10;

        // ตั้งค่าพื้นหลังเป็นสีขาวทุกโหมด
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        // **ถ้าเป็นโหมด 'modern' (Another Clock Face) ให้มีขอบและตัวเลข**
        if (clockFace === 'modern') {
            // วาดขอบนาฬิกา
            canvasContext.beginPath();
            canvasContext.arc(cX, cY, radius, 0, 2 * Math.PI);
            canvasContext.lineWidth = 4;
            canvasContext.strokeStyle = "black";
            canvasContext.stroke();
            canvasContext.closePath();

            // วาดตัวเลขกำกับ
            canvasContext.font = "bold 20px Arial";
            canvasContext.fillStyle = "black";
            for (let i = 1; i <= 12; i++) {
                let angle = (i * Math.PI) / 6;
                let x = cX + Math.sin(angle) * (radius - 25);
                let y = cY - Math.cos(angle) * (radius - 25) + 7;
                canvasContext.fillText(i, x - 10, y);
            }
        }

        // วาดเส้นขีดบอกเวลาทั้งสองโหมด
        for (var i = 0; i < repeat; i += 1) {
            angleCurrentPositionBegin = angleInitialPosition - (i * shiftFactor) - correction;
            angleCurrentPositionEnd = angleCurrentPositionBegin + shiftUnit;

            // ถ้าเป็นโหมด 'modern' ให้เอาขีดตรงเลขออก
            if (clockFace === 'modern' && i % 5 === 0) continue;

            if (i % 5 == 0) {
                lineWidth = 10; // ขีดหลัก
            } else {
                lineWidth = 4; // ขีดเล็ก
            }
            canvasContext.strokeStyle = "black";
            drawArcAtPosition(cX, cY, radius, angleCurrentPositionBegin * Math.PI, angleCurrentPositionEnd * Math.PI, false, lineWidth);
        }
    }

    function drawArcAtPosition(cX, cY, radius, startAngle, endAngle, counterClockwise, lineWidth) {
        canvasContext.beginPath();
        canvasContext.arc(cX, cY, radius, startAngle, endAngle, counterClockwise);
        canvasContext.lineWidth = lineWidth;
        canvasContext.stroke();
        canvasContext.closePath();
    }

    function drawLittleCircle(cX, cY) {
        // ไม่มีวงกลมทึบตรงกลาง
    }

    function setClockFace(face) {
        clockFace = face;
        drawClock();
    }

    window.setClockFace = setClockFace;

})();