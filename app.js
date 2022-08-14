const fields = 16;
const board = document.getElementById("board");
const scoreBoard = document.querySelector("#score span");
const timesBoard = document.getElementById("container")
const colors = ["red", "cyan", "lightblue", "yellow", "purple", "lightgreen", "gold", "magenta"];
const pairs = [...colors, ...colors]
const times = JSON.parse(localStorage.getItem("times")) || []
let score = 0;
let result = pairs.length / 2;
let selectColors = [];
scoreBoard.textContent = score;

function render() {
    if (times.length) {
        times.sort();
        times.splice(3, 1);
        const list = document.createElement("ul");
        const top = document.createElement('div');
        top.id = "top";
        top.textContent = "TOP 3 czasów:"
        timesBoard.appendChild(top)
        times.forEach(time => {
            const li = document.createElement('li')
            li.textContent = time;
            list.append(li)
            top.append(list)

        })
    }
    for (let i = 0; i < fields; i++) {
        const field = document.createElement("div");
        field.setAttribute("data-id", i)
        randomColor(field)
        board.appendChild(field)
    }
}

window.addEventListener('load', render)

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

let startTime;
setTimeout(() => {
    let elements = board.querySelectorAll("div");
    elements.forEach(element => {

        element.classList.add("hidden")
        element.addEventListener('click', flipCard)
        startTime = new Date().getTime()
    }

    )
}, 5000)

function flipCard() {
    let el = this
    el.classList.remove("hidden")
    selectColors.push(this.className)
    let time;
    if (el == selectColors[0])
        el.removeEventListener("click", flipCard)
    if (selectColors.length == 2) {
        time = setTimeout(function () { checkCard(el) }, 500)
    } else {
        clearTimeout(time)

    }
}

function checkCard(el) {
    if (selectColors[0] == selectColors[1]) {
        score++
        let elements = [...document.querySelectorAll("div")];
        elements = elements.filter(el => el.className == selectColors[0])
        elements.forEach(element => {
            element.classList.remove("hidden");

            selectColors.forEach(color => {
                if (element.classList.contains(color)) {
                    return element.removeEventListener("click", flipCard)
                }
            })
            element.removeEventListener("click", flipCard)

        })
        scoreBoard.textContent = score;
        if (result == score) {
            const endTime = new Date().getTime()
            const resultTime = (endTime - startTime);
            return setTimeout(() => {
                scoreBoard.style.fontWeight = "bold"

                scoreBoard.textContent = 'Wygrałeś!'
                times.push(millisToMinutesAndSeconds(resultTime))
                localStorage.setItem("times", JSON.stringify(times))
                setTimeout(() => {
                    if (confirm(`Czy chcesz zagrać ponownie? Twój czas to: ${millisToMinutesAndSeconds(resultTime)}`)) {
                        location.reload()
                    }
                }, 1000)
            }, 1000);
        }
    } else {

        let elements = [...document.querySelectorAll("div")];
        elements = elements.filter(el => el.className == selectColors[0])
        elements.forEach(element => element.classList.add("hidden"))
        el.classList.add("hidden")

    }
    selectColors = []
}



function randomColor(field) {
    const index = Math.floor(Math.random() * pairs.length);
    field.className = pairs[index]
    pairs.splice(index, 1)

}