//- Creation Date: 07/22/2023
//- Created by Sajith Aravindan

//Global Variables
var intGlobalIntialTimer = 75; // game time preset
var intCurrQuesIndexNum = 0; //Current question number for question object
var intTimeLeft = intGlobalIntialTimer; //Time left variable
var intUserScore = 0; //score calculated 
var blnGameEnded = true; //Game Status.
var lblTitle = document.querySelector("#lblTitle") //H1 tag for questions and titles.
var lblInitContent = document.querySelector("#lblInitContent"); //Initial Content.
var lblTimer = document.querySelector("#lblTimer"); //span containing timer numbers
var btnStartQuiz = document.querySelector("#btnStartQuiz"); //Quiz start button.
var btnViewHighScore = document.querySelector("#btnViewHighScore"); //view highscore button.
var btnGoBack = document.querySelector("#btnGoBack"); //go back button from the highscore view
var btnSubmitHighScore = document.querySelector("#btnSubmitHighScore"); //Submit button for storing score
var btnHighScoreClear = document.querySelector("#btnHighScoreClear"); //button tot clear all local storage of high scores
var btnListedanswer = document.querySelector("#lstDisplayAnswers"); //list that will hold the dynamic answer list items
var lblResultsection = document.querySelector("#divResult"); //Div to display user selection result
var lblDisplayResults = document.querySelector("#hdrResults");//User selection result
var divSubmitHighScore = document.querySelector("#divSubmitHighScore");//Div to submit user score

//question and answer object with arrays 
var questionObj = { //question object that holds all the parts of questions
    questions: [
        "Commonly used data types DO NOT include:",
        "The condition in an if/else statement is enclosed with ______.",
        "Arrays in JavaScript can be used to store _______.",
        "String values must be enclosed within ______ when being assigned to variables.",
        "A very useful tool used during development and debugging, printing content to the debugger is:",
    ],
    answers: [ //answers are in a 2d array
        ["strings", "boolean", "alerts", "numbers"],
        ["quotes", "curly brackets", "parenthesis", "square brackets"],
        ["numbers & strings", "other arrays", "boolean", "all of the above"],
        ["commas", "curly brackets", "quotes", "parenthesis"],
        ["JavaScript", "terminal/bash", "for loops", "console.log"]
    ],
    correctanswers: [2, 1, 3, 2, 3] // Correct answers index in the anwers object
}

// function to Clear User scores stored in local memory.
function fnClearUserDetlsScores() {
    document.querySelector("ol").innerHTML = ""; //clears out the highscore <li> list
    window.localStorage.clear(); //purges all local storage
    fnQuizIntialize(); //funtion to restart - main screen
    return;
}

// function to Display User scores stored in local memory.
function fnDisplayHighScores() {
    //elements needed to hide
    btnViewHighScore.style.display = "none";
    btnListedanswer.innerHTML = "";
    lblResultsection.style.display = "none";
    lblTimer.style.display = "none";
    lblTitle.style.display = "none"; 
    lblInitContent.style.display = "none";
    btnStartQuiz.style.display = "none"; //hide start button when game starts
    divSubmitHighScore.style.display = "none";
    
    document.querySelector("#divDisplayHigeScore").style.display = "block";
    var olUserHighScore = document.querySelector("ol");
    olUserHighScore.innerHTML = "";
    
    var strStoresUserDetls = JSON.parse(window.localStorage.getItem("localStorageUserDetls")); //parse all local storage highscores
    if (strStoresUserDetls != null) { 
        for (let index = 0; index < strStoresUserDetls.length; index++) { 
            var liUserHighScore = document.createElement("li") 
            liUserHighScore.textContent = (index + 1) + "." + strStoresUserDetls[index].names + " - " + strStoresUserDetls[index].scores; 

            var bgColorHighScore = (index % 2) != 0 ? "background-color:#B9B4C7" : "background-color:#D3CEE3";
            liUserHighScore.setAttribute("style", bgColorHighScore);
            olUserHighScore.appendChild(liUserHighScore); 
        }

    } else { 
        var liUserHighScore = document.createElement("p")
        liUserHighScore.textContent = "No Highscores" 
        olUserHighScore.appendChild(liUserHighScore); 
    }

    return;

}

function fnStoreUserScores() {
    var txtbxUserIntials = document.querySelector("input");
    var arrPreviousUserData = [];
    if (txtbxUserIntials.value != "" && txtbxUserIntials.value != null) {
        var objUserCurrDetls = {
            names: txtbxUserIntials.value.toUpperCase(),
            scores: intUserScore,
        }

        if (window.localStorage.getItem("localStorageUserDetls") == null || window.localStorage.getItem("localStorageUserDetls") == "") {
            arrPreviousUserData.push(objUserCurrDetls);
            window.localStorage.setItem("localStorageUserDetls", JSON.stringify(arrPreviousUserData));

        } else {
            arrPreviousUserData = JSON.parse(window.localStorage.getItem("localStorageUserDetls"));

            for (var intIndex = 0; intIndex <= arrPreviousUserData.length; intIndex++) {
                if (intIndex == arrPreviousUserData.length) {
                    arrPreviousUserData.push(objUserCurrDetls)
                    break;
                } else if (arrPreviousUserData[intIndex].scores < intUserScore) {
                    arrPreviousUserData.splice(intIndex, 0, objUserCurrDetls);
                    break;
                }
            }
            window.localStorage.setItem("localStorageUserDetls", JSON.stringify(arrPreviousUserData))
        }
        document.querySelector("input").value = "";
        btnListedanswer.innerHTML = "";
        intTimeLeft = 0;
        intUserScore = 0;
        fnDisplayHighScores();
    }
    return;
}

