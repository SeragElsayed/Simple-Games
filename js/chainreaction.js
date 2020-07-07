
var canvas = document.querySelector("#myCanvas")
var diffSelector = document.querySelector(".difficulty select")
var startBtn = document.querySelector('.startBtn')
var resetBtn = document.querySelector('.resetBtn')
var level = document.querySelector('.level')
var recHits = document.querySelector('.recHits')
var reqHits = document.querySelector('.reqHits')
var score = document.querySelector('.score')
var livesHtml = document.querySelector('.lives')

//canvas size variables
canvas.width = innerWidth - 50
canvas.height = innerHeight - 100
var ctx = canvas.getContext("2d")

//balls shapes and color pallettes
//the color palette for the circles
var sun = new Image()
sun.src = 'images/sun.png'
var mercury = new Image()
mercury.src = 'images/mercury.png'
var earth = new Image()
earth.src = 'images/earth.png'
var mars = new Image()
mars.src = 'images/mars.png'
var moon = new Image()
moon.src = 'images/moon.png'
var jupitar = new Image()
jupitar.src = 'images/jupitar.png'
var stars = new Image()
stars.src = 'images/stars.jpg'
var currColorPalette

var backgroundColor
var colorPalette = new Array()
colorPalette = [
    {
        colors: ['#2039CC', '#192DA1', '#111E6C', '#0C154A', '#080E33'],
        background: '#0D0D0D'
    },
    {
        colors: [mercury, sun, jupitar, earth, moon],
        background: stars,
        isImage: true
    },
    {
        colors: ['#44AFF2', '#7EDDF2', '#F2E205', '#F27405'],
        background: '#010440'
    }
]


//player variables
var playerClkLoc = { x: undefined, y: undefined }
var lives = 3
//playerBall=ply
//var playerBallsSize=2
var playerBalls = []
var clicksNum = 0
var maxClicksNum = 4
var screenRate = 60
var levelNum = 1
var difficulltyScale = 4
//var maxRadiusPlayerBall=50
var minRadiusPlayerBall = 1
var drPlayerBall = 1 //rate of change of radius
var timePlayerBall = 30 //in seconds
var dtPlayerBall = 1 //rate of change of time
var holdTimePlayerBall = 1000
var numOfHits = 0

//game balls variables
//the array which carry the balls
var ballsArray = []

var ballsNum = 23
var maxBallRadius = 200
var minBallRadius = 2
var maxSpeed = 1
var minSpeed = -1

//levels variables
var neededHits = 5
var levels = new Object()
var chosenDifficulty

//resizing canvas when window resized
window.addEventListener('resize', function () {
    canvas.width = innerWidth - 50
    canvas.height = innerHeight - 100
    // redrawBalls(ballsArray)
})

//reset game function
var reset = function () {

    playerClkLoc = { x: undefined, y: undefined }
    playerBalls = []
    clicksNum = 0
    numOfHits = 0
    ballsArray = []
}
//level up
var levelUp = function (neededHitsScale) {
    ballsNum += 10
    neededHits = Math.floor(ballsNum / neededHitsScale)

}
//levelsSetting

levels.normal = function () {
    lives = 3
    ballsNum = 10
    maxBallRadius = 7
    minBallRadius = 3
    maxSpeed = 2
    minSpeed = -2
    maxClicksNum = 1
    holdTimePlayerBall = 200
    neededHits = Math.floor(ballsNum / 4)
}
//function to calculate distance between 2 points
function calcDistance(x1, y1, x2, y2) {
    var xDist = x2 - x1
    var yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2), 2)
}

//a function to choose a random color from the palette
var pickRandomColor = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

//function that return a random number within a range
function randInRange(max, min = 1, negative) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var value = Math.floor(Math.random() * (max - min + 1)) + min
    while (value == 0) {
        value = Math.floor(Math.random() * (max - min + 1)) + min
    }
    return value
}


