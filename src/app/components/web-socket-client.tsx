"use client";

import { useEffect, useState } from "react";

export function WebSocketClient() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("connected to server");
      setConnectionStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      } catch (err) {
        console.error("Error parsing message:", err);
        setError("Failed to parse message from server");
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket connection error");
      setConnectionStatus("disconnected");
    };

    ws.onclose = () => {
      console.log("disconnected from server");
      setConnectionStatus("disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);
  
  return (
    <div className="p-4 border rounded-md my-4">
      <h2 className="text-xl font-bold mb-2">WebSocket Client</h2>
      <div className="mb-2">
        Status: {
          connectionStatus === "connected" ? 
            <span className="text-green-600">Connected</span> : 
            connectionStatus === "connecting" ? 
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
                  {JSON.stringify(msg, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
