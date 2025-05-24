"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp, FaRobot } from "react-icons/fa6";

const socket = io("http://localhost:3001/ollama");

// Tipe untuk pesan chat
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: { title: string; url: string } | null;
}

export default function ChatComponent() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [currentSource, setCurrentSource] = useState<{ title: string; url: string } | null>(null);
  
  // Refs untuk textarea
  const textareaRef1 = useRef<HTMLTextAreaElement>(null);
  const textareaRef2 = useRef<HTMLTextAreaElement>(null);

  // Fungsi untuk auto-resize textarea dengan batas maksimal
  const autoResizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    
    // Reset tinggi ke auto untuk mendapatkan tinggi yang benar
    textarea.style.height = 'auto';
    
    // Hitung tinggi konten
    const contentHeight = textarea.scrollHeight;
    
    // Hitung tinggi satu baris (perkiraan)
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    
    // Batasi tinggi maksimal ke 4 baris
    const maxHeight = lineHeight * 4;
    
    // Terapkan tinggi yang sesuai, tidak melebihi maxHeight
    textarea.style.height = `${Math.min(contentHeight, maxHeight)}px`;
  };

  // Effect untuk auto-resize saat prompt berubah
  useEffect(() => {
    autoResizeTextarea(textareaRef1.current);
    autoResizeTextarea(textareaRef2.current);
  }, [prompt]);

  useEffect(() => {
    socket.on("response", (data) => {
      if (data === "[DONE]") {
        setLoading(false);
        // Tambahkan pesan asisten ke daftar pesan
        if (currentResponse.trim()) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: currentResponse,
              source: currentSource,
            },
          ]);
          setCurrentResponse("");
          setCurrentSource(null);
        }
      } else {
        setCurrentResponse((prev) => prev + data);
      }
    });

    socket.on("source", (data) => {
      setCurrentSource(data); // data: { title, url }
    });

    return () => {
      socket.off("response");
      socket.off("source");
    };
  }, [currentResponse, currentSource]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    
    // Tambahkan pesan pengguna ke daftar pesan
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setCurrentResponse("");
    setCurrentSource(null);
    setLoading(true);
    socket.emit("generate", prompt);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(()=>{
    console.log(currentSource)
  },[currentSource])

  return (
    <div className="flex flex-col h-[90vh] max-w-4xl mx-auto w-full rounded-xl overflow-hidden">
      {messages.length === 0 ? (
        // Tampilan awal saat belum ada chat
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center flex-grow p-6"
        >
          <div className="w-full max-w-4xl p-8 bg-white rounded-2xl">
            <div className="flex items-center justify-center mb-6">
            </div>
            <h1 className="text-3xl font-bold text-center mb-10">Tanyakan Materi</h1>
            <div className="bg-gray-200 flex flex-col items-end rounded-xl p-4">
              <textarea
                ref={textareaRef1}
                className="w-full border-2 bg-transparent rounded-xl outline-none border-transparent transition-all resize-none overflow-hidden"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  autoResizeTextarea(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tulis pertanyaan Anda di sini..."
                draggable={false}
                rows={1}
              />
              <button
                className="bg-gradient-to-r bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                onClick={handleSend}
                disabled={loading}
              >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                </span>
              ) : (
                  <FaArrowUp size={15}/>
              )}
            </button>
            </div>
          </div>
        </motion.div>
      ) : (
        // Tampilan setelah chat dimulai
        <div className="flex flex-col h-full">
          {/* Area chat */}
          <div className="flex-grow overflow-y-auto p-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 ${
                    message.role === "user" ? "flex justify-end" : "flex justify-start"
                  }`}
                >
                  <div
                    className={`max-w-full p-4 rounded-2xl${
                      message.role === "user"
                        ? "bg-gray-200"
                        : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center mb-2">
                        <div className="rounded-full flex items-center justify-center mr-2">
                          <FaRobot size={15}/>
                        </div>
                        <span className="text-xs font-medium text-gray-500">Combot</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{message.content}</p>
                    {currentSource && message.role === "assistant" && (
                      <div className="mt-3 pt-2 border-t border-gray-300">
                        <Link
                          href={currentSource.url}
                          className="inline-flex items-center px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          target="_blank"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          {currentSource.title}
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="max-w-[80%] p-4 rounded-2xl bg-white border border-gray-100">
                    <div className="flex items-center mb-2">
                      <div className="rounded-full flex items-center justify-center mr-2">
                        <FaRobot size={15}/>
                      </div>
                      <span className="text-xs font-medium text-gray-500">Combot</span>
                    </div>
                    {currentResponse ? (
                      <p className="whitespace-pre-line">{currentResponse}</p>
                    ) : (
                      <div className="flex space-x-2 py-2">
                        <div className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-black animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    )}
                    {currentSource && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <Link
                          href={currentSource.url}
                          className="inline-flex items-center px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          target="_blank"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          {currentSource.title}
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Area input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-end bg-gray-200 rounded-xl p-2">
              <textarea
                ref={textareaRef2}
                className="flex-grow p-3 bg-transparent border-0 focus:outline-none focus:ring-0 resize-none overflow-hidden"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  autoResizeTextarea(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tulis pesan Anda..."
                rows={1}
              />
              <button
                className="ml-2 p-3 bg-gradient-to-r bg-red-600 text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center h-6 w-6">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  </span>
                ) : (
                  <FaArrowUp size={15}/>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
