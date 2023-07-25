//my tags
let queistion_count = document.querySelector(".head .queistion-count span");
let Degree = document.querySelector(".tail .Degree");
let time = document.querySelector(".body .time span");
let submet = document.querySelector(".tail .submit");
let question = document.querySelector(".body .question");
let answers = document.querySelectorAll(".body .choice");
let categories = document.querySelector(".categories span");
let tru = 0;
fals = 0;
let stopCounter = false;

//for user information
let timeQuestion = 20;
let kindQueistion = "HTML";
let text = document.createTextNode(kindQueistion);
categories.appendChild(text);

//fetch  json object
function getData() {
  let myRequest = new XMLHttpRequest();

  myRequest.open("Get", "Queistions.json", true);
  myRequest.send();
  //here will add all functions
  myRequest.onreadystatechange = function () {
    if (myRequest.readyState === 4 && myRequest.status == 200) {
      let myData = JSON.parse(myRequest.responseText);
      let countOfData = myData.length;
      console.log(myData);

      //set number of queistion
      queistion_count.innerHTML = countOfData;

      //set bullets
      Bullets(countOfData);

      //set timer
      countDownTimer();

      // set question
      generate_question(myData);
    }
  };
}
getData();

//create bullets
function Bullets(countOfData) {
  let div = document.createElement("div");
  div.classList = "Bullets";
  for (let i = 0; i < countOfData; i++) {
    let span = document.createElement("span");
    div.appendChild(span);
    span.classList = "bullet";
    Degree.appendChild(div);
  }
}

//create count down timer
function countDownTimer() {
  let count = timeQuestion;
  time.innerHTML = count;
  count--;

  let timer = setInterval(
    () => {
      // if user submit answer
      if (stopCounter == true) {
        clearInterval(timer);
        stopCounter = false;
        return 0;
      }

      //if user dont submit answer
      if (count == -1) {
        time.innerHTML = count;
        time.classList.remove("Alarm");
        clearInterval(timer);
        count = timeQuestion;
        countDownTimer();
      } else {
        time.innerHTML = count;
        count--;
      }

      //do make number is red
      if (count < 5) {
        time.classList = "Alarm";
      }
    },
    1000,
    count
  );
}

//create question and answers
function generate_question(myData) {
  let count = 0;
  let bullets = document.querySelectorAll(".tail .Degree .Bullets .bullet");

  //create question
  question.append(myData[count]["title"]);

  //create answers
  for (let i = 0; i < 4; i++) {
    answers[i].append(myData[count][`answer_${i + 1}`]);
    answers[i].addEventListener("click", () => {
      for (let i = 0; i < 4; i++) {
        if (answers[i].classList.contains("clicked")) {
          answers[i].classList.remove("clicked");
        }
      }
      answers[i].classList.add("clicked");
    });
  }

  // to generate next question and answers if user dont submit any answer
  let timer = setInterval(() => {
    if (time.innerHTML == 0) {
      bullets[count].classList.add("false");
      time.classList.remove("Alarm");
      stopCounter = true;
      fals++;
      count = next_question(myData, count);
    }
  }, 1000);

  //to check answer when user enter answer
  submet.addEventListener("click", () => {
    submet.classList.add("clicked");
    let userAnswer = document.querySelector(".body .allChoice .clicked");
    if (userAnswer.textContent == myData[count]["right_answer"]) {
      tru++;
      bullets[count].classList.add("true");
    } else {
      fals++;
      bullets[count].classList.add("false");
    }

    //to generate next question when user submit answer
    stopCounter = true;
    count = next_question(myData, count);
  });
}

//function to generate next question
function next_question(myData, count) {
  //check if questions is finished or not
  if (myData.length - 1 == count) {
    isFinish(myData, count);
  } else {
    time.innerHTML = "";
    countDownTimer();
    question.textContent = "";
    question.append(myData[++count]["title"]);

    for (let i = 0; i < 4; i++) {
      answers[i].textContent = "";
      answers[i].classList.remove("clicked");
      answers[i].append(myData[count][`answer_${i + 1}`]);
    }
    return count;
  }
}

//function to check if questions is finished or not
function isFinish(myData, count) {
  let div = document.createElement("div");
  div.classList.add("pop");
  let text = document.createTextNode(`Your degree is ${tru}/${tru + fals}`);
  div.appendChild(text);
  document.body.append(div);
  submet.classList.add("stop");
  time.remove();
  Close();
  tryAgain();
}

//function to create bottom try Again
function tryAgain() {
  let div = document.createElement("div");
  let text = document.createTextNode("Try Again");
  div.appendChild(text);
  document.body.appendChild(div);
  div.classList.add("try_again");
  div.addEventListener("click", () => {
    location.reload();
  });
}

//function to create bottom Close
function Close() {
  let div = document.createElement("div");
  let text = document.createTextNode("Close");
  div.appendChild(text);
  document.body.appendChild(div);
  div.classList.add("close");
  div.addEventListener("click", () => {
    window.close();
  });
}
