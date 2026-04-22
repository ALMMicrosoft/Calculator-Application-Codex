let currentValue = '0';
let previousValue = null;
let operator = null;

const display = document.getElementById('display');

function updateDisplay() {
    display.value = currentValue;
}

function appendNumber(num) {
    if (currentValue === '0' && num !== '.') {
        currentValue = num;
    } else if (num === '.' && currentValue.includes('.')) {
        return; // Prevent multiple decimal points
    } else {
        currentValue += num;
    }
    updateDisplay();
}

function setOperator(op) {
    if (op !== '+' && op !== '-') {
        // Only addition and subtraction are allowed
        return;
    }
    
    if (previousValue !== null && operator !== null) {
        calculate();
    }
    
    previousValue = parseFloat(currentValue);
    operator = op;
    currentValue = '0';
}

function calculate() {
    if (operator === null || previousValue === null) {
        return;
    }
    
    const current = parseFloat(currentValue);
    let result;
    
    // Addition and subtraction are implemented
    if (operator === '+') {
        result = previousValue + current;
    } else if (operator === '-') {
        result = previousValue - current;
    } else {
        return;
    }
    
    currentValue = result.toString();
    operator = null;
    previousValue = null;
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    previousValue = null;
    operator = null;
    updateDisplay();
}

// Initialize display
updateDisplay();
