import { useState } from "react";
import "./Calculator.css";
import { evaluateExpression, handleScientificFunction } from "./CalculatorFunctions";
import History from "./History";
import { FaHistory } from "react-icons/fa";
import { FaBackspace } from "react-icons/fa";

const Calculator = () => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [error, setError] = useState(null);
    const [isRadians, setIsRadians] = useState(true);
    const [lastTrigFunction, setLastTrigFunction] = useState(null);
    const [lastTrigValue, setLastTrigValue] = useState(null);

    const handleClick = (value) => {
        setError(null);
    
        if (value === "%") {
            setInput((prev) => {
                if (!prev.trim()) return prev;
                return prev + "%";
            });
        } else {
            setInput((prev) => prev + value);
        }
    };

    const handleClear = () => {
        setError(null); 
        setInput("");
        setLastTrigFunction(null);
        setLastTrigValue(null);
    };

    const handleCalculate = () => {
        if (!input.trim()) {
            setError("Invalid Input");
            return;
        }
    
        try {
            let expression = input.replace(/(\d+(\.\d+)?)%/g, (match, num) => {
                let parts = input.split(/[\+\-\*\/]/);
                let lastNumber = parseFloat(parts[parts.length - 2] || "1");
                return `(${num}/100 * ${lastNumber})`;
            });
    
            const result = evaluateExpression(expression);
            if (isNaN(result)) {
                setError("Math Error");
                setInput("");
            } else {
                setHistory((prev) => [...prev, `${input} = ${result}`]);
                setInput(result);
            }
        } catch (e) {
            setError("Calculation Error");
            setInput("");
        }
    };

    const handleSciFunction = (func) => {
        if (!input.trim() || isNaN(parseFloat(input))) {
            setError("Invalid Input");
            return;
        }

        try {
            const result = handleScientificFunction(func, parseFloat(input), isRadians);
            if (isNaN(result)) {
                setError("Math Error");
                setInput("");
            } else {
                setHistory((prev) => [...prev, `${func}(${input}) = ${result}`]);
                setInput(result);
                if (["sin", "cos", "tan", "asin", "acos", "atan"].includes(func)) {
                    setLastTrigFunction(func);
                    setLastTrigValue(parseFloat(input));
                } else {
                    setLastTrigFunction(null);
                    setLastTrigValue(null);
                }
            }
        } catch (e) {
            setError("Calculation Error");
            setInput("");
        }
    };

    const handleBackspace = () => {
        setInput((prev) => prev.slice(0, -1));
    };

    const toggleRadiansDegrees = () => {
        if (!lastTrigFunction || lastTrigValue === null) return;

        const newRadians = !isRadians;
        setIsRadians(newRadians);

        const convertedValue = newRadians
            ? (lastTrigValue * Math.PI) / 180
            : (lastTrigValue * 180) / Math.PI;

        const newResult = handleScientificFunction(lastTrigFunction, convertedValue, newRadians);
        if (!isNaN(newResult)) {
            setInput(newResult);
        } else {
            setError("Math Error");
        }
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <div className="calculator-wrapper">
            <div className="calculator-container">
                {!showHistory ? (
                    <div className="calculator">
                        <div className="display">
                            {error ? error : input || "0"}
                        </div>
                        <button 
                            onClick={toggleRadiansDegrees} 
                            disabled={!lastTrigFunction} 
                            style={{ opacity: lastTrigFunction ? 1 : 0.5 }}
                        >
                            {isRadians ? "RAD" : "DEG"}
                        </button>
                        <br></br>
                        <div className="buttons">
                            {["7", "8", "9", "/"].map((btn) => (
                                <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
                            ))}
                            {["4", "5", "6", "*"].map((btn) => (
                                <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
                            ))}
                            {["1", "2", "3", "-"].map((btn) => (
                                <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
                            ))}
                            {["0", ".", "%", "+"].map((btn) => (
                                <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
                            ))}

                            <button className="equals" onClick={handleCalculate}>=</button>
                            <div className="clear-backspace-container">
                                <button className="clear" onClick={handleClear}>C</button>
                                <button className="backspace" onClick={handleBackspace}>
                                    <FaBackspace />
                                </button>
                            </div>
                            {["sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "log", "ln", "sqrt", "cbrt", "exp", "pi", "e", "pow", "fact"].map((func) => (
                                <button key={func} onClick={() => handleSciFunction(func)}>{func}</button>
                            ))}
                            <button className="history-tag" onClick={() => setShowHistory(!showHistory)}>
                                <FaHistory />
                            </button>
                        </div>
                    </div>                
                ) : (
                    <History history={history} setInput={setInput} clearHistory={clearHistory} setShowHistory={setShowHistory} />
                )}
            </div>
        </div>
    );
};

export default Calculator;
