import { useState } from "react";
import "./Calculator.css";
import { evaluateExpression, handleScientificFunction } from "./CalculatorFunctions";
import History from "./History";
import { FaHistory } from "react-icons/fa";

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
        setInput((prev) => prev + value);
    };

    const handleClear = () => {
        setError(null); 
        setInput("");
        setLastTrigFunction(null);
        setLastTrigValue(null);
    };

    const handleCalculate = () => {
        if (!input.trim()) {
            setError("");
            return;
        }

        try {
            const result = evaluateExpression(input);
            if (result === "") {
                setError("");
                setInput("");
            } else {
                setHistory((prev) => [...prev, `${input} = ${result}`]);
                setInput(result);
            }
        } catch (e) {
            setError("");
            setInput("");
        }
    };

    const handleSciFunction = (func) => {
        if (!input.trim() || isNaN(parseFloat(input))) {
            setError("");
            return;
        }

        try {
            const result = handleScientificFunction(func, parseFloat(input), isRadians);
            if (result === "") {
                setError("");
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
            setError("");
            setInput("");
        }
    };

    const toggleRadiansDegrees = () => {
        if (!lastTrigFunction || lastTrigValue === null) return;

        const newRadians = !isRadians;
        setIsRadians(newRadians);

        const convertedValue = newRadians
            ? (lastTrigValue * Math.PI) / 180
            : (lastTrigValue * 180) / Math.PI;

        const newResult = handleScientificFunction(lastTrigFunction, convertedValue, newRadians);
        setInput(newResult);
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
                            {isRadians ? "Radians" : "Degrees"}
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
                            {["0", ".", "=", "+"].map((btn) => (
                                <button key={btn} onClick={() => (btn === "=" ? handleCalculate() : handleClick(btn))}>{btn}</button>
                            ))}
                            <button className="clear" onClick={handleClear}>C</button>
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