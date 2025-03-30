import React from "react";
import "./Calculator.css";
import { FaHistory, FaTrash } from "react-icons/fa";

const History = ({ history, setInput, clearHistory, setShowHistory }) => {
    return (
        <div className="calculator-container">
            <div className="calculator">
                <div className="display">HISTORY</div>
                <div className="history-list">
                    {history.length > 0 ? (
                        history.map((entry, index) => {
                            const [expression, answer] = entry.split(" = ");
                            return (
                                <div
                                    key={index}
                                    className="history-item"
                                    onClick={() => setInput(answer.trim())}
                                >
                                    <span>
                                        {expression} = <span className="result">{answer}</span>
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <p className="empty-history">No records yet..</p>
                    )}
                </div>
                <br></br>
                <button className="clear" onClick={clearHistory}>
                    <FaTrash /> {}
                </button>
                <button className="history-tag" onClick={() => setShowHistory(false)}>
                    <FaHistory /> {}
                </button>
            </div>
        </div>
    );
};

export default History;
