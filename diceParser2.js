const submitButton = document.getElementById("submitButton");
const inputField = document.getElementById("input");
const outputText = document.getElementById("output");
const operators = ['^','!','*','X','/','+','-','#', "(", ")"];
const forbiddenChars = ['A','B','C','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

// testing area

// 1d4 1d4
// -> 1d4 & (1d4 ... ) & ( ... )
// 2 & 4 & ...
// 2,4,...,...

// 1d4 + 4 1d4
// 1d4 + 4 & 1d4
// 3 + 4 & 2
// 7 & 2
// 7,2
// Ambiguous Syntax

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function factorialize(num) {
    if (num === 0 || num === 1)
      return 1;
    for (var i = num - 1; i >= 1; i--) {
      num *= i;
    }
    return num;
  }

function countOccurrances(array,obj){
    let toReturn = 0;
    for(let i = 0; i< array.length; i++){
        if(array[i] === obj){
            toReturn++;
        }
    }
    return toReturn;
}

function rollDice(){
    let parsedArray = filterParsedArray(parseDiceString(inputField.value));
    console.log(parsedArray);
    //let readable = parsedArray.join(' ');
    for(let i = 0; i < parsedArray.length; i++){
        if(!operators.includes(parsedArray[i])){
            parsedArray[i] = handleDiceNotation(parsedArray[i]);
        }
    }
    //let readable = parsedArray;
    console.log("Array Before Parentheses: " + parsedArray.join(''));
    // at this point, we could return this to show the user what we rolled for the calculations
    //parsedArray = filterBadOperators(parsedArray);
    //console.log(parsedArray);
    parsedArray = handleParentheses(parsedArray);
    console.log(parsedArray);

    if(Array.isArray(parsedArray[0])){
        let sum = 0;
        for(let k = 0; k < parsedArray[0].length; k++){
            sum += parsedArray[0][k];
        }
        parsedArray[0] = sum;
    }
    //console.log(Math.floor(parsedArray[0]));
    outputText.innerText = Math.floor(parsedArray[0]);
}

// parse string into array of dice notation pieces
function parseDiceString(str){
    // format string
    for(let i = 0; i < str.length; i++){
        if(isNumeric(str[i - 1]) && str[i] == ' ' && isNumeric(str[i+1])){
            str = str.substring(0,i) + "#" + str.substring(i+1,str.length);
        }
    }
    str = str.replace(/\s/g, '');
    str = str.toUpperCase();
    
    //parse the formatted string into pieces
    let toReturn = [];
    let indexOfLastOperator = 0;
    for(let i = 0; i < str.length; i++){
        // if the character we're checking belongs to our operators array
        if(operators.includes(str[i]) || str[i] == "(" || str[i] == ")"){
            //add the pieces in between operators (dice to be read) into the array
            toReturn.push(str.substring(indexOfLastOperator,i))
            // add the operator into the array
            toReturn.push(str[i]);
            indexOfLastOperator = i+1;
        }
    }
    toReturn.push(str.substring(indexOfLastOperator,str.length))
    return toReturn;
}

// filter array into readable parts
function filterParsedArray(array){
    // maps elements of our array, getting rid of ones with forbidden characters. 
    return array.map((element) => {
        for(let i = 0; i < forbiddenChars.length; i++){
            if(element.includes(forbiddenChars[i])){
                // if we find a forbidden character, return 0
                return "";
            }
        }
        // otherwise, return element
        return element;
    });
}

// handle dice notation 
function handleDiceNotation(str){
    // create a tuple based on the presence of a "D"
    let split = str.split('D');
    let toReturn = [];
    if(split.length == 1){
        // if there isn't a d, just return the number
        return parseInt(split[0]);
    } else {
        if (split[0] == ""){
            // implicit 1 for d20
            split[0] = 1;
        }
        if(split[1] == ""){
            // rolling a 0 sided dice should return 0
            return 0;
        }
        for (let i = 0; i < split[0]; i++){
            // if it is dice notation, create a tuple to be parsed later
            toReturn.push(randomIntFromInterval(1, split[1]));
        }
        return toReturn;
    }
}

// adds '1' before the start of parentheses

function filterBadOperators(array){
    let lengthToCheck = array.length;
    for(let i = 0; i < lengthToCheck; i++){
        if(isNaN(array[i] && !operators.includes(array[i]))){
            array.splice(i,1);
        }
    }
    //console.log(array);
    return array;
}
// arithmetic
function handleParentheses(array){
    let toReturn = array;
    if(countOccurrances(array,"(") != countOccurrances(array,")")){
        console.log("you need an equal number of parentheses!")
        return;
    }
    while(toReturn.includes("(") || toReturn.includes(")")){
        // rightmost left parentheses
        let leftIndex = toReturn.lastIndexOf("(");
        console.log(leftIndex);
        let rightIndex = -1;
        for(let i = 0; i < array.length; i++){
            if(array[leftIndex+i] == ")"){
                rightIndex = leftIndex+i;
                console.log(rightIndex);
                break;
            }
        } if(rightIndex == -1){
            console.log("Put your parentheses in order!")
            return;
        }
        let toSend = toReturn.slice(leftIndex+1,rightIndex);
        //toSend = filterBadOperators(toSend);
        //console.log(toSend);
        let result = handleParentheses(toSend);
        console.log(result);
        toReturn.splice(leftIndex - 1, rightIndex - leftIndex + 3, result[0]);
        // deletes from the space before the left parentheses to the space after the right
        //array = array.splice(leftIndex - 1,rightIndex - leftIndex + 3, result)
        console.log(toReturn);
    }
    return evaluateExpression(toReturn);
}

function evaluateExpression(array){
    let toReturn;
    operatorCount = [0,0,0,0,0,0,0,0,0,0];
    for(let i = 0; i < operators.length; i++){
        for(let j = 0; j < array.length; j++){
            if(array[j] == operators[i]){
                operatorCount[i]++;
                console.log(operatorCount);
            }
        }
    }
    for(let k = 0; k < operators.length; k++){
        toReturn = operatorPass(array, operators[k], operatorCount[k]);
    }
    //if(Array.isArray(array[i])){
    //    let sum = 0;
    //    for(let k = 0; k < array[i].length; k++){
    //        sum += array[i][k];
    //    }
    //    array[i] = sum;
    //}
    return toReturn;
}

function operatorPass(array, operator, operatorCount){
    for(let j = 0; j < operatorCount; j++){
        for(let i = 0; i < array.length; i++){
            if(array[i] == operator){
                if(operator == "!"){
                    array[i] = factorialize(array[i - 1]);
                    array.splice(i-1,1);
                    array.splice(i,1);
                } else {
                    array[i] = handleOperator(array[i - 1],array[i+1],operator);
                    array.splice(i-1,1);
                    array.splice(i,1);
                }
            }
        }
        console.log(array);
    }
    return array;
}

function handleOperator(left, right, operator){
    if(isNaN(left) && !Array.isArray(left)){
        console.log("Left was NaN");
        left = getIdentity(operator);
    }
    if(isNaN(right) && !Array.isArray(right)){
        console.log("Right was NaN");
        right = getIdentity(operator);
    }
    if(Array.isArray(left)){
        let leftSum = 0;
        for(let i = 0; i < left.length; i++){
            leftSum += left[i];
        }
        left = leftSum;
    }
    if(Array.isArray(right)){
        let rightSum = 0;
        for(let i = 0; i < right.length; i++){
            rightSum += right[i];
        }
        right = rightSum;
    }
    switch(operator){
        case "^":
            return Math.pow(left, right);
        case "!":
            return factorialize(left) * right;
        case "X":
            return left * right;
        case "*":
            return left * right;
        case "/":
            return left / right;
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "#":
            return "Unimplemented";
    }
}

function getIdentity(operator){
    switch(operator){
        case "^":
            return 1;
        case "!":
            return 1;
        case "X":
            return 1;
        case "*":
            return 1;
        case "/":
            return 0;
        case "+":
            return 0;
        case "-":
            return 0;
        case "#":
            return "Unimplemented";
    }
}