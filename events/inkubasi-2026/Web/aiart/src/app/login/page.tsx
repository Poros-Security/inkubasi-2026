"use client";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secretNote, setSecretNote] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setSecretNote(data.secretNote);
      setError("");
    } else {
      setError(data.error);
    }
  };

  if (secretNote) {
    const lines = secretNote.split('\n').filter(line => line.trim() !== '');
    const header = lines[0]; 
    
    const notesList = lines.slice(1).map(line => {
      const match = line.match(/^\d+\.\s+\[(.*?)\]\s+(.*)$/);
      if (match) {
        return { title: match[1], content: match[2] };
      }
      return { title: "Catatan Tambahan", content: line }; 
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-[#0a0a0a]">
        <div className="max-w-6xl w-full">
          {/* Header Dashboard */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-black mb-4 text-[#e2a8ff] tracking-widest uppercase shadow-black drop-shadow-lg">
              {header}
            </h1>
            <p className="text-green-400 font-mono text-sm border border-green-900/50 bg-green-900/20 inline-block px-5 py-2 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.1)]">
              [✓] Akses terverifikasi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
            {notesList.map((note, index) => (
              <div 
                key={index} 
                className="bg-[#121212] border border-gray-800 rounded-xl p-6 relative group hover:border-gray-600 transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(226,168,255,0.05)] flex flex-col"
              >
             
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e2a8ff] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                
                <h3 className="text-[#e2a8ff] font-bold text-lg mb-4 flex items-center gap-3 border-b border-gray-800/80 pb-4">
                  <span className="text-xs bg-black border border-gray-700 text-gray-400 px-2 py-1 rounded font-mono shadow-inner">
                    0{index + 1}
                  </span>
                  <span className="tracking-wide">{note.title}</span>
                </h3>
           
                <div className="flex-grow">
                  <p className="text-gray-400 font-mono text-sm leading-relaxed text-justify">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-100 relative overflow-hidden">
        {/* Dekorasi kecil di form login */}
        <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
        
        <h2 className="text-3xl font-black mb-2 text-center tracking-tighter">RESTRICTED</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Login khusus Kurator Utama</p>
        
        {error && <p className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100 animate-pulse">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Username</label>
          <input 
            type="text" 
            className="w-full border-2 border-gray-200 p-3 rounded-xl outline-none focus:border-black transition-colors"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
          <input 
            type="password" 
            className="w-full border-2 border-gray-200 p-3 rounded-xl outline-none focus:border-black transition-colors"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-300 active:scale-95">
          Akses Galeri
        </button>
      </form>
    </div>
  );
}
