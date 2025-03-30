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

export const handleScientificFunction = (func, value) => {
    try {
        if (["sin", "cos", "tan"].includes(func)) {
            value = (value * Math.PI) / 180;
        }
        
        let result;
        switch (func) {
            case "sin": result = Math.sin(value); break;
            case "cos": result = Math.cos(value); break;
            case "tan": result = Math.tan(value); break;

            case "asin": 
                result = Math.asin(value);
                result = (result * 180) / Math.PI;
                break;
            case "acos": 
                result = Math.acos(value);
                result = (result * 180) / Math.PI;
                break;
            case "atan": 
                result = Math.atan(value);
                result = (result * 180) / Math.PI;
                break;
     
            case "sinh": result = Math.sinh(value); break;
            case "cosh": result = Math.cosh(value); break;
            case "tanh": result = Math.tanh(value); break;
            case "log": result = Math.log10(value); break;
            case "ln": result = Math.log(value); break;
            case "sqrt": result = Math.sqrt(value); break;
            case "cbrt": result = Math.cbrt(value); break;
            case "exp": result = Math.exp(value); break;
            case "pi": return "3.141593";
            case "e": return "2.718282";
            case "pow": return Math.pow(value[0], value[1]).toString();
            case "fact": return factorial(value).toString();
            default: return "Error";
        }

        return result.toFixed(6);
    } catch {
        return "Error";
    }
};





const factorial = (n) => {
    if (n < 0) return "Error";
    return n === 0 ? 1 : [...Array(n).keys()].map(i => i + 1).reduce((a, b) => a * b, 1);
};