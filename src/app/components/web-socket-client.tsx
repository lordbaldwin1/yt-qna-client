"use client";

import { useEffect, useState } from "react";

export function WebSocketClient(props: { videoId: string }) {
  // why is this a state?
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // HOW THE FUCK DO I FORMAT A CHAT?
  // HOW THE FUCK DO I FORMAT THE CHUNKS?
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      // Probably setup the welcome message?
      // 
      console.log("connected to server");
    };

    // types: error, processing, chunk, complete
    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.type === "error") {
          setError(response.message);
        } else if (response.type === "processing") {
          setLoading(true);
        } else if (response.type === "chunk") {
          setMessages((prevMessages) => [...prevMessages, response.message]);
        } else if (response.type === "complete") {
          setLoading(false);
        } else if (response.type === "connection") {
          setMessages((prevMessages) => [...prevMessages, response.message]);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
        setError("Failed to parse message from server");
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && inputQuestion) {
      console.log("sending message", inputQuestion);
      socket.send(JSON.stringify({ question: inputQuestion, videoId: props.videoId }));
      setInputQuestion("");
    }
  }
  
  return (
    <div className="p-4 border rounded-md my-4">
      <h2 className="text-xl font-bold mb-2">WebSocket Client</h2>
      <div className="mb-2">
        Status: {
          socket?.readyState === WebSocket.OPEN ? 
            <span className="text-green-600">Connected</span> : 
            socket?.readyState === WebSocket.CONNECTING ? 
              <span className="text-yellow-600">Connecting...</span> : 
              <span className="text-red-600">Disconnected</span>
        }
      </div>
      
      {error && <div className="text-red-500 mb-2">{error}</div>}
      
      <div className="messages-container mt-4">
        <h3 className="font-medium mb-2">Messages:</h3>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages received yet</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded">
            {messages.map((msg, index) => (
              <li key={index} className="p-2 rounded">
                <pre className="whitespace-pre-wrap text-sm">
                  {msg}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type your question here..."
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
