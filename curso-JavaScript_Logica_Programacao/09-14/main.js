const gameElement = document.querySelector('#game');

const maxLife = 5;
const initialChances = 3;
const initialMaxGuessNumber = 10;

var lives = maxLife;
var points = 0;
var maxGuessNumber = initialMaxGuessNumber;
var randomChoice;

var maxChances = initialChances;
var currentChances = maxChances;

var usedNumbers = [];


function appendToGame(element) {
    gameElement.append(element);
}

function appendTagToGame(tag, content) {
    appendToGame(createTag(tag, content));
}


function createTag(tag, content = "") {
    var element = document.createElement(tag);
    element.innerHTML = content;
    return element;
}

function createTagText(tag, content = "") {
    return `<${tag}>${content}</${tag}>`;
}


function getRandomNumber(max) {
    return Math.round(Math.random() * max);
}

function randomizeChoiceNumber() {
    randomChoice = getRandomNumber(maxGuessNumber);
}


function resetGame() {
    currentChances = maxChances;
    usedNumbers = [];
    if (lives === 0) {
        lives = maxLife;
        points = 0;
        currentChances = initialChances;
    }
    randomizeChoiceNumber();
    writeGameInterface();
}


function userGuessedWrong(guess) {
    currentChances--;

    // Game over
    if (currentChances === 0) {
        clearGameInterface();
        appendTagToGame("strong", "Oops. Parece que você não acertou meu número. Você perdeu uma vida :(");
        appendTagToGame("p", "O número que eu escolhi era: " + randomChoice);
        appendToGame(tryAgainButton);
        lives--;

        if (lives > 0) {
            tryAgainButton.innerText = "Tentar novamente?";
        } else {
            tryAgainButton.innerText = "Você perdeu todas as vidas. Recomeçar o jogo?";
        }
        return;
    }

    alert("Não. O número escolhido é " + (guess < randomChoice ? "MAIOR" : "MENOR") + " que " + guess + ".");
    writeGameInterface();
}

function userGuessedRight(guess) {
    var gainedPoints = getRandomNumber(51);
    points += gainedPoints;

    var gainedChances = getRandomNumber(2) + 1;
    maxChances += gainedChances;

    maxGuessNumber += getRandomNumber(5) + 5;

    alert(
        "Parabéns! Você acertou o número que eu escolhi: " +guess + "\n\n" +
        "Você ganhou " + gainedPoints + " pontos, além de ter mais " + gainedChances + " chance(s)!" + "\n\n" +
        "O intervalo aumentou para " + maxGuessNumber
    );

    resetGame();
}

function guess() {
    var inputElement = document.querySelector("input");
    var inputStringValue = inputElement.value;
    var value = parseInt(inputStringValue);

    if (isNaN(value)) {
        alert("Por favor, digite apenas um número. Isto não é aceitável aqui: " + inputStringValue);
    } else if (value < 0 || value > maxGuessNumber) {
        alert("Por favor, digite um número entre o intervalo providenciado na página. " + value + " não é um número aceitável aqui.")
    } else if (usedNumbers.includes(value)) {
        alert("Por favor, use um número diferente. Este número já foi utilizado: " + value);
    } else {
        usedNumbers.push(value);
        if (value == randomChoice) userGuessedRight(value);
        else userGuessedWrong(value);
    }
}


const guessButton = createTag("button", "Guess");
guessButton.onclick = guess;

const tryAgainButton = createTag("button", "Tentar novamente?");
tryAgainButton.onclick = resetGame;


function clearGameInterface() {
    gameElement.innerHTML = "";
}

function writeGameInterface() {
    clearGameInterface();

    function writeCategory(name, value) {
        appendTagToGame(
            "p",
            createTagText("strong", name) + ": " + value
        );
    }

    writeCategory("Vidas", lives + " de " + maxLife);
    writeCategory("Pontos", points);
    appendTagToGame("hr");

    writeCategory("Chances", currentChances + " de " + maxChances);
    writeCategory("O número escolhido está entre", "0 e " + maxGuessNumber)

    appendTagToGame("input");
    appendToGame(guessButton);

    writeCategory("Você chutou os números", usedNumbers.join(', ') || "Nenhum até o momento.");

    document.querySelector("input").focus();
}


window.onload = function () {
    randomizeChoiceNumber();
    writeGameInterface();
}
