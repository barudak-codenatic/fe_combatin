"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001/ollama"); // Ganti dengan URL backend-mu

export default function ChatComponent() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(""); // Gabungkan teks dalam satu string
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Terima streaming data dari server dan gabungkan dalam satu tag <p>
    socket.on("response", (data) => {
      if (data === "[DONE]") {
        setLoading(false);
      } else {
        setResponse((prev) => prev + data); // Gabungkan teks ke dalam satu string
      }
    });

    return () => {
      socket.off("response"); // Bersihkan event saat unmount
    };
  }, []);

  const handleSend = () => {
    if (!prompt.trim()) return;
    console.log("Mengirim request ke backend:", prompt);
    setResponse(""); // Reset respons sebelum request baru
    setLoading(true);
    socket.emit("generate", prompt); // Kirim permintaan ke backend
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-xl font-bold">Combot</h1>
      <textarea
        className="w-full p-2 border rounded mt-2"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Tulis sesuatu..."
      />
      <button
        className="mt-2 bg-blue-500 text-white p-2 rounded w-full"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Loading..." : "Kirim"}
      </button>
      <div className="mt-4 p-2 bg-white border rounded min-h-[100px]">
        <p className="whitespace-pre-line">{response || "Menunggu respons..."}</p>
      </div>
    </div>
  );
}