//class for creating balls
function Ball(_x, _dx, _y, _dy, _radius, _rotation) {
    this.x = _x
    this.y = _y
    this.dx = _dx
    this.dy = _dy
    this.radius = _radius
    this.rotation = _rotation
    this.color = pickRandomColor(currColorPalette.colors)
    this.draw = function () {
        if (currColorPalette.isImage) {
            ctx.drawImage(this.color, this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
        }
        else {
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.fill()
            ctx.beginPath()

        }
    }
    this.update = function () {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) { this.dx = -this.dx }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) { this.dy = -this.dy }
        this.x += this.dx
        this.y += this.dy
    }
}

//a function for creating balls in random location with random radius
function intiateBalls(_ballsNum, _maxBallRadius, _minBallRadius, _ballsArray) {
    for (var i = 0; i < _ballsNum; i++) {
        var _radius = randInRange(_maxBallRadius, _minBallRadius)
        var _x = randInRange(canvas.width - _radius, _radius)
        var _y = randInRange(canvas.height - _radius, _radius)
        var _dx = randInRange(maxSpeed, minSpeed)
        var _dy = randInRange(maxSpeed, minSpeed)
        var _rotation = randInRange(1, -1)
        var ball = new Ball(_x, _dx, _y, _dy, _radius, _rotation)
        _ballsArray.push(ball)
    }
}

//function to animate player balls in event listener click on canvas
function incPlayerBall(bn) {

    var bn2 = bn
    if (playerBalls[bn].time < timePlayerBall && playerBalls[bn].time >= 0) {
        playerBalls[bn].time += playerBalls[bn].dtPlayerBall
        playerBalls[bn].radius += playerBalls[bn].drPlayerBall

    }
    if (playerBalls[bn].time == timePlayerBall) {
        playerBalls[bn2].time += playerBalls[bn].dtPlayerBall
        setTimeout(function () {
            playerBalls[bn2].dtPlayerBall = -playerBalls[bn].dtPlayerBall
            playerBalls[bn2].drPlayerBall = -drPlayerBall
            playerBalls[bn2].time += 2 * playerBalls[bn].dtPlayerBall
        }, holdTimePlayerBall);
    }
    if (playerBalls[bn].time < 0) {
        playerBalls[bn].radius = 0
        playerBalls[bn].time = 0
        clearInterval(playerBalls[bn].intervalValue)
    }
}


//get player click location event and create a ball to be hit
canvas.addEventListener('click', function (e) {

    if (clicksNum != maxClicksNum) {
        playerClkLoc.x = e.offsetX
        playerClkLoc.y = e.offsetY
        var ballnum = clicksNum
        playerBalls[clicksNum] = new Ball(playerClkLoc.x, 0, playerClkLoc.y, 0, minRadiusPlayerBall)

        //adding props to playerball
        playerBalls[clicksNum].time = 0
        playerBalls[clicksNum].drPlayerBall = drPlayerBall
        playerBalls[clicksNum].dtPlayerBall = dtPlayerBall
        playerBalls[clicksNum].intervalValue = setInterval(function () {
            incPlayerBall(ballnum)
        }, screenRate);
        clicksNum++
    }
})





//transform ballsArray elemnt to playerBall element
function tranformBall(ballsArrayBall, index) {
    var ballnum = playerBalls.length
    var ballnum2 = ballnum
    playerBalls[ballnum] = ballsArrayBall
    playerBalls[ballnum] = new Ball(ballsArrayBall.x, 0, ballsArrayBall.y, 0, minRadiusPlayerBall)
    //adding time prop to playerball
    playerBalls[ballnum].time = 0
    playerBalls[ballnum].drPlayerBall = drPlayerBall
    playerBalls[ballnum].dtPlayerBall = dtPlayerBall
    playerBalls[ballnum].intervalValue = setInterval(function () {
        incPlayerBall(ballnum2)
    }, screenRate);
    ballsArray.splice(index, 1)
}

