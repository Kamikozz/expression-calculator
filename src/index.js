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
                // if we reached an operation -> add item before & operation
                parsed.push(Number(item), arr[i]);
                item = '';
                break;
            default: item += arr[i]; break;
        }
    }
    // if it's the end of the line -> push item before
    if (item.length) parsed.push(Number(item));
    return parsed;
}

/**
 * Evaluate the given expression (WITHOUT BRACKETS)
 * @param {Array} arr unparsed array of the numbers & operations
 * @returns {number} result of the evaluated expression
 */
function eval(arr) {
    const OPERATIONS = ['/', '*', '-', '+'];
    let parsed = parser(arr); // get parsed array with numbers & operations
    while (parsed.length !== 1) {
        for (let i = 0; i < OPERATIONS.length; i++) {
            const OPERATION = OPERATIONS[i];

            let posOperation = parsed.indexOf(OPERATION);
            while (posOperation !== -1) {
                let tempResult;
                const operand1 = parsed[posOperation - 1];
                const operand2 = parsed[posOperation + 1];
                switch (OPERATION) {
                    case '/':
                        // if next item aka operand2 is equal to zero
                        if (parsed[posOperation + 1] === 0)
                            throw new Error('TypeError: Division by zero.');
                              tempResult = operand1 / operand2; break;
                    case '*': tempResult = operand1 * operand2; break;
                    case '-': tempResult = operand1 - operand2; break;
                    case '+': tempResult = operand1 + operand2; break;
                }
                // replace items to the left & to the right
                // from the found position of an operation
                // with item of an evaluated result
                // 3 items: operand1, operation, operand2
                parsed.splice(posOperation - 1, 3, tempResult);
                posOperation = parsed.indexOf(OPERATION);
            }
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

    // get rid of the brackets (if they are present)
    // find the most nested brackets
    let start = expr.lastIndexOf('(');
    while (start !== -1) {
        // find the closing bracket
        let end = expr.indexOf(')') + 1;
        // be sure, we found the correct closing bracket
        while (end < start) end = expr.indexOf(')', end) + 1;

        // cut found bracket expression from the source expression
        // (WITHOUT BRACKETS)
        let cutArray = expr.slice(start + 1, end - 1);

        // replace the most nested bracket expression (WITH BRACKETS)
        // in the source expression
        // with evaluated most nested bracket expression
        expr.splice(start, end - start, eval(cutArray));

        // find next most nested brackets
        start = expr.lastIndexOf('(');
    }

    // eval the clear expression without brackets
    return eval(expr);
}

module.exports = {
    expressionCalculator
}
