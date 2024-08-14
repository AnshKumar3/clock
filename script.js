"use strict";

let isClockRunning = false;
let isSessionRunning = true;

// This isn't my own code; I don't remember
// where I got it, though.  I just Googled
// Tomodoro Timers in JS and found this
// function on a site with a good tutorial
const addLeadingZeroes = time => {
  return time < 10 ? `0${time}` : time;
};

const timerElem = $("#time-left");
let timerTextContent = timerElem.text();
const defaultSessionLength = 25;
const defaultBreakLength = 5;
const secondsOffset = 60;
let secondsRemaining = defaultSessionLength * secondsOffset;
let minutes;
let seconds;

const getTimerTextContent = (secondsRemaining) => {
  minutes = parseInt(secondsRemaining / secondsOffset);
  seconds = parseInt(secondsRemaining % secondsOffset);
  timerTextContent = `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
  return timerTextContent;
};
timerTextContent = getTimerTextContent(secondsRemaining);
timerElem.text(timerTextContent);

let timerId;
const initializeClock = () => {
  if (!isClockRunning) {
    timerId = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining < 0) {
        $("#beep").trigger("play");

        if ($("#timer-label").text() !== "Session") {
          isSessionRunning = true;
          $("#timer-label").text("Session");
        } else {
          isSessionRunning = false;
          $("#timer-label").text("Break");
        }

        secondsRemaining = (isSessionRunning ?
          Number($("#session-length").text()) :
          Number($("#break-length").text())
        ) * secondsOffset;
      }

      isClockRunning = true;
      $("#session-increment").prop("disabled", true);
      $("#session-decrement").prop("disabled", true);
      $("#break-increment").prop("disabled", true);
      $("#break-decrement").prop("disabled", true);

      timerTextContent = getTimerTextContent(secondsRemaining);
      timerElem.text(timerTextContent);
      console.log(secondsRemaining);
    }, 1000);
  } else {
    clearInterval(timerId);
    isClockRunning = false;
    $("#session-increment").prop("disabled", false);
    $("#session-decrement").prop("disabled", false);
    $("#break-increment").prop("disabled", false);
    $("#break-decrement").prop("disabled", false);
  }
};

const startStopButton = $("#start_stop");
startStopButton.on("click", initializeClock);

const resetButton = $("#reset");
resetButton.on("click", () => {
  clearInterval(timerId);
  isClockRunning = false;
  $("#session-increment").prop("disabled", false);
  $("#session-decrement").prop("disabled", false);
  $("#break-increment").prop("disabled", false);
  $("#break-decrement").prop("disabled", false);

  $("#beep").trigger("pause");
  $("#beep").prop("currentTime", 0);

  secondsRemaining = defaultSessionLength * secondsOffset;
  timerTextContent = getTimerTextContent(secondsRemaining);
  timerElem.text(timerTextContent);
  $("#session-length").text(defaultSessionLength.toString());
  $("#break-length").text(defaultBreakLength.toString());
  $("#timer-label").text("Session");
});

const updateTimer = (lengthValue, lengthValueElem) => {
  lengthValueElem.text(lengthValue.toString());
  minutes = (($("#timer-label").text() === "Session") ?
    Number($("#session-length").text()) :
    Number($("#break-length").text())
  );
  secondsRemaining = minutes * secondsOffset;
  seconds = secondsRemaining % secondsOffset;
  timerTextContent = `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
  timerElem.text(timerTextContent);
};

const incrementLength = (lengthValue, lengthValueElem) => {
  if (lengthValue < 60) {
    lengthValue++;
    updateTimer(lengthValue, lengthValueElem);
  }
};

const decrementLength = (lengthValue, lengthValueElem) => {
  if (lengthValue > 1) {
    lengthValue--;
    updateTimer(lengthValue, lengthValueElem);
  }
};

const breakIncrementButton = $("#break-increment");
breakIncrementButton.on("click", () => {
  const lengthValueElem = $("#break-length");
  const lengthValue = Number(lengthValueElem.text());
  incrementLength(lengthValue, lengthValueElem);
});

const breakDecrementButton = $("#break-decrement");
breakDecrementButton.on("click", () => {
  const lengthValueElem = $("#break-length");
  const lengthValue = Number(lengthValueElem.text());
  decrementLength(lengthValue, lengthValueElem);
});

const sessionIncrementButton = $("#session-increment");
sessionIncrementButton.on("click", () => {
  const lengthValueElem = $("#session-length");
  const lengthValue = lengthValueElem.text();
  incrementLength(lengthValue, lengthValueElem);
});

const sessionDecrementButton = $("#session-decrement");
sessionDecrementButton.on("click", () => {
  const lengthValueElem = $("#session-length");
  const lengthValue = lengthValueElem.text();
  decrementLength(lengthValue, lengthValueElem);
});