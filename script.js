// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

    var progVal = 0;
    const progbar = document.getElementById("progbar");
    var lastPose = "Up";

    function updateProgressBar(next) {
        if (next == "None" || lastPose != next) {
            progVal -= 8;
        } else {
            progVal += 4;
        }

        if (progVal >= 100) { // do something
            if (next == "Up") {
                keyUp();
            } else if (next == "Right") {
                keyRight();
            } else if (next == "Down") {
                keyDown();
            } else if (next == "Left") {
                keyLeft();
            }
            progVal = 0;
        }
        if (progVal < 0) {progVal = 0;}
        
        lastPose = next;
        progbar.style.width = progVal + "%";
    }


    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/_2PD0Vsiz/";
    let model, webcam, ctx, labelContainer, maxPredictions;

    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const size = 200;
        const flip = true; // whether to flip the webcam
        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append/get elements to the DOM
        const canvas = document.getElementById("canvas");
        canvas.width = size; canvas.height = size;
        ctx = canvas.getContext("2d");

        document.getElementsByClassName("container")[0].style.visibility = "visible";
        document.getElementById("startscreen").style.display = "none";

    }

    async function loop(timestamp) {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

     // START OF 2048 CODING

        const gridDisplay = document.querySelector(".grid")
        const scoreDisplay = document.querySelector("#score")
        const resultDisplay = document.querySelector("#result")
        const width = 4
        let squares = []
        let score = 0
    
        // create the playing board
        function createBoard() {
            for (let i = 0; i < width * width; i++) {
                const square = document.createElement("div")
                square.innerHTML = 0
                gridDisplay.appendChild(square)
                squares.push(square)
            }
            generate()
            generate()
        }
        createBoard()
    
        //generate a new number
        function generate() {
            const randomNumber = Math.floor(Math.random() * squares.length)
            if (squares[randomNumber].innerHTML == 0) {
                squares[randomNumber].innerHTML = 2
                checkForGameOver()
            } else generate()
        }
    
        function moveRight() {
            for (let i = 0; i < 16; i++) {
                if (i % 4 === 0) {
                    let totalOne = squares[i].innerHTML
                    let totalTwo = squares[i + 1].innerHTML
                    let totalThree = squares[i + 2].innerHTML
                    let totalFour = squares[i + 3].innerHTML
                    let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
    
                    let filteredRow = row.filter(num => num)
                    let missing = 4 - filteredRow.length
                    let zeros = Array(missing).fill(0)
                    let newRow = zeros.concat(filteredRow)
    
                    squares[i].innerHTML = newRow[0]
                    squares[i + 1].innerHTML = newRow[1]
                    squares[i + 2].innerHTML = newRow[2]
                    squares[i + 3].innerHTML = newRow[3]
                }
            }
        }
    
        function moveLeft() {
            for (let i = 0; i < 16; i++) {
                if (i % 4 === 0) {
                    let totalOne = squares[i].innerHTML
                    let totalTwo = squares[i + 1].innerHTML
                    let totalThree = squares[i + 2].innerHTML
                    let totalFour = squares[i + 3].innerHTML
                    let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
    
                    let filteredRow = row.filter(num => num)
                    let missing = 4 - filteredRow.length
                    let zeros = Array(missing).fill(0)
                    let newRow = filteredRow.concat(zeros)
    
                    squares[i].innerHTML = newRow[0]
                    squares[i + 1].innerHTML = newRow[1]
                    squares[i + 2].innerHTML = newRow[2]
                    squares[i + 3].innerHTML = newRow[3]
                }
            }
        }
    
        function moveUp() {
            for (let i = 0; i < 4; i++) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + width].innerHTML
                let totalThree = squares[i + width * 2].innerHTML
                let totalFour = squares[i + width * 3].innerHTML
                let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
    
                let filteredColumn = column.filter(num => num)
                let missing = 4 - filteredColumn.length
                let zeros = Array(missing).fill(0)
                let newColumn = filteredColumn.concat(zeros)
    
                squares[i].innerHTML = newColumn[0]
                squares[i + width].innerHTML = newColumn[1]
                squares[i + width * 2].innerHTML = newColumn[2]
                squares[i + width * 3].innerHTML = newColumn[3]
            }
        }
    
        function moveDown() {
            for (let i = 0; i < 4; i++) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i + width].innerHTML
                let totalThree = squares[i + width * 2].innerHTML
                let totalFour = squares[i + width * 3].innerHTML
                let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
    
                let filteredColumn = column.filter(num => num)
                let missing = 4 - filteredColumn.length
                let zeros = Array(missing).fill(0)
                let newColumn = zeros.concat(filteredColumn)
    
                squares[i].innerHTML = newColumn[0]
                squares[i + width].innerHTML = newColumn[1]
                squares[i + width * 2].innerHTML = newColumn[2]
                squares[i + width * 3].innerHTML = newColumn[3]
            }
        }
    
        function combineRow() {
            for (let i = 0; i < 15; i++) {
                if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                    let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
                    squares[i].innerHTML = combinedTotal
                    squares[i + 1].innerHTML = 0
                    score += combinedTotal
                    scoreDisplay.innerHTML = score
                }
            }
            checkForWin()
        }
    
        function combineColumn() {
            for (let i = 0; i < 12; i++) {
                if (squares[i].innerHTML === squares[i + width].innerHTML) {
                    let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
                    squares[i].innerHTML = combinedTotal
                    squares[i + width].innerHTML = 0
                    score += combinedTotal
                    scoreDisplay.innerHTML = score
                }
            }
            checkForWin()
        }
    
        ///assign functions to keys
    
        function keyLeft() {
            moveLeft()
            combineRow()
            moveLeft()
            generate()
        }
    
        function keyRight() {
            moveRight()
            combineRow()
            moveRight()
            generate()
        }
    
        function keyUp() {
            moveUp()
            combineColumn()
            moveUp()
            generate()
        }
    
        function keyDown() {
            moveDown()
            combineColumn()
            moveDown()
            generate()
        }
    
        //check for the number 2048 in the squares to win
        function checkForWin() {
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].innerHTML == 2048) {
                    resultDisplay.innerHTML = "You WIN!"
                    document.removeEventListener("keydown", control)
                    setTimeout(clear, 3000)
                }
            }
        }
    
        //check if there are no zeros on the board to lose
        function checkForGameOver() {
            let zeros = 0
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].innerHTML == 0) {
                    zeros++
                }
            }
            if (zeros === 0) {
                resultDisplay.innerHTML = "You LOSE!"
                document.removeEventListener("keydown", control)
                setTimeout(clear, 3000)
            }
        }
    
        function clear() {
            clearInterval(myTimer)
        }
    
        //add colours
        function addColours() {
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = "#afa192"
                else if (squares[i].innerHTML == 2) squares[i].style.backgroundColor = "#eee4da"
                else if (squares[i].innerHTML == 4) squares[i].style.backgroundColor = "#ede0c8"
                else if (squares[i].innerHTML == 8) squares[i].style.backgroundColor = "#f2b179"
                else if (squares[i].innerHTML == 16) squares[i].style.backgroundColor = "#ffcea4"
                else if (squares[i].innerHTML == 32) squares[i].style.backgroundColor = "#e8c064"
                else if (squares[i].innerHTML == 64) squares[i].style.backgroundColor = "#ffab6e"
                else if (squares[i].innerHTML == 128) squares[i].style.backgroundColor = "#fd9982"
                else if (squares[i].innerHTML == 256) squares[i].style.backgroundColor = "#ead79c"
                else if (squares[i].innerHTML == 512) squares[i].style.backgroundColor = "#76daff"
                else if (squares[i].innerHTML == 1024) squares[i].style.backgroundColor = "#beeaa5"
                else if (squares[i].innerHTML == 2048) squares[i].style.backgroundColor = "#d7d4f0"
            }
        }
        addColours()
    
        let myTimer = setInterval(addColours, 100)

    async function predict() {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        // Prediction 2: run input through teachable machine classification model
        const prediction = await model.predict(posenetOutput);

        var bestGuess = 0;

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            
            if (prediction[i].probability > prediction[bestGuess].probability) {
                bestGuess = i;
            }
        }

        document.getElementById("bestGuess").innerHTML = prediction[bestGuess].className;

        updateProgressBar(prediction[bestGuess].className);

        // finally draw the poses
        drawPose(pose);
    }

    function drawPose(pose) {
        if (webcam.canvas) {
            ctx.drawImage(webcam.canvas, 0, 0);
            // draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
            }
        }
    }