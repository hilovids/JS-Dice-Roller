const submitButton = document.getElementById("submitButton");
const inputField = document.getElementById("input");
const outputText = document.getElementById("output");
const forbiddenChars = ['A','B','C','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function rollDice(){
    // format the inputs
    let value = inputField.value;
    value = value.replace(/\s/g, '');
    value = value.toUpperCase();
    // builds array of parsed parts
    let parsedValueArray = [];
    let lengthToCheck = value.length;
    let diceToBuild = "";
    while(lengthToCheck > -1){
        // handles the operators
        if(value[0] == "+" || value[0] == "-" || value[0] == "X" || value[0] == "/" ||value[0] == undefined){
            if(value[0] == undefined){
                parsedValueArray.push(diceToBuild);
                //console.log("end of string");
                break;
            } else {
                //console.log("added dice");
                parsedValueArray.push(diceToBuild);
                diceToBuild = "";
                //console.log("added operator");
                parsedValueArray.push(value[0]);
                value = value.substring(1,value.length);
                lengthToCheck--;
            }
        } else {
            diceToBuild += value[0];
            value = value.substring(1,value.length);
            lengthToCheck--;
        }
    }
    // filter the parsed value list
    //console.log(parsedValueArray);
    //condense and perform operations
    let toCondense = parsedValueArray;
    while(toCondense.includes("X")){
    for(let i = 0; i < toCondense.length; i++){
        if(toCondense[i] == "X"){
            if(toCondense[i - 1] == "" || isOperator(toCondense[i - 1])){
                toCondense.shift();
                toCondense.shift();
                console.log(toCondense);
                break;
            } else if(toCondense[i + 1] == "" || isOperator(toCondense[i + 1])){
                toCondense.splice(i, 2);
                //toCondense.pop();
                console.log(toCondense);
                break;
            } else {
                //parsedValueArray[i] = determineDecision("X", "1", "3");
                console.log(toCondense);
                toCondense[i] = determineDecision("X", toCondense[i - 1], toCondense[i + 1]);
                console.log(toCondense);
                toCondense.splice(i-1,1);
                console.log(toCondense);
                toCondense.splice(i,1);
                console.log(toCondense);
                break;
            }
        }
    } 
}
while(toCondense.includes("/")){
    for(let i = 0; i < toCondense.length; i++){
        if(toCondense[i] == "/"){
            if(toCondense[i - 1] == "" || isOperator(toCondense[i - 1])){
                toCondense.shift();
                toCondense.shift();
                console.log(toCondense);
                break;
            } else if(toCondense[i + 1] == "" || isOperator(toCondense[i + 1])){
                toCondense.splice(i, 2);
                //toCondense.pop();
                console.log(toCondense);
                break;
            } else {
                //parsedValueArray[i] = determineDecision("X", "1", "3");
                console.log(toCondense);
                toCondense[i] = determineDecision("/", toCondense[i - 1], toCondense[i + 1]);
                console.log(toCondense);
                toCondense.splice(i-1,1);
                console.log(toCondense);
                toCondense.splice(i,1);
                console.log(toCondense);
                break;
            }
        }
    } 
}
while(toCondense.includes("+") || toCondense.includes("-")){
    for(let i = 0; i < toCondense.length; i++){
        if(toCondense[i] == "+"){
            if(toCondense[i - 1] == "" || isOperator(toCondense[i - 1])){
                toCondense.shift();
                toCondense.shift();
                console.log(toCondense);
                break;
            } else if(toCondense[i + 1] == "" || isOperator(toCondense[i + 1])){
                toCondense.splice(i, 2);
                //toCondense.pop();
                console.log(toCondense);
                break;
            } else {
                //parsedValueArray[i] = determineDecision("X", "1", "3");
                console.log(toCondense);
                toCondense[i] = determineDecision("+", toCondense[i - 1], toCondense[i + 1]);
                console.log(toCondense);
                toCondense.splice(i-1,1);
                console.log(toCondense);
                toCondense.splice(i,1);
                console.log(toCondense);
                break;
            }
        } 
        else if(toCondense[i] == "-"){
            if(toCondense[i - 1] == "" || isOperator(toCondense[i - 1])){
                toCondense.shift();
                toCondense.shift();
                console.log(toCondense);
                break;
            } else if(toCondense[i + 1] == "" || isOperator(toCondense[i + 1])){
                toCondense.splice(i, 2);
                //toCondense.pop();
                console.log(toCondense);
                break;
            } else {
                //parsedValueArray[i] = determineDecision("X", "1", "3");
                console.log(toCondense);
                toCondense[i] = determineDecision("-", toCondense[i - 1], toCondense[i + 1]);
                console.log(toCondense);
                toCondense.splice(i-1,1);
                console.log(toCondense);
                toCondense.splice(i,1);
                console.log(toCondense);
                break;
            }
        }
    }
    if(toCondense.length == 1){
        break;
    }
} 
    if(!isNumeric(Math.abs(parsedValueArray[0]))){
        console.log(resolveDiceNotation(parsedValueArray[0].split('D')));
        outputText.innerText = resolveDiceNotation(parsedValueArray[0].split('D'));
    } else {
        outputText.innerText = parsedValueArray[0];
    }
}

function resolveDiceNotation(tuple){
    let runningSum = 0;
    if(tuple[0] == ""){
        tuple[0] = 1;
    }
    if(tuple[1] == ""){
        return 0;
    }
    for(let i = 0; i < parseInt(tuple[0]); i++){
        runningSum += randomIntFromInterval(1, parseInt(tuple[1]));
    }
    return runningSum;
}

function isNumeric(str) {
    //console.log(str);
    //console.log(str + " is numeric!");
    var regExp = /^[0-9]+$/;
    return (regExp.test(str));
}

  function isDiceString(str) {
    var tuple = str.split('D');
    if(tuple[0] == ""){
        tuple[0] = 1;
    }
    return tuple.length == 2 && isNumeric(tuple[0]) && isNumeric(tuple[1]);
}

  function isOperator(str) {
    return str == "+" || str == "-" || str == "X" || str == "/";
}

  function handleParsedValue(str){
    if(isNumeric(str)){
        return parseInt(str);
    } else if (isDiceString(str)){
        return resolveDiceNotation(str.split('D'));
    } else if (isOperator(str)){
        return str;
    } else {
        return 0;
    }

}

function multiply(num, num2){
    num = handleParsedValue(num);
    //console.log(num);
    num2 = handleParsedValue(num2);
    //console.log(num2);
    return num * num2;
}

function divide(num, denom){
    num = handleParsedValue(num);
    //console.log(num);
    denom = handleParsedValue(denom);
    if(denom == 0){
        return 0;
    }
    return Math.floor(num / denom);
}

function add(num, num2){
    num = handleParsedValue(num);
    num2 = handleParsedValue(num2);
    return num + num2;
}

function subtract(num, num2){
    num = handleParsedValue(num);
    num2 = handleParsedValue(num2);
    return num - num2;
}

function determineDecision(symbol, left, right){
    if(symbol == "+"){
        return add(left, right);
    } 
    else if(symbol == "-") {
        return subtract(left, right);
    }
    else if(symbol == "X") {
        return multiply(left, right);
    }
    else if(symbol == "/") {
        return divide(left, right);
    }
}