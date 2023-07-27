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
var divSubmitHighScore = document.querySelector("#divSubmitHighScore");

//question and answer object with arrays 
var questionObj = { //question object that holds all the parts of questions
    questions: [
        "Commonly used data types DO NOT include:",
        "The condition in an if/else statement is enclosed with ______.",
        "Arrays in JavaScript can be used to store _______.",
        "String values must be enclosed within ______ when being assigned to variables.",
        "A very useful tool used during development and debugging, printing content to the debugger is:",
    ],
    answers: [ //answers are in a 2d array because multiple answers for 1 questions
        ["strings", "boolean", "alerts", "numbers"],
        ["quotes", "curly brackets", "parenthesis", "square brackets"],
        ["numbers & strings", "other arrays", "boolean", "all of the above"],
        ["commas", "curly brackets", "quotes", "parenthesis"],
        ["JavaScript", "terminal/bash", "for loops", "console.log"] //to pull out correct: newStr = substring(7,questionObj.answers[index].length)
    ],
    correctanswers: [2, 1, 3, 2, 3]
}

function fnClearUserDetlsScores() {
    document.querySelector("ol").innerHTML = ""; //empties out the highscore list incase user is viewing it currently
    window.localStorage.clear(); //dump all local storage

    fnQuizIntialize(); //go back to main screen because if user clicked this that means they are on highscore board

    return;

}

