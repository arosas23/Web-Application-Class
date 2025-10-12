/*
Pig Latin
*/

function igpayAtinlay(str) {
  // TODO: Initialize the word array properly
  var returnArray = [],
    wordArray = str.split(" ");
  // TODO: make sure that the output is being properly built to produce the desired result.
  for (var i = 0; i < wordArray.length; i++) {
    var word = wordArray[i];
    var beginning = word.charAt(0);

    if (/[aeiouAEIOU]/.test(beginning)) {
      returnArray.push(word + "way");
      continue;
    }

    for (var ii = 1; ii < word.length; ii++) {
      if (/[aeiouAEIOU]/.test(word.charAt(ii))) {
        var rest = word.slice(ii);
        var start = word.slice(0, ii);
        returnArray.push(rest + start + "ay");
        break;
      }
    }
  }
  return returnArray.join(" ");
}

function translatePigLatin() {
    var inputText = document.getElementById("txtVal").value;
    var output = document.getElementById("pigLatLbl");

    if (inputText.trim() === "") {
        output.textContent = "Please enter a valid word or phrase.";
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(inputText)) {
        output.textContent = "Input must contain only alphabetic characters and spaces.";
        return;
    }

    var result = igpayAtinlay(inputText);
    output.textContent = "Pig Latin Translation: " + result;
}

// Some examples of expected outputs
//console.log(igpayAtinlay("pizza")); // "izzapay"
//console.log(igpayAtinlay("apple")); // "appleway"
//console.log(igpayAtinlay("happy meal")); // "appyhay ealmay"