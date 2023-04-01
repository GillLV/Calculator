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

    }
}

function onClickNum(){
    currentNum += this.text;
}


let a = 0;
let op = "";
let b = 0;
let currentNum = "" ;

let numbers = document.querySelector(".btnNum");
operators.forEach(element => { Element.addEventListener('click', onClickNum)
})

let operators = document.querySelector(".btnOp");
operators.forEach(element => { Element.addEventListener('click', onClickOperator)
    
});

