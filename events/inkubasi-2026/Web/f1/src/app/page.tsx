"use client"; 
import { useState } from "react"; 
import { submitName } from "./actions"; 

export default function Home() { 
  const [res, setRes] = useState("System is running securely in production mode."); 

  async function handleSubmit() { 
    try {
      const r = await fetch("/api/serverFunction", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ name: "Guest" }) 
      }); 
      
      if (!r.ok) {
        setRes(`Error: ${r.status} ${r.statusText}`);
        return;
      }
      setRes(JSON.stringify(await r.json(), null, 2)); 
    } catch (err: any) {
      setRes(String(err));
    }
  } 

  // Fungsi rahasia tetap ada untuk solver
  async function handleDirectSubmit() {
    try {
      const result = await submitName("Admin");
      setRes(JSON.stringify(result, null, 2));
    } catch (err: any) {
      setRes(String(err));
    }
  }

  return (
    <main style={{ padding: 40, fontFamily: "monospace", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Secure Portal v1.0.0</h2>
      <p style={{ color: "#666" }}>
        Sistem ini menggunakan arsitektur Next.js 15 terbaru. Semua *action* dijalankan secara aman di sisi server.
      </p>
      
      <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <p style={{ margin: "0 0 10px 0" }}><strong>Test Connection:</strong></p>
        <button 
          onClick={handleSubmit} 
          style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px" }}
        >
          Ping Server Action
        </button>
      </div>

      <button
        onClick={handleDirectSubmit}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          marginRight: 10,
          background: "#ffd6d6",
          visibility: "hidden",
          position: "absolute",
          left: "-9999px"
        }}
        aria-hidden="true"
      >
        [Debug] Direct Call
      </button>

      <pre style={{ marginTop: 20, background: "#1e1e1e", color: "#d4d4d4", padding: "15px", borderRadius: 5, overflowX: "auto" }}>
        {res}
      </pre>

      <p style={{ marginTop: "40px", fontSize: "12px", color: "#999", textAlign: "center" }}>
        <em>Need documentation or backend logs? Press F1 for help.</em>
      </p>
    </main>
  ); 
}
