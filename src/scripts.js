
document.addEventListener("DOMContentLoaded", function() {
    const canvasContainer = document.querySelector(".canvas-container");
    const canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");

    function resizeCanvasContainer() {
        const viewportHeight = window.innerHeight;
        canvasContainer.style.height = '${viewportHeight * 0.5}px'; 
    }

    window.addEventListener("resize", resizeCanvasContainer);
    resizeCanvasContainer();

    function resizeCanvas() {
        canvas.width = canvasContainer.offsetWidth;
        canvas.height = canvasContainer.offsetHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function getMousePos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function draw(e) {
        if (!isDrawing) return;
        const { x, y } = getMousePos(canvas, e);
        context.strokeStyle = "#000"; 
        context.lineJoin = "round";
        context.lineWidth = 5; 
        context.beginPath();
        
        context.moveTo(lastX, lastY);
        
        context.lineTo(x, y);
        context.stroke();

        lastX = x;
        lastY = y;
    }

    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        const { x, y } = getMousePos(canvas, e);
        lastX = x;
        lastY = y;
    });

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseout", () => isDrawing = false);

    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener("click", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

  
    const eraseButton = document.getElementById("erase-button");
    eraseButton.addEventListener("click", () => {
        const hsSpan = document.querySelector('.hs span');
        let currentText = hsSpan.textContent;
        const underscoreIndex = currentText.indexOf('_');
        if (underscoreIndex !== -1) {
            
            if (underscoreIndex > 0) {
                hsSpan.textContent = currentText.substring(0, underscoreIndex - 1) + '_' + currentText.substring(underscoreIndex);
            } else {
                hsSpan.textContent = '_' + currentText.substring(underscoreIndex + 1);
            }
        } else if (currentText.length > 0) {
          
            hsSpan.textContent = currentText.slice(0, -1);
        }
    });
    

    let score = 0;

    const checkAndUpdateScore = (recognizedText) => {
        
        const lowerRecognizedText = recognizedText.toLowerCase();
    
        if (lowerRecognizedText.length >= 3 && lowerRecognizedText.substring(0, 3) === "bus") {
            score++;
            document.querySelector('.hg').textContent = `SCORE: ${score}`;
        }
        
        if (lowerRecognizedText.length >= 3 && lowerRecognizedText.substring(0, 3) === "cat") {
            score++;
            document.querySelector('.hg').textContent = `SCORE: ${score}`;
        }
    };
    

    const checkButton = document.getElementById("check-button");
    checkButton.addEventListener("click", async () => {
        const imageData = canvas.toDataURL();
        const { data: { text } } = await Tesseract.recognize(imageData, 'eng', { tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' });
        const recognizedText = text.replace(/[^A-Za-z]/g, '');
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        if (recognizedText.length > 0) {
            const recognizedCharacter = recognizedText[0];
            const hsSpan = document.querySelector('.hs span');
            const currentText = hsSpan.textContent;
            const underscoreIndex = currentText.indexOf('_');
            
            if (underscoreIndex !== -1) {
                hsSpan.textContent = currentText.substring(0, underscoreIndex) + recognizedCharacter + currentText.substring(underscoreIndex + 1);
                checkAndUpdateScore(hsSpan.textContent);
            } else {
                hsSpan.textContent += recognizedCharacter;
                checkAndUpdateScore(hsSpan.textContent);
            }
        } else {
            const hsSpan = document.querySelector('.hs span');
            const currentText = hsSpan.textContent;
            const underscoreIndex = currentText.indexOf('_');
            if (underscoreIndex !== -1) {
                alert("Please draw a character first.");
            } else {
                checkAndUpdateScore(hsSpan.textContent);
            }
        }
    });
    

    const soundButton = document.getElementById("sound-button");
    const audio = document.getElementById("audio");

    soundButton.addEventListener("click", () => {
        audio.play();
    });

    const nextButton = document.getElementById("next-button");
    const displayImage = document.getElementById("displayImage");
    const audioSrcMap = {
        BUS: "BUS.mp3",
        CAT: "CAT.mp3" 
    };
    const imageSrcMap = {
        BUS: "download (1).jpg",
        CAT: "cat_image.jpg" 
    };

    nextButton.addEventListener("click", () => {
        
        const recognizedText = document.querySelector('.hs span').textContent.toLowerCase();;

      
        document.querySelector('.hs span').textContent = "___";

        if (recognizedText.substring(0, 3) === "bus") {
            displayImage.src = imageSrcMap["CAT"];
            audio.src = audioSrcMap["CAT"];
        } else {
            displayImage.src = imageSrcMap["BUS"];
            audio.src = audioSrcMap["BUS"];
        }
    });
});
