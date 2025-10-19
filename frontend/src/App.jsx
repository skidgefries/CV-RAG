
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");


  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const validTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(uploadedFile.type)) {
      setError("Only PDF, TXT or DOCX files are allowed");
      setFile(null);
    } else {
      setError("");
      setFile(uploadedFile);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    const botMessage = { from: "bot", text: "You are Hungry" };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      const fakeEvent = { target: { files: [uploadedFile] } };
      handleFileUpload(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "100px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="file-upload" onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => document.getElementById('hiddenFileInput').click()}>
          {file ? file.name : "Drag & drop a file here or click to upload"}
          <input type="file" id = "hiddenFileInput" style={{ display: "none" }} onChange={handleFileUpload} />
        </div>
        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={msg.from === "user" ? "chat-bubble-user" : "chat-bubble-bot"}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>➤</button>
        </div>
      </div>
    </div>
  );
}