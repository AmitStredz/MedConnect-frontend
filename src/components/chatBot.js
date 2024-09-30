import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatComponent({ id, name }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
  }, [name]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = new Date();

    // Add the user's message to the chat
    setMessages([...messages, { text: input, type: "sent", timestamp: now }]);
    setInput("");
    setLoading(true);

    console.log("patientid: ", id);

    // const data = 
    
    try {
      // Replace with your API endpoint
      const response = await axios.post(
        "https://sea-turtle-app-k7x99.ondigitalocean.app/api/chat/",
        { patient_id: id, prompt: input }
      );

      console.log("response: ", response);

      // Format the response to display each sentence on a new line
      const formattedResponse = response.data.replace(/\. /g, ".\n");

      // Add the formatted response as a single message
      setMessages([
        ...messages,
        { text: input, type: "sent", timestamp: now },
        { text: formattedResponse, type: "received", timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent new line in textarea
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-xl h-[40rem]">
      <div className="rounded-t-xl bg-slate-200 p-4 border-2 border-slate-300">
        {name ? (
          <span>
            Know more about <strong className="text-[20px]">{name}!!</strong>
          </span>
        ) : (
          "Select patient to start chatting..."
        )}
      </div>
      <div className="flex-1 p-4 overflow-auto bg-gray-100">
        <div className="space-y-4 w-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full flex flex-col ${
                msg.type === "sent" ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`p-1 px-3 rounded-md ${
                  msg.type === "sent"
                    ? "bg-[#74e969cb] text-black text-right"
                    : "bg-[#229ce369] text-left"
                }`}
                style={{ whiteSpace: "pre-line" }} // This will respect newline characters
              >
                {msg.text}
              </span>
              <div className="text-[10px] text-gray-500 mt-1">
                {formatDate(new Date(msg.timestamp))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 text-center">Loading...</div>
          )}
        </div>
      </div>
      <div className="p-2 sm:p-4 bg-gray-200 rounded-b-xl border-2 border-slate-300">
        <div className="flex justify-between gap-1">
          <input
            type="text"
            value={input}
            disabled={!name}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-l-lg outline-none max-sm:max-w-52"
          />
          <button
            onClick={handleSend}
            disabled={!name}
            className={`bg-blue-500 text-white px-5 sm:px-10 p-2 rounded-lg right-0 ${
              name ? "bg-blue-500" : "bg-blue-200"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
