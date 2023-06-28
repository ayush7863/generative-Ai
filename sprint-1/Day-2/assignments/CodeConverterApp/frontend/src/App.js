import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [sourceCode, setSourceCode] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("JavaScript");
  const [convertedCode, setConvertedCode] = useState("");
  const [debuggedCode, setDebuggedCode] = useState("");
  const [codeQuality, setCodeQuality] = useState("");

  const handleSourceCodeChange = (event) => {
    setSourceCode(event.target.value);
  };

  const handleTargetLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  const handleConvertClick = async () => {
    try {
      const response = await axios.post("http://localhost:3001/convert", {
        code: sourceCode,
        targetLanguage,
      });

      const { translatedCode } = response.data;
      setConvertedCode(translatedCode);
      setDebuggedCode(""); // Clear debugged code output
    } catch (error) {
      console.error(error);
    }
  };

  const handleDebugClick = async () => {
    try {
      const response = await axios.post("http://localhost:3001/debug", {
        code: sourceCode,
      });

      const { debugResponse } = response.data;
      setDebuggedCode(debugResponse);
      setConvertedCode(""); // Clear converted code output
    } catch (error) {
      console.error(error);
    }
  };

  const handleQualityCheckClick = async () => {
    try {
      const response = await fetch("http://localhost:3001/quality-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: sourceCode }),
      });

      const data = await response.json();
      setCodeQuality(data.qualityScore);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Code Converter</h1>
      <div className="buttons">
        <button onClick={handleConvertClick}>Convert</button>
        <button onClick={handleDebugClick}>Debug</button>
        <button onClick={handleQualityCheckClick}>Quality </button>
      </div>
      <div className="select">
        <select
          id="targetLanguage"
          value={targetLanguage}
          onChange={handleTargetLanguageChange}
        >
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
          {/* Add more language options here */}
        </select>
      </div>
      <div id="input-container">
        <div className="input">
          {/* <label htmlFor="sourceCode">Source Code:</label> */}
          <textarea
            id="sourceCode"
            value={sourceCode}
            onChange={handleSourceCodeChange}
            rows={10}
            cols={50}
          />
        </div>

        <div className="output">
          <h2>Output:</h2>
          {convertedCode && (
            <div>
              <h3>Converted Code:</h3>
              <pre>{convertedCode}</pre>
            </div>
          )}
          {debuggedCode && (
            <div>
              <h3>Debugged Code:</h3>
              <pre>{debuggedCode}</pre>
            </div>
          )}
          {codeQuality && (
            <div>
              <h3>Code Quality:</h3>
              <p>{codeQuality}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