function fnQuizEnd() {

    blnGameEnded = true;
    intUserScore = intTimeLeft; 

    //hide necessary elements
    lblResultsection.style.display = "none"; 
    lblTitle.style.display = "none"; 
    btnListedanswer.innerHTML = ''; 

    
    document.querySelector("#lblFinalScore").textContent = intUserScore + 1;
    divSubmitHighScore.style.display = "block";

    return;
}

function fnNextQuestion() {
    
    intCurrQuesIndexNum++; 
    if (intCurrQuesIndexNum >= questionObj.questions.length) { 
        fnQuizEnd(); 
    } else { 
        fnGenerateQuestions(intCurrQuesIndexNum); 
    } 

    return;

}

function fnUserAnswerCheck(event) {
    if (event.target != btnListedanswer) { 
        var intUserSelection = event.target.getAttribute("data-index");
        lblResultsection.style.display = 'block'
        if (questionObj.correctanswers[intCurrQuesIndexNum] != intUserSelection) { 
            intTimeLeft -= 10; 
            lblDisplayResults.innerHTML = "Wrong!"
        }
        else {
            lblDisplayResults.innerHTML = "Correct!"
        }
        fnNextQuestion(); 
    }
    return;
}

function fnQuizStart() {
   
    blnGameEnded = false;
    intCurrQuesIndexNum = 0; 
    
    btnStartQuiz.style.display = "none"; 
    lblInitContent.style.display = "none"; 

    lblTimer.style.display = "block"; 
    

    
    fnGenerateQuestions(intCurrQuesIndexNum); 
    fnStartTimer(); 

    return;
}

function fnGenerateQuestions(intQuestionIndex) {
    lblTitle.textContent = questionObj.questions[intQuestionIndex]; 
    createAnswerElements(intQuestionIndex); 
    return;
}

function createAnswerElements(intCurrentQuestionIndex) {
    btnListedanswer.innerHTML = "";

    for (var intAnsIndex = 0; intAnsIndex < questionObj.answers[intCurrentQuestionIndex].length; intAnsIndex++) { 
        var answerListItem = document.createElement("li");         
        answerListItem.textContent = (intAnsIndex + 1) + ". " + questionObj.answers[intCurrentQuestionIndex][intAnsIndex];
        answerListItem.setAttribute("Data-index", intAnsIndex); 
        btnListedanswer.appendChild(answerListItem); 
    }

    return;
}

function fnStartTimer() {
    var timerInterval = setInterval(function () {
        if (blnGameEnded === true) { 
            clearInterval(timerInterval); 
            return;
        }
        if (intTimeLeft < 1) { 
            clearInterval(timerInterval); 
            fnQuizEnd(); 
        }

        lblTimer.textContent = "Time :" + intTimeLeft; 
        intTimeLeft--; 
    }, 1000); 

    return;
}


function fnQuizIntialize() {
    //
    lblTitle.textContent = "Coding Quiz Challenge";
    blnGameEnded = true;
    intTimeLeft = intGlobalIntialTimer; //reset the time back to 75 seconds
    lblTimer.textContent = "Time : 0"; //set the default number of the timer
    // Hide unwanted items
    divResult.style.display = "none";
    divSubmitHighScore.style.display = "none";
    divDisplayHigeScore.style.display = "none";

    //display items that are needed for the "main menu"
    lblTitle.style.display = "block";
    
    lblTimer.style.display = "block";
    lblInitContent.style.display = "block";
    btnViewHighScore.style.display = "block";
    btnStartQuiz.style.display = "block";

    return;
}

//Function to initialize all required elements
function init() {
    //all buttons that need an event listener
    btnStartQuiz.addEventListener("click", fnQuizStart); //button that starts the game
    btnListedanswer.addEventListener("click", fnUserAnswerCheck); //answer <li> tags which are used as buttons
    btnViewHighScore.addEventListener("click", fnDisplayHighScores); //button tht shows the highscores
    btnSubmitHighScore.addEventListener("click", fnStoreUserScores); //button that submits highscores
    btnHighScoreClear.addEventListener("click", fnClearUserDetlsScores); //button that clears localstorage
    btnGoBack.addEventListener("click", fnQuizIntialize); //button back to main screen - restart

    fnQuizIntialize(); //prepare the application to get ready for quiz

    return;
}

init(); //initialize all elements