function fnDisplayHighScores() {
    //elements needed to hide
    btnViewHighScore.style.display = "none";
    btnListedanswer.innerHTML = "";
    lblResultsection.style.display = "none";
    lblTimer.style.display = "none";
    lblTitle.style.display = "none"; //hides title h1 tag
    lblInitContent.style.display = "none";
    btnStartQuiz.style.display = "none"; //hide start button when game starts
    divSubmitHighScore.style.display = "none";
    
    document.querySelector("#divDisplayHigeScore").style.display = "block";
    var olUserHighScore = document.querySelector("ol");
    olUserHighScore.innerHTML = "";
    
    var strStoresUserDetls = JSON.parse(window.localStorage.getItem("localStorageUserDetls")); //parse all local storage highscores
    if (strStoresUserDetls != null) { //only continue if there was data to use and display stuff on highscore board
        for (let index = 0; index < strStoresUserDetls.length; index++) { //loop over every array element found (highscore entry)
            var liUserHighScore = document.createElement("li") //create a new <li> to append to our <ol>
            liUserHighScore.textContent = (index + 1) + "." + strStoresUserDetls[index].names + " - " + strStoresUserDetls[index].scores; //fill up new <li> with content of stored highscores

            var bgColorHighScore = (index % 2) != 0 ? "background-color:#B9B4C7" : "background-color:#D3CEE3";
            liUserHighScore.setAttribute("style", bgColorHighScore);
            olUserHighScore.appendChild(liUserHighScore); //append to parent <ol> (numbered list)
        }

    } else { //if there was no data in local storage to show on highscores show error
        var liUserHighScore = document.createElement("p") //paragraph tag so its not numbered
        liUserHighScore.textContent = "No Highscores" //text content for out paragraph tag
        olUserHighScore.appendChild(liUserHighScore); //append to parent <ol> where highscores would go for ease
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

    blnGameEnded = true; //mark game over before anything to stop background functions from continuing ASAP
    intUserScore = intTimeLeft; //score gets set as the leftover time.

    //hide necessary elements
    lblResultsection.style.display = "none"; //hide timer on end screen since game is over
    lblTitle.style.display = "none"; //hide title h1 (question tag)
    btnListedanswer.innerHTML = ''; //have to clear it out here because a new question doesnt ever get generated

    //show endscreen score and form to enter name for highscore storage
    document.querySelector("#lblFinalScore").textContent = intUserScore + 1; //score gets displayed to the user
    divSubmitHighScore.style.display = "block"; //preassembled div gets displayed which contains a form for name

    return;
}

function fnNextQuestion() {
    //alert(0);
    intCurrQuesIndexNum++; //increment our index by 1 so we can keep track of what question we are on
    if (intCurrQuesIndexNum >= questionObj.questions.length) { //if we run out of questions end the game
        fnQuizEnd(); //ends the game
    } else { //if we got more questions dont stop there keep on goin!!!!!
        fnGenerateQuestions(intCurrQuesIndexNum); //showQuestion handles showing textContent of current Index
    } //this is a curley bracket there are many like it but this one is mine

    return;

}

function fnUserAnswerCheck(event) {
    if (event.target != btnListedanswer) { //if this is just the <ul> dont do anything else we just want the <li> (answers) themselves not parent
        var intUserSelection = event.target.getAttribute("data-index");
        lblResultsection.style.display = 'block'
        if (questionObj.correctanswers[intCurrQuesIndexNum] != intUserSelection) { //check the correct answer
            intTimeLeft -= 10; //if its not the correct answer (wrong) deduct 10 seconds from the timer
            lblDisplayResults.innerHTML = "Wrong!"
        }
        else {
            lblDisplayResults.innerHTML = "Correct!"
        }
        fnNextQuestion(); //go to next question after an answer has been clicked can only choose one answer per question
    }
    return;
}

function fnQuizStart() {
    //Game status set to false
    blnGameEnded = false;
    intCurrQuesIndexNum = 0; //keeps track of the current question number for question object

    //Hide unrequired items    
    btnStartQuiz.style.display = "none"; //hide start button when game starts
    lblInitContent.style.display = "none"; //hide instructions beneath h1 tag (not used in questions)

    lblTimer.style.display = "block"; //display timer at the top now that game started
    

    //functions that create the user experience
    fnGenerateQuestions(intCurrQuesIndexNum); //start generating the questions
    fnStartTimer(); //make sure all formatting gets sorted out before timing the user

    return;
}

function fnGenerateQuestions(intQuestionIndex) {
    lblTitle.textContent = questionObj.questions[intQuestionIndex]; //select h1 tag and set it as the question
    createAnswerElements(intQuestionIndex); //create answers for current question
    return;
}

function createAnswerElements(intCurrentQuestionIndex) {
    btnListedanswer.innerHTML = "";

    for (var intAnsIndex = 0; intAnsIndex < questionObj.answers[intCurrentQuestionIndex].length; intAnsIndex++) { //loop over every answer (for current question) and create a list item on the page based on that content
        var answerListItem = document.createElement("li"); //new list item        
        answerListItem.textContent = (intAnsIndex + 1) + ". " + questionObj.answers[intCurrentQuestionIndex][intAnsIndex];
        answerListItem.setAttribute("Data-index", intAnsIndex); //add index number as data-index
        btnListedanswer.appendChild(answerListItem); //adds this answer list item to the unordered list in html
    }

    return;
}

function fnStartTimer() {
    var timerInterval = setInterval(function () {
        if (blnGameEnded === true) { //test if game ended before anything incase needs to be stopped
            clearInterval(timerInterval); //stop
            return;
        }
        if (intTimeLeft < 1) { //if timer is out under 1 cause wrong answers subtract 10 seconds game ends and timer stops
            clearInterval(timerInterval); //stop
            fnQuizEnd(); //end game out of time scenario
        }

        lblTimer.textContent = "Time :" + intTimeLeft; //update timer tag to latest time
        intTimeLeft--; //decrement timer after all code runs
    }, 1000); //1 second intervals

    return;
}


function fnQuizIntialize() {
    //
    lblTitle.textContent = "Coding Quiz Challenge";
    blnGameEnded = true;
    intTimeLeft = intGlobalIntialTimer; //reset the time back to 75 seconds so reusable to reset game
    lblTimer.textContent = "Time : 0"; //go in and set the default number of the timer so it starts at the actual start number on page load
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


function init() {
    //elements on DOM which are going to need an event listener
    btnStartQuiz.addEventListener("click", fnQuizStart); //button that starts the game
    btnListedanswer.addEventListener("click", fnUserAnswerCheck); //list that contains the answer <li> tags which are used as buttons
    btnViewHighScore.addEventListener("click", fnDisplayHighScores); //shows the highscores
    btnSubmitHighScore.addEventListener("click", fnStoreUserScores); //submits highscores
    btnHighScoreClear.addEventListener("click", fnClearUserDetlsScores); //clears localstorage
    btnGoBack.addEventListener("click", fnQuizIntialize); //returns back to main screen to show start and instructions

    fnQuizIntialize(); //prepare the screen for and display the appropriate items to get ready for quiz

    return;
}

init(); //initialize all my buttons and interactable elements