/*
    Fibonacci Sequence - Enter a number and have the program
    generate the Fibonacci sequence to that number or to the Nth number.
*/

// This array will keep memory of the previous fibonacci numbers
var memo = {};

function fibonacci() {
  "use strict";
  var input = document.getElementById("num").value;
  var n = Number(input);
  var label = document.getElementById("fibonacciLbl");

  if (input.trim() === "") {
    label.textContent = "Please enter a number";
    return;
  }

  if (!Number.isFinite(n) || Number.isNaN(n)) {
    label.textContent = "Please enter a valid number";
    return;
  }

  if(!Number.isInteger(n) || n < 1) {
    label.textContent = "Please enter a positive integer";
    return;
  }

  var val = f(n);
  label.textContent = "Fibonacci of " + n + " is " + val;
  return val;
}

function f(n) {
  // Check if the memory array already contains the requested number
  var value;
  
  if (memo.hasOwnProperty(n)) {
    value = memo[n];
  } 

  if (n === 1 || n === 2) {
    value = 1;
  } else {
    value = f(n - 1) + f(n - 2);
  }

  memo[n] = value;
  return value;
}

document.addEventListener("DOMContentLoaded", function() {
    var botton = document.getElementById("btn");
    if (botton) {
        botton.addEventListener("click", fibonacci);
    }
});
