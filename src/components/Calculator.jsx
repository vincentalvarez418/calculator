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

    const handleClick = (value) => {
        setError(null);
        setInput((prev) => prev + value);
    };

    const handleClear = () => {
        setError(null); 
        setInput("");
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
            const result = handleScientificFunction(func, parseFloat(input));
            if (result === "") {
                setError("");
                setInput("");
            } else {
                setHistory((prev) => [...prev, `${func}(${input}) = ${result}`]);
                setInput(result);
            }
        } catch (e) {
            setError("");
            setInput("");
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
                        
                        {}
                        {["sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "log", "ln", "sqrt", "cbrt", "exp", "pi", "e", "pow", "fact"].map((func) => (
                            <button key={func} onClick={() => handleSciFunction(func)}>{func}</button>
                        ))}
                        
                        {}
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
