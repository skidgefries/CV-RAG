import React, { useState, useRef, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

export default function App() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const chatBoxRef = useRef(null); // chat box lai reference garna

  const validTypes = [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // recent messages ma change aayo vane scroll to bottom garne
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    addFiles(uploadedFiles);
  };

  const addFiles = (uploadedFiles) => {
    const validFiles = uploadedFiles.filter((file) => validTypes.includes(file.type));
    const invalidFiles = uploadedFiles.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError("Only PDF, TXT or DOCX files are allowed");
    } else {
      setError("");
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const uploadedFiles = Array.from(e.dataTransfer.files);
    addFiles(uploadedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    const botMessage = { from: "bot", text: "You are Hungry" };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "100px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* File halne  */}
        <div
          className="file-section"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: files.length > 0 ? "flex-start" : "center",
            width: "70%",
            maxWidth: "800px",
            gap: "10px",
          }}
        >
          <div
            className={`file-upload ${dragOver ? "drag-over" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("hiddenFileInput").click()}
            style={{ flexShrink: 0 }}
          >
            Click to add a file
            <input
              type="file"
              id="hiddenFileInput"
              style={{ display: "none" }}
              onChange={handleFileUpload}
              multiple
            />
          </div>

          {/* at least one file then shift */}
          {files.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flexGrow: 1 }}>
              {files.map((f, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#1e40af",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{f.name}</span>
                  <span
                    style={{ cursor: "pointer", color: "#f87171", fontWeight: "bold" }}
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p style={{ color: "#f87171", marginTop: "5px" }}>{error}</p>}

        {/* Chat Box scrollable banaune */}
        <div className="chat-box" ref={chatBoxRef} style={{ overflowY: "auto", flexGrow: 1 }}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.from === "user" ? "chat-bubble-user" : "chat-bubble-bot"}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
