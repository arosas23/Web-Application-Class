/*
    Prime Factorization - Have the user enter a number and find
    all Prime Factors (if there are any) and display them.
*/

var getPrimeFactors = function (n) {
    "use strict";

    function isPrime(n) {
        var i;

        for (i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }

    if (typeof n === "undefined" || n === null) {
        var raw = document.getElementById("num").value;
        n = parseInt(raw, 10);
    }

    var sequence = [];
    var output = document.getElementById("pf");

    if (Number.isNaN(n)) {
        output.textContent = "You must enter a valid number";
        return [];
    }

    if (n <= 1) {
        output.textContent = "There are no prime factors for numbers less than 2";
        return [];
    }

    for (var i = 2; i <= n; i++) {
        while (n % i === 0 && isPrime(i)) {
            sequence.push(i);
            n = n / i;
        }
    }

    if (sequence.length === 0) {
        output.textContent = "There are no prime factors for this number";
    } else {
        output.textContent = "The prime factors for this number are: [ " + sequence.join(", ") + " ]";
    }

    return sequence;
};

// the prime factors for this number are: [ 2, 3, 5, 7, 11, 13 ]
//console.log(getPrimeFactors(30030));