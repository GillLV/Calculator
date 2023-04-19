function add(a,b) {
    return a+b;
}

function subtract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a,b) {
    if (b == 0) return undefined;
    else { return a/b };
}

function power(a,b){
    return Math.pow(a,b);
}


function operate(a, op, b) {

    switch(op){
        case "+":
            return add(a,b);
        case "-":
            return subtract(a,b);
        case "*":
            return multiply(a,b);
        case "/":
            return divide(a,b);
        case "^":
            return power(a,b);
        default:
            error = "Computation Error";
            return;

    }
}

function onClickClr() {
    error = "";
    let display = document.querySelector(".display");
    display.textContent = "";
    values.length = 0;
    currentNum = "";
    currentOp = "";

}

function onClickDel(){
    
    //Remove last character from display and our current number/operator
    let display = document.querySelector(".display");

    if (display.textContent == "Syntax Error" || display.textContent == "Precision Error") { onClickClr(); return; }

    let text = Array.from(display.textContent);
    let char = text.pop();

    let operators = ["^", "+", "-", "*", "/"];
   

    //remove end character from currentNum/currentOp
    if (operators.includes(char)) 
    {
        //
        if (currentOp != "")
        currentOp = currentOp.slice(0, currentOp.length-1);
        
        //If deleting the return value of an operation, currentNum and curentOp will be empty
        else if (currentNum=="" && currentOp=="")
        {
            let lastElem = values.length - 1;
            if(lastElem == 0) values.shift();
            else{values[values.length -1] = values[lastElem].slice(0, values[lastElem].length - 1);}
        }
    }
    //If nothing in the display, do nothing
    else if (char ==  undefined)
    {
        return;
    }
    else
    {
        if (currentNum != "")
        currentNum = currentNum.slice(0, currentNum.length-1);
        
        else if (currentNum=="" && currentOp=="")
        {
            let lastElem = values.length - 1;
            if(lastElem == 0) values.shift();
            else{values[values.length -1] = values[lastElem].slice(0, values[lastElem].length - 1);}
        }
    }

    display.textContent = display.textContent.slice(0, display.textContent.length -1);

    //Reset errors and then re-check new string for errors
    error = '';

    let num = "";
    for(let i = 0; i < text.length; i++)
    {
        if (operators.includes(text[i]))
        {
            //Check to make sure there are numbers before an operator or there are not multiple operators in a row
            if (num == "") error = "Syntax Error";
            num = "";
        }
        else
        {
            //Have to break up match search into two as match() will retuen null when not matches are found
            num += text[i];
            let matches = num.match(/\./g);
            if (matches != null)
            {
                if (matches.length > 1 ) error = "Syntax Error";
            }
        }
    }

}

function OnClickNum(numStr){
    
    currentNum += numStr;
    let matches = currentNum.match(/\./g);
    if (matches != null)
    {
        if (matches.length > 1 && error == "") error = "Syntax Error";
    }
    if (currentOp != "") values.push(currentOp);
    currentOp = "";
    let display = document.querySelector(".display");
    //If number becoems larger than what can fit on the display, chop off ends of number to make it fit
    if(display.textContent.length == sizeOfDisplay)
    {
       display.textContent = display.textContent.substring(1); 
    }
    display.textContent += numStr;
}

function OnClickOperator(opStr){
    currentOp += opStr;
    if ((currentOp.length > 1 /*|| currentNum == ""*/)&& error == "") error = "Syntax Error"
    if(currentNum != "") values.push(currentNum);
    currentNum = "";
    let display = document.querySelector(".display");
    //If number becoems larger than what can fit on the display, chop off ends of number to make it fit
    if(display.textContent.length == sizeOfDisplay)
    {
       display.textContent = display.textContent.substring(1); 
    }
    display.textContent += opStr;
}

function onClickEquals(){
    values.push(currentNum);
    //safety
    if ((values.length % 2 == 0 || values.length == 0 || values.length == 1) && error == "") error = "Syntax Error";
    let display = document.querySelector(".display");
   //Don't proceed if there are errors
    if (error != "") 
    {
        display.textContent = error;
        return;
    }

    //Check again for syntax errors before calculating result to be safe.
    while (values.length >= 3)
    {

        a = values.shift(); 
        let aMax = determineMaxSafeFloat(a);
        if (aMax == -1) break;

        a = parseFloat(a); 
        //Safe Int Max
        if (a > aMax) {error = "Precision Error"; break;}
        //safety
        if (isNaN(a)) {error = "Syntax Error"; break;}

        op = values.shift();
        //safety
        let operators = ["^", "+", "-", "*", "/"];
        if (!operators.includes(op)) {error = "Syntax Error"; break;}

        b = values.shift(); 
        let bMax = determineMaxSafeFloat(b);
        if (bMax == -1) break;

        b = parseFloat(b); 
        if (b > bMax) {error = "Precision Error"; break;}
        //safety
        if (isNaN(b)) {error = "Syntax Error"; break;}

        result = operate(a, op, b);

        if (result == undefined) break;

        values.unshift(result.toString());
    }

    //Check again for calculation errors and abort if found.
    if (error != "") 
    {
        display.textContent = error;
        return;
    }  

    currentNum = "";

    let resultStr = result.toString();
    let index = resultStr.indexOf('.');
    if (index != -1) 
    {
        resultStr = resultStr.substring(index, resultStr.length);
        if (resultStr.length > 9)
        result = result.toFixed(9);    
    }
    display.textContent = result;
}

function determineMaxSafeFloat(string)
{
   let index = string.indexOf('.');
   if (index == 0) {
   error = "Syntax Error";
   return -1;
   }
   //Subtract extra 1 to account for zero based index
   let numDec = index == -1 ? -1 : string.length - index -1;

   switch(numDec)
   {
    case -1:
        return 9007199254740991;
        break; 
    case 1:
        return 562949953421312;
        break;
    case 2:
        return 70368744177664;
        break;
    case 3: 
        return 8796093022208;
        break;
    case 4:
        return 549755813888;
        break;
    case 5:
        return 68719476736;
        break;
    case 6:
        return 8589934592;
        break;
    case 7:
        return 536870912;
        break;
    case 8: 
        return 67108864;
        break; 
    case 9:
        return 8388608;
        break;
    default:
        error = "Precission Error";
        return -1;
        break;
   }

}

function onPressKey(e)
{
    let nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
    let ops = ["+", "-", "*", "/", "^"];

    if (nums.includes(e.key)) OnClickNum(e.key);

    else if (ops.includes(e.key)) OnClickOperator(e.key);

    else if (e.key == '=') onClickEquals();

    else if (e.key == "Backspace") onClickDel();

    else if (e.key == "Delete") onClickClr();
    
}

let a = 0;
let op = "";
let b = 0;
let currentNum = "" ;
let currentOp = "";
let values = [];
let error = "";
let result = 0;
let sizeOfDisplay = 17;

let numbers = document.querySelectorAll(".btnNum");
numbers.forEach(element => { element.addEventListener('click', 
    ((e) => { let numStr = e.currentTarget.textContent;
        OnClickNum(numStr) }))});

let operators = document.querySelectorAll(".btnOp");
operators.forEach(element => { element.addEventListener('click', 
    (e) => { let opStr = e.currentTarget.textContent;
        OnClickOperator(opStr)})});

let equals = document.querySelector(".btnEquals");
equals.addEventListener('click', (onClickEquals));

let clr = document.querySelector(".btnClr");
clr.addEventListener('click', onClickClr);

let del = document.querySelector(".btnDel");
del.addEventListener('click', onClickDel);

//Keyboard support
document.addEventListener('keyup', onPressKey)

