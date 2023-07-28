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
//Function is called when the 'Viewscores' button is clicked.
function fnDisplayHighScores() {
    //elements needed to hide
    btnViewHighScore.style.display = "none";//hide view high score link
    btnListedanswer.innerHTML = "";//empty the answers
    lblResultsection.style.display = "none";//hide user selection result
    lblTimer.style.display = "none";//hide Timer 
    lblTitle.style.display = "none"; //hide Title/Questions
    lblInitContent.style.display = "none";//hide initial content - displayed in the start of quiz
    btnStartQuiz.style.display = "none"; //hide start button when game starts
    divSubmitHighScore.style.display = "none";//hide submit button for user scores

    document.querySelector("#divDisplayHigeScore").style.display = "block";// Display the High Score section
    var olUserHighScore = document.querySelector("ol");
    olUserHighScore.innerHTML = "";

    var strStoresUserDetls = JSON.parse(window.localStorage.getItem("localStorageUserDetls")); //parse all local storage highscores
    if (strStoresUserDetls != null) { //check for null
        for (let index = 0; index < strStoresUserDetls.length; index++) { //loop through all
            var liUserHighScore = document.createElement("li")
            //write the initial & score to <li>
            liUserHighScore.textContent = (index + 1) + ".  " + strStoresUserDetls[index].names + "  -  " + strStoresUserDetls[index].scores;
            //assign different background for alternate rows
            var bgColorHighScore = (index % 2) != 0 ? "background-color:#B9B4C7" : "background-color:#D3CEE3";
            liUserHighScore.setAttribute("style", bgColorHighScore);
            olUserHighScore.appendChild(liUserHighScore);
        }

    } else {//if null then
        var liUserHighScore = document.createElement("p")
        liUserHighScore.textContent = "Currently there are no highscores!"
        olUserHighScore.appendChild(liUserHighScore);
    }

    return;

}

// Function to store User scores in local memory.
//Function is called when User submits their score.
function fnStoreUserScores() {
    var txtbxUserIntials = document.querySelector("input");// gets the user input
    var arrPreviousUserData = [];//array to store user score
    if (txtbxUserIntials.value != "" && txtbxUserIntials.value != null) {//chks for null
        var objUserCurrDetls = {//store user iput into user object
            names: txtbxUserIntials.value.toUpperCase(),
            scores: intUserScore,
        }
        //if the local storage is empty
        if (window.localStorage.getItem("localStorageUserDetls") == null || window.localStorage.getItem("localStorageUserDetls") == "") {
            arrPreviousUserData.push(objUserCurrDetls);//add data into user object
            window.localStorage.setItem("localStorageUserDetls", JSON.stringify(arrPreviousUserData));//convert to json & store it locally.

        } else {//if the local storage is not empty
            arrPreviousUserData = JSON.parse(window.localStorage.getItem("localStorageUserDetls"));
            // add/sort data 
            for (var intIndex = 0; intIndex <= arrPreviousUserData.length; intIndex++) {
                if (intIndex == arrPreviousUserData.length) {//end of current local storage array
                    arrPreviousUserData.push(objUserCurrDetls)//adds new score to the end of current local storage array
                    break;
                } else if (arrPreviousUserData[intIndex].scores < intUserScore) {
                    arrPreviousUserData.splice(intIndex, 0, objUserCurrDetls);//adds new score to current position
                    break;
                }
            }
            //re-store back locally.
            window.localStorage.setItem("localStorageUserDetls", JSON.stringify(arrPreviousUserData))
        }
        document.querySelector("input").value = "";
        btnListedanswer.innerHTML = "";
        intTimeLeft = 0;//reset timer time
        intUserScore = 0;//reset user score
        fnDisplayHighScores();//display all scores.
    }
    return;
}

//Function called when the timer runs out and the quiz ends
function fnQuizEnd() {
    blnGameEnded = true;//end game status
    intUserScore = intTimeLeft;//assign Time left to user score
    //hide necessary elements
    lblResultsection.style.display = "none";
    lblTitle.style.display = "none";
    btnListedanswer.innerHTML = '';
    lblTimer.textContent = "Time :" + intTimeLeft;//display time left
    document.querySelector("#lblFinalScore").textContent = intUserScore;//Display user final score
    divSubmitHighScore.style.display = "block";//Display Score Submission Section
    return;
}

//Function called to generate the next Question
function fnNextQuestion() {
    intCurrQuesIndexNum++;//increment the current question number.
    if (intCurrQuesIndexNum >= questionObj.questions.length) {//if current question number >= end of questions array length.
        fnQuizEnd();//End Quiz
    } else {
        fnGenerateQuestions(intCurrQuesIndexNum);//Generate the next question
    }
    return;
}

//Funtion is called when user selects one of the answers option.
function fnUserAnswerCheck(event) {
    if (event.target != btnListedanswer) {
        var intUserSelection = event.target.getAttribute("data-index");//get the index data of the answer option
        lblResultsection.style.display = 'block'
        if (questionObj.correctanswers[intCurrQuesIndexNum] != intUserSelection) {//selected option if not equal index of the answers array
            intTimeLeft -= 10;//decrement the time
            lblDisplayResults.innerHTML = "Wrong!"
        }
        else {
            lblDisplayResults.innerHTML = "Correct!"
        }

        fnNextQuestion();// generate next question
    }
    return;
}

//Function is called when user click 'Start Quiz' button
function fnQuizStart() {
    blnGameEnded = false;//game status 
    intCurrQuesIndexNum = 0;//current question number
    btnStartQuiz.style.display = "none";// Hide start button
    lblInitContent.style.display = "none";// Hide initial content
    lblTimer.style.display = "block";//Display timer 
    fnGenerateQuestions(intCurrQuesIndexNum);//generate first question
    fnStartTimer();//Start timer
    return;
}

//Function called to generate the Question
function fnGenerateQuestions(intQuestionIndex) {
    lblTitle.textContent = questionObj.questions[intQuestionIndex];//Display the question
    createAnswerElements(intQuestionIndex);//create the relevant answers options.
    return;
}

//Function called to generate the relevant answers options for a specific question
function createAnswerElements(intCurrentQuestionIndex) {
    btnListedanswer.innerHTML = "";//clear answer options if any
    for (var intAnsIndex = 0; intAnsIndex < questionObj.answers[intCurrentQuestionIndex].length; intAnsIndex++) {
        //create the <li> element with the options
        var answerListItem = document.createElement("li");
        answerListItem.textContent = (intAnsIndex + 1) + ". " + questionObj.answers[intCurrentQuestionIndex][intAnsIndex];
        answerListItem.setAttribute("Data-index", intAnsIndex);
        btnListedanswer.appendChild(answerListItem);
    }
    return;
}

//Function called to Start timer
function fnStartTimer() {
    var timerInterval = setInterval(function () {
        if (blnGameEnded === true) {//game ended.
            clearInterval(timerInterval);
            return;
        }
        if (intTimeLeft < 1) {//time runs out
            clearInterval(timerInterval);
            fnQuizEnd();
        }
        intTimeLeft--;//decrement the time
        lblTimer.textContent = "Time :" + intTimeLeft;//display time left        
    }, 1000);
    return;
}


function fnQuizIntialize() {    
    lblTitle.textContent = "Coding Quiz Challenge";// Initial Title
    blnGameEnded = true;//resets gmae status
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