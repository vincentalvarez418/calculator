import React from "react";
import "./Calculator.css";
import { FaHistory } from "react-icons/fa";

const History = ({ history, setInput, clearHistory, setShowHistory }) => {
    return (
        <div className="calculator-container">
            <div className="calculator">
                <div className="display">History</div>
                <div className="history-list">
                    {history.length > 0 ? (
                        history.map((entry, index) => (
                            <div 
                                key={index} 
                                className="history-item"
                                onClick={() => setInput(entry.split("=")[1].trim())}
                            >
                                {entry}
                            </div>
                        ))
                    ) : (
                        <p className="empty-history">No history available</p>
                    )}
                </div>
                <br></br>
                <button className="clear" onClick={clearHistory}>Clear History</button>
                <button className="history-tag" onClick={() => setShowHistory(false)}>
                    <FaHistory /> {}
                </button>
            </div>
        </div>
    );
};

export default History;
