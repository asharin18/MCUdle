

document.addEventListener('DOMContentLoaded', () => {
    makeBoxes();
})

const MarvelWordBank5 = [
    'bucky',
    'shuri',
    'steve',
    'peter',
    'quill',
    'clint',
    'wanda',
    'stark',
    'groot',
    'peggy',
    'scott',
    'bruce',
    'potts',
    'carol',
    'sersi',
    'ammit',
    'druig',
    'layla',
    'happy',
    'kingo',
    'mbaku',
    'billy',
    'tommy',
    'mordo',
    'nakia',
    'okoye',
    'ronan',
    'thena',
    'yondu',
    'janet',
    'hydra',
    'agent',
    'witch',
    'stone',
    'space',
    'widow',
    'venom',
    'power',
    'magic',
    'arrow',
    'serum',
    'cloak',
    'sword',
    'armor',
    'realm',
    'ghost',
    'darcy',
    'gamma',
    'blade',
    'smash',
    'spies',
    'wenwu'
]

const keysTop = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P'
]
const keysMiddle = [
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L'
]
const keysBottom = [
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«'
]

const randomNum = Math.floor(Math.random() * MarvelWordBank5.length);
const randomWordle = MarvelWordBank5[randomNum].toUpperCase();
console.log(randomWordle);



let endGame = false;
let currentRow = 0;
let currentBox = 0;
const keyboardRow1 = document.querySelector('.keyboard-row1');
const keyboardRow2 = document.querySelector('.keyboard-row2');
const keyboardRow3 = document.querySelector('.keyboard-row3');
const words = [[]]; // length of 1


keysTop.forEach(key => {
    const buttonTop = document.createElement('button');
    buttonTop.textContent = key;
    buttonTop.setAttribute('id', key)
    buttonTop.addEventListener('click', () => ifClicked(key));
    keyboardRow1.append(buttonTop);
})

keysMiddle.forEach(key => {
    const buttonMid = document.createElement('button');
    buttonMid.textContent = key;
    buttonMid.setAttribute('id', key)
    buttonMid.addEventListener('click', () => ifClicked(key));
    keyboardRow2.append(buttonMid);
})

keysBottom.forEach(key => {
    const buttonBottom = document.createElement('button');
    buttonBottom.textContent = key;
    buttonBottom.setAttribute('id', key)
    buttonBottom.addEventListener('click', () => ifClicked(key));
    keyboardRow3.append(buttonBottom);
})

function ifClicked(key) {
    //console.log('clicked', key);
    if (!endGame) {
        if (key == 'ENTER') {
            enterKey();
        }
        else if (key == '«') {
            deleteKey();
        }
        else {
            addKey(key);
        }
    }
}

function addKey(key) {
    if (currentBox < 5 && currentRow < 6) {
        const addBoxes = document.querySelectorAll('#square');
        //console.log(addBoxes);
        const array = Array.from(addBoxes);
        const newArr = [];
        while (array.length) newArr.push(array.splice(0, 5));
        //console.log(newArr);
        newArr[currentRow][currentBox].textContent = key;
        const wordArray = words[words.length - 1];
        wordArray.push(key);


        currentBox++;
        //code not ideal but solving issue that came up where words wouldn't go to
        //next line - form 2d array
    }
}

function deleteKey() {
    if (currentBox > 0) {
        const wordArray = words[words.length - 1];
        wordArray.pop();
        const addBoxes = document.querySelectorAll('#square');
        const array = Array.from(addBoxes);
        const newArr = [];
        while (array.length) newArr.push(array.splice(0, 5));
        newArr[currentRow][currentBox - 1].textContent = '';
        currentBox--;
    }
}


function enterKey() {
    if (currentBox === 5) { // enter key counts as fifth

        const wordArray = words[words.length - 1];
        console.log(wordArray);
        const guess = wordArray.join(""); //turns to string
        //console.log(guess);

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'f94af48cf9msh4cdc298f57bfe6cp1325d8jsnd476153c9621',
                'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com'
                //place to hide key??
            }
        };

        fetch(`https://twinword-word-graph-dictionary.p.rapidapi.com/association/?entry=${guess}`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                console.log(response.result_msg);
                if (!MarvelWordBank5.includes(guess.toLowerCase()) && response.result_msg === "Entry word not found") {
                    //make sure word isn't in bank
                    giveAlert('Not a word');

                }
                else {
                    // making tiles colored
                    wordArray.forEach((letter, i) => {
                        const currentLetterClass = currentRow * 5 + 1 + i;
                        const boxToColor = document.getElementsByClassName(currentLetterClass);
                        const color = colorBox(letter, i);
                        boxToColor[0].style.background = color;
                        boxToColor[0].style.borderColor = color;

                    })
                    if (guess === randomWordle) {
                        //winner
                        giveAlert('Congrats!');
                        endGame = true;
                    }
                    else if (currentRow === 5) {
                        // run out of tries and lose
                        giveAlert('Correct word is ' + randomWordle);
                        endGame = true;
                    }
                    else {
                        currentRow++;
                        currentBox = 0;
                        words.push([]); //increases length and room for next word to be guessed

                    }
                }
            })
            .catch(err => console.error(err));

    }
}

function giveAlert(alert) {
    const allAlerts = document.querySelector('.alert-container');
    const alerts = document.createElement('p');
    alerts.textContent = alert;
    allAlerts.append(alerts);
    // need it to go away after a second or so: set timeout for 3 seconds
    setTimeout(() => allAlerts.removeChild(alerts), 3000);
}



function colorBox(letter, i) {
    if (!randomWordle.includes(letter)) {
        //red
        colorKey(letter, 'red');
        return 'red';

    }
    else {
        if (randomWordle.charAt(i) != letter) {
            //yellow
            colorKey(letter, '#d9db44');
            return '#d9db44';
        }
        else {
            //green
            colorKey(letter, 'green');
            return 'green';

        }
    }

}
function colorKey(letter, color) {
    const keyToColor = document.getElementById(letter);
    keyToColor.style.background = color;

}


function makeBoxes() {
    const boxes = document.querySelector('.box-container')
    for (let i = 0; i < 30; i++) {
        let box = document.createElement('div');
        box.classList.add(i + 1);
        box.setAttribute('id', 'square');
        boxes.appendChild(box);
    }
}



