const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");


const INITIAL_COLOR = "#2c2c2c"
canvas.width = document.getElementsByClassName("canvas")[0].offsetWidth;
canvas.height = document.getElementsByClassName("canvas")[0].offsetHeight;


ctx.strokeStyle = "INITIAL_COLOR";
ctx.fillStyle = "INITIAL_COLOR"
ctx.lineWidth = 2.5;


let painting = false;
let filling = false;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}



function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function onMouseDown() {
    painting = true;
}

function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handModeClick() {
    if (filling === true) {
        filling = false;
        mode.innerText = "Fill"
    } else {
        filling = true;
        mode.innerText = "Paint";
    }
}

function handleCanvasClick() {
    if (filling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function handleCM(event) {
    event.preventDefault(); //우클릭방지
}

function handleSaveClick() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a"); //링크만들기
    link.href = image;
    link.download = "downLoad";
    link.click();
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove); //마우스 이동
    canvas.addEventListener("mousedown", startPainting); //마우스 버튼 누르고 시작
    canvas.addEventListener("mouseup", stopPainting); //마우스버튼 떼졌을때
    canvas.addEventListener("mouseleave", stopPainting); //마우스가 캔버스에 벗어났을때 종료
    canvas.addEventListener("click", handleCanvasClick); //마우스 클릭이벤트 처리
    canvas.addEventListener("contextmenu", handleCM); //마우스 이벤트 처리 우클릭
}

if (colors) {
    Array.from(colors).forEach(color =>
        color.addEventListener("click", handleColorClick));
}

if (range) {
    range.addEventListener("input", handleRangeChange)
}

if (mode) {
    mode.addEventListener("click", handModeClick);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}