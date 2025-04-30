"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import Link from "next/link";

const socket = io("http://localhost:3001/ollama");

export default function ChatComponent() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    socket.on("response", (data) => {
      if (data === "[DONE]") {
        setLoading(false);
      } else {
        setResponse((prev) => prev + data);
      }
    });

    socket.on("source", (data) => {
      setSource(data); // data: { title, url }
    });

    return () => {
      socket.off("response");
      socket.off("source");
    };
  }, []);

  const handleSend = () => {
    if (!prompt.trim()) return;
    console.log("Mengirim request ke backend:", prompt);
    setResponse("");
    setSource(null);
    setLoading(true);
    socket.emit("generate", prompt);
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
        {source && (
            <Link href={source.url} className="px-4 py-2 rounded-lg bg-gray-200" target="_blank">
              {source.title}
            </Link>
        )}
      </div>
    </div>
  );
}
