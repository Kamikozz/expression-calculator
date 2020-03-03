/**
 * Parser of array expression sequencies (WITHOUT BRACKETS)
 * @param {Array} arr unparsed array of symbols with numbers & operations
 * @returns {Array} parsed array numbers & operations
 */
function parser(arr) {
    let parsed = [];
    let item = '';
    for (let i = 0; i < arr.length; i++) {
        switch(arr[i]) {
            case '+':
            case '-':
            case '*':
            case '/':
                parsed.push(Number(item), arr[i]);
                item = '';
                break;
            default: item += arr[i]; break;
        }
    }
    if (item.length) parsed.push(Number(item));
    return parsed;
}

function eval(arr) {
    let parsed = parser(arr);

    const OPERATIONS = ['/', '*', '-', '+'];
    while (parsed.length !== 1) {
        let currentOperation = 0;

        // Division
        let posOperation = parsed.indexOf(OPERATIONS[currentOperation]);
        while (posOperation !== -1) {
            // console.log(`--${OPERATIONS[currentOperation]}--`);
            let tempResult;
            if (parsed[posOperation + 1] === 0)
                throw new Error('TypeError: Division by zero.');
            tempResult = parsed[posOperation - 1] / parsed[posOperation + 1];
            // console.log(tempResult);
            parsed.splice(posOperation - 1, 3, tempResult);
            posOperation = parsed.indexOf(OPERATIONS[currentOperation]);
        }
        currentOperation++;

        posOperation = parsed.indexOf(OPERATIONS[currentOperation]);
        while (posOperation !== -1) {
            // console.log(`--${OPERATIONS[currentOperation]}--`);
            let tempResult;
            tempResult = parsed[posOperation - 1] * parsed[posOperation + 1];
            // console.log(tempResult);
            parsed.splice(posOperation - 1, 3, tempResult);
            posOperation = parsed.indexOf(OPERATIONS[currentOperation]);
        }
        currentOperation++;

        posOperation = parsed.indexOf(OPERATIONS[currentOperation]);
        while (posOperation !== -1) {
            // console.log(`--${OPERATIONS[currentOperation]}--`);
            let tempResult;
            tempResult = parsed[posOperation - 1] - parsed[posOperation + 1];
            // console.log(tempResult);
            parsed.splice(posOperation - 1, 3, tempResult);
            posOperation = parsed.indexOf(OPERATIONS[currentOperation]);
        }
        currentOperation++;

        posOperation = parsed.indexOf(OPERATIONS[currentOperation]);
        while (posOperation !== -1) {
            // console.log(`--${OPERATIONS[currentOperation]}--`);
            let tempResult;
            tempResult = parsed[posOperation - 1] + parsed[posOperation + 1];
            // console.log(tempResult);
            parsed.splice(posOperation - 1, 3, tempResult);
            posOperation = parsed.indexOf(OPERATIONS[currentOperation]);
        }
    }
    return parsed[0];
}

function expressionCalculator(expr) {
    // remove spaces from expression
    expr = expr.split('').filter(val => val !== '' && val !== ' ');

    // simple check if input expression is valid
    let bracketsCount = 0;
    for (let i = 0; i < expr.length; i++) {
        switch (expr[i]) {
            case '(': bracketsCount++; break;
            case ')': bracketsCount--; break;
        }
    }
    if (bracketsCount !== 0)
        throw new Error('ExpressionError: Brackets must be paired');

    let start = expr.lastIndexOf('(');
    // there are brackets somewhere
    while (start !== -1) {
        let end = expr.indexOf(')') + 1;
        while (end < start) end = expr.indexOf(')', end) + 1;

        let cutArr = expr.slice(start + 1, end - 1);
        expr.splice(start, end - start, eval(cutArr));
        start = expr.lastIndexOf('(');
    }

    // eval the clear expression without brackets
    return eval(expr);
}

module.exports = {
    expressionCalculator
}

// console.log(module.exports.expressionCalculator('2 + 2'));
// console.log(module.exports.expressionCalculator('2-2'));
// console.log(module.exports.expressionCalculator('2*3'));
// console.log(module.exports.expressionCalculator('1/2'));
// console.log(module.exports.expressionCalculator('1 / 0'));
// console.log(module.exports.expressionCalculator(' (49 * 63) / (58 * (3 * 36)) '));
// console.log(module.exports.expressionCalculator('88 - 72 + 55 * 57'));
// console.log(module.exports.expressionCalculator('48 + 59 * 86 * 92 * 23'));
// console.log(module.exports.expressionCalculator(' 49 * 63 / 58 * 36  '));