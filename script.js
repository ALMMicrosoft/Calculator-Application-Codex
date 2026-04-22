let currentValue = '0';
let previousValue = null;
let operator = null;

const display = document.getElementById('display');

function updateDisplay() {
    display.value = currentValue;
}

function appendNumber(num) {
    if (currentValue === 'Error') {
        currentValue = '0';
    }

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
    const normalizedOperator = op === '\u00D7' || op === 'x' || op === 'X' ? '*' : op;

    if (normalizedOperator !== '+' && normalizedOperator !== '-' && normalizedOperator !== '*' && normalizedOperator !== '/') {
        // Only basic arithmetic operators are allowed
        return;
    }

    if (previousValue !== null && operator !== null) {
        calculate();
    }

    previousValue = parseFloat(currentValue);
    if (Number.isNaN(previousValue)) {
        previousValue = null;
        operator = null;
        currentValue = '0';
        updateDisplay();
        return;
    }

    operator = normalizedOperator;
    currentValue = '0';
}

function calculate() {
    if (operator === null || previousValue === null) {
        return;
    }

    const current = parseFloat(currentValue);
    if (Number.isNaN(current)) {
        return;
    }
    let result;

    if (operator === '+') {
        result = previousValue + current;
    } else if (operator === '-') {
        result = previousValue - current;
    } else if (operator === '*') {
        result = previousValue * current;
    } else if (operator === '/') {
        if (current === 0) {
            currentValue = 'Error';
            operator = null;
            previousValue = null;
            updateDisplay();
            return;
        }
        result = previousValue / current;
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
