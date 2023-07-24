//- Creation Date: 07/22/2023
//- Created by Sajith Aravindan

//Global Variables
var intGlobalIntialTimer = 75; // game time preset
var intCurrQuesIndexNum = 0; //Current question number for question object
var intTimeLeft = intGlobalIntialTimer; //Time left variable
var intScore = 0; //score calculated
var blnGameEnded = true; //Game Status.
var lblTitle = document.querySelector(`#lblTitle`) //H1 tag for questions and titles.
var btnStartQuiz = document.querySelector(`#btnStartQuiz`); //Quiz start button.
var lblTimer = document.querySelector(`#lblTimer`); //span containing timer numbers
var btnViewHighScore = document.querySelector(`#btnViewHighScore`); //view highscore button.
var btnGoBack = document.querySelector(`#btnGoBack`); //go back button from the highscore view
//var timerPTag  = document.querySelector(`header`).children[1]; //paragraph tag at the top of the screen in the nav area that displays time
var btnSubmitHighScore = document.querySelector(`#btnSubmitHighScore`); //Submit button for storing score
var btnHighScoreClear = document.querySelector(`#btnHighScoreClear`); //button tot clear all local storage of high scores
var ulbtnListanswer = document.body.querySelector(`ul`); //list that will hold the dynamic answer list items


//question and answer object with arrays
var questionObj = { //question object that holds all the parts of questions
    questions: [ 
        `Commonly used data types DO NOT include:`,
        `The condition in an if/else statement is enclosed with ______.`,
        `Arrays in JavaScript can be used to store _______.`,
        `String values must be enclosed within ______ when being assigned to variables.`,
        `A very useful tool used during development and debugging, printing content to the debugger is:`,
    ],
    answers: [ //answers are in a 2d array because multiple answers for 1 questions
        [`strings`, `boolean`, `alerts`, `numbers`],
        [`quotes`, `curly brackets`, `parenthesis`, `square brackets`],
        [`numbers & strings`, `other arrays`, `boolean`, 'all of the above'], 
        [`commas`, `curly brackets`, `quotes`, `parenthesis`],
        [`JavaScript`, `terminal/bash`, `for loops`, `console.log`] //to pull out correct: newStr = substring(7,questionObj.answers[index].length)
    ],
    correctanswers: [
        [2, 1, 3, 2, 3]
    ] 
}

function fnClearUserDetlsScores(){


}

function fnStoreUserIntialsScores(){


}

function fnDisplayHighScores(){


}

function fnUserAnswerCheck(){
//

}


function fnQuizStart(){
//
lblTitle.textContent="Coding Quiz Challenge";

}


function init() {
    //elements on DOM which are going to need an event listener
    btnStartQuiz.addEventListener(`click`, fnQuizStart); //button that starts the game
    answerButtonLst.addEventListener(`click`, fnUserAnswerCheck); //list that contains the answer <li> tags which are used as buttons
    btnViewHighScore.addEventListener(`click`, fnDisplayHighScores); //shows the highscores
    btnSubmitHighScore.addEventListener(`click`, fnStoreUserIntialsScores); //submits highscores
    btnHighScoreClear.addEventListener(`click`, fnClearUserDetlsScores); //clears localstorage
    btnGoBack.addEventListener(`click`, fnQuizStart); //returns back to main screen to show start and instructions

    fnQuizStart(); //prepare the screen for and display the appropriate items to get ready for quiz

    return;
}

init(); //initialize all my buttons and interactable elements