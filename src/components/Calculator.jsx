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
    const [isRadians, setIsRadians] = useState(false);
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
            setError("Invalid Input");
            return;
        }
    
        try {
            let expression = input.replace(/(\d+(\.\d+)?)%/g, (match, num) => {
                return `(${num}/100)`;
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
    
        const inputValue = parseFloat(input);
        
        try {
            let result = handleScientificFunction(func, inputValue, isRadians);
            
            if (isNaN(result)) {
                setError("Math Error");
                setInput("");
            } else {
                setHistory((prev) => [...prev, `${func}(${input}) = ${result}`]);
                setInput(result);
                
                if (["sin", "cos", "tan", "asin", "acos", "atan"].includes(func)) {
                    setLastTrigFunction(func);
                    setLastTrigValue(inputValue); 
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
                        <div className="rad-deg-box">
                        <div>
                            <strong>Rad:</strong> {lastTrigValue !== null ? ((lastTrigValue * Math.PI) / 180).toFixed(6) : "N/A"}
                        </div>
                        <div>
                            <strong>Deg:</strong> {lastTrigValue !== null ? lastTrigValue.toFixed(6) : "N/A"}
                        </div>
                    </div>


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