//set the game difficullty event listener
diffSelector.addEventListener('change', function (e) {
    chosenDifficulty = e.target.value
    //console.log(levels.easy)
    if (chosenDifficulty != 'surreal mode') {
        levels[chosenDifficulty]()
        surreal = 0
    }
})

// function to animate balls 
var levelEndFlag = 0
var surreal = 0
var tempScore = 0
var tempstyle
var pause = 0
function animate() {
    if (pause == 1) {
        return
    }
    //creating loop for animate like set interval
    requestAnimationFrame(animate)
    if (chosenDifficulty != 'surreal mode') {

        ctx.clearRect(0, 0, innerWidth, innerHeight)
        ctx.fillStyle = currColorPalette.background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

    }
    else if (surreal == 0) {

        ctx.clearRect(0, 0, innerWidth, innerHeight)
        ctx.drawImage(stars, 0, 0, canvas.width, canvas.height);
        surreal = 1
    }

    // draw game balls array
    for (var i = 0; i < ballsArray.length; i++) {
        ballsArray[i].update()
        ballsArray[i].draw()

    }
    //draw player balls array
    levelEndFlag = 0
    for (var j = 0; j < playerBalls.length; j++) {
        if (playerBalls[j].radius > 0) {
            playerBalls[j].draw()
            levelEndFlag = 1
            // playerBalls[ballnum].sound.play()
        }
    }
    //to control player lives and gameover
    if (clicksNum == 1 && levelEndFlag == 0 && numOfHits < neededHits) {
        pause = 1
        clicksNum = 0
        lives--
        ctx.clearRect(0, 0, innerWidth, innerHeight)
        tempstyle = ctx.fillStyle
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white'
        ctx.font = '48px serif';
        ctx.textAlign = "center";
        if (lives > 0) {

            ctx.fillText('number of tries left : ' + lives, canvas.width / 2, canvas.height / 2)
            livesHtml.innerHTML = lives


        }
        else {
            ctx.fillText('GAMEOVER', canvas.width / 2, canvas.height / 2)
            reset()
            levels.normal()
            intiateBalls(ballsNum, maxBallRadius, minBallRadius, ballsArray)
        }
        setTimeout(function () {
            pause = 0
            ctx.fillStyle = tempstyle
            animate()
        }, 1000)

    }
    //to control the game levels
    if (levelEndFlag == 0 && numOfHits >= neededHits) {
        pause = 1
        ctx.clearRect(0, 0, innerWidth, innerHeight)
        tempstyle = ctx.fillStyle
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white'
        ctx.font = '48px serif';

        ctx.textAlign = "center";
        levelNum++
        ctx.fillText('level ' + levelNum, canvas.width / 2, canvas.height / 2)
        setTimeout(function () {
            pause = 0
            ctx.fillStyle = tempstyle
            animate()
        }, 1000)
        tempScore = parseInt(score.innerHTML)
        score.innerHTML = tempScore + (numOfHits - neededHits)
        reset()
        levelUp(difficulltyScale)

        level.innerHTML = levelNum
        recHits.innerHTML = 0 + ' of ' + ballsNum
        reqHits.innerHTML = neededHits
        intiateBalls(ballsNum, maxBallRadius, minBallRadius, ballsArray)


    }
    //collision detection
    var distance

    for (var m = 0; m < ballsArray.length; m++) {
        for (var n = 0; n < playerBalls.length; n++) {
            if (ballsArray[m] && playerBalls[n]) {
                distance = 0
                distance = calcDistance(ballsArray[m].x, ballsArray[m].y, playerBalls[n].x, playerBalls[n].y)
                if (distance < ballsArray[m].radius + playerBalls[n].radius && playerBalls[n].radius > 0) {
                    tranformBall(ballsArray[m], m)
                    numOfHits++
                    recHits.innerHTML = numOfHits + ' of ' + ballsNum
                }
            }
        }
    }
}



levels.normal()
currColorPalette = pickRandomColor(colorPalette)
canvasBgColor = currColorPalette.background
intiateBalls(ballsNum, maxBallRadius, minBallRadius, ballsArray)

animate()

