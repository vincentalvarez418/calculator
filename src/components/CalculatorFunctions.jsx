export const evaluateExpression = (input) => {
    try {
        return customEval(input).toString();
    } catch {
        return "Error";
    }
};

const customEval = (input) => {
    let sanitized = input.replace(/\s+/g, "");
    return computeExpression(sanitized);
};

const computeExpression = (expr) => {
    let tokens = expr.match(/\d+(?:\.\d+)?|[+\-*/()^]/g);
    return evaluateTokens(tokens);
};

const evaluateTokens = (tokens) => {
    let numStack = [], opStack = [];
    let precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    
    const applyOperator = () => {
        let b = numStack.pop(), a = numStack.pop(), op = opStack.pop();
        if (op === '/' && b === 0) return "Error";
        switch (op) {
            case '+': numStack.push(a + b); break;
            case '-': numStack.push(a - b); break;
            case '*': numStack.push(a * b); break;
            case '/': numStack.push(a / b); break;
            case '^': numStack.push(power(a, b)); break;
        }
    };
    
    for (let token of tokens) {
        if (!isNaN(token)) {
            numStack.push(Number(token));
        } else if (token in precedence) {
            while (opStack.length && precedence[opStack[opStack.length - 1]] >= precedence[token]) {
                applyOperator();
            }
            opStack.push(token);
        }
    }
    
    while (opStack.length) applyOperator();
    return numStack.pop();
};

export const handleScientificFunction = (func, value) => {
    try {
        switch (func) {
            case "sin": return scicalfunctionSin(value).toString();
            case "cos": return scicalfunctionCos(value).toString();
            case "tan": return scicalfunctionTan(value).toString();
            case "log": return scicalfunctionLog(value).toString();
            case "ln": return scicalfunctionLn(value).toString();
            case "sqrt": return scicalfunctionSqrt(value).toString();
            case "exp": return scicalfunctionExp(value).toString();
            case "pi": return "3.141592653589793";
            case "e": return "2.718281828459045";
            case "pow": return power(value[0], value[1]).toString();
            case "fact": return factorial(value).toString();
            default: return "Error";
        }
    } catch {
        return "Error";
    }
};

const factorial = (n) => {
    if (n < 0) return "Error";
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
};

const scicalfunctionSin = (x) => {
    let sum = 0, term = x, n = 1;
    for (let i = 0; i < 15; i++) {
        sum += term;
        term *= -1 * x * x / ((2 * n) * (2 * n + 1));
        n++;
    }
    return sum;
};

const scicalfunctionCos = (x) => {
    let sum = 1, term = 1, n = 1;
    for (let i = 0; i < 15; i++) {
        term *= -1 * x * x / ((2 * n - 1) * (2 * n));
        sum += term;
        n++;
    }
    return sum;
};

const scicalfunctionTan = (x) => {
    let cosValue = scicalfunctionCos(x);
    return cosValue === 0 ? "Error" : scicalfunctionSin(x) / cosValue;
};

const scicalfunctionLog = (x) => {
    if (x <= 0) return "Error";
    let sum = 0, term = (x - 1) / (x + 1), power = term;
    for (let i = 1; i < 30; i += 2) {
        sum += power / i;
        power *= term * term;
    }
    return 2 * sum;
};

const scicalfunctionLn = (x) => scicalfunctionLog(x) / scicalfunctionLog(2.718281828459045);

const scicalfunctionSqrt = (x) => {
    if (x < 0) return "Error";
    let guess = x / 2, precision = 0.0000001;
    while (Math.abs(guess * guess - x) > precision) {
        guess = (guess + x / guess) / 2;
    }
    return guess;
};

const scicalfunctionExp = (x) => {
    let sum = 1, term = 1;
    for (let i = 1; i < 30; i++) {
        term *= x / i;
        sum += term;
    }
    return sum;
};

const power = (base, exponent) => {
    if (exponent === 0) return 1;
    let result = 1;
    let isNegative = exponent < 0;
    exponent = Math.abs(exponent);
    for (let i = 0; i < exponent; i++) {
        result *= base;
    }
    return isNegative ? 1 / result : result;
};