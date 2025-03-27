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
            case '^': numStack.push(Math.pow(a, b)); break;
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

export const handleScientificFunction = (func, value, isRadians = true) => {
    try {
        if (!isRadians && ["sin", "cos", "tan", "asin", "acos", "atan"].includes(func)) {
            value = (value * Math.PI) / 180;
        }
        switch (func) {
            case "sin": return Math.sin(value).toString();
            case "cos": return Math.cos(value).toString();
            case "tan": return Math.tan(value).toString();
            case "asin": 
            case "acos": 
            case "atan":
            if (!isRadians) {
                value = (value * Math.PI) / 180; 
            }
            let result = Math[func](value);
            return isRadians ? result.toString() : (result * 180 / Math.PI).toString(); 
            case "sinh": return Math.sinh(value).toString();
            case "cosh": return Math.cosh(value).toString();
            case "tanh": return Math.tanh(value).toString();
            case "log": return Math.log10(value).toString();
            case "ln": return Math.log(value).toString();
            case "sqrt": return Math.sqrt(value).toString();
            case "cbrt": return Math.cbrt(value).toString();
            case "exp": return Math.exp(value).toString();
            case "pi": return "3.141592653589793";
            case "e": return "2.718281828459045";
            case "pow": return Math.pow(value[0], value[1]).toString();
            case "fact": return factorial(value).toString();
            default: return "Error";
        }
    } catch {
        return "Error";
    }
};

const factorial = (n) => {
    if (n < 0) return "Error";
    return n === 0 ? 1 : [...Array(n).keys()].map(i => i + 1).reduce((a, b) => a * b, 1);
};