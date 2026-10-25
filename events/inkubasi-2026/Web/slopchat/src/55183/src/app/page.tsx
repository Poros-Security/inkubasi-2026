'use client';
import { useState, useEffect, useRef } from 'react';
import { db, Message } from '../lib/db';
import { sendMessage, getChatHistory, downloadServerLog } from '../actions/chat';

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [lastResponses, setLastResponses] = useState<number[]>([]); 

  // Modals state
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [logData, setLogData] = useState<string>('');

  const johnSmithResponses = [
    "Our encryption is mathematically unbreakable. You're wasting your time.",
    "I wrote the crypto implementation myself. It's flawless.",
    "Are you still trying? The system is bulletproof.",
    "We don't do bug bounties because there are no bugs. Period.",
    "I'm currently busy ignoring Jira tickets. What do you want?",
    "Your attempts are logging directly to /dev/null.",
    "Even if you had the server access, you wouldn't crack the vault.",
    "Military-grade security isn't just a buzzword for us. It's a guarantee.",
    "Stop messaging me, I'm preparing my keynote for the cybersecurity conference.",
    "We removed all source code from production. Good luck finding anything.",
    "I've been coding since you were in diapers. Trust the architecture.",
    "The infrastructure is impenetrable. Focus on something else.",
    "Do you even know how block ciphers work? I didn't think so.",
    "100% privacy guaranteed. We don't make mistakes.",
    "Did you really think a simple payload would work here? Cute.",
    "My architecture has been audited by the best. You are not the best.",
    "Please stop spamming the chat. The firewall is getting bored.",
    "Our vault is a mathematical fortress. You are throwing pebbles at it.",
    "I designed this system to keep the alphabet agencies out. You think you have a chance?",
    "The keys are perfectly safe. I made sure of it personally.",
    "You're trying to find a needle in a haystack, but I already burned the haystack.",
    "Go play with some vulnerable PHP scripts. This is Enterprise software.",
    "I could give you the database dump and you still wouldn't be able to read it.",
    "We use a proprietary methodology. It's called 'being smarter than you'.",
    "If you find a bug, I'll eat my keyboard. Spoiler: I won't have to.",
    "You are triggering zero alerts because your attacks are meaningless.",
    "Security by design. Not that you would understand the concept.",
    "I'm not arrogant, I'm just mathematically proven to be right.",
    "Every message you send just confirms how secure my system is.",
    "Are you done yet? Some of us have real engineering to do.",
    "I deployed this on Friday afternoon and slept perfectly fine. That's how secure it is."
  ];

  // Helper function: Simpan pesan ke LocalStorage agar abadi di browser peserta
  const saveToLocalHistory = (newMsg: Message) => {
    const storedHistory = localStorage.getItem('slopchat_local_history');
    const history: Message[] = storedHistory ? JSON.parse(storedHistory) : [];
    history.push(newMsg);
    localStorage.setItem('slopchat_local_history', JSON.stringify(history));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchMsgs = async () => {
      // 1. Ambil 6 pesan awal dari Server (Read-Only DB)
      const serverMsgs = await getChatHistory(1);
      
      // 2. Ambil SEMUA riwayat lokal (Pesan User + Balasan John Smith)
      const storedHistory = localStorage.getItem('slopchat_local_history');
      const localMsgs: Message[] = storedHistory ? JSON.parse(storedHistory) : [];

      // 3. Gabungkan
      const combinedMsgs = [...serverMsgs, ...localMsgs].sort((a, b) => a.id - b.id);
      setMessages(combinedMsgs);
    };
    fetchMsgs();
  }, []);

  const handleSend = async (formData: FormData) => {
    const text = formData.get('message') as string;
    if (!text || text.trim() === '') return;

    const timestamp = Date.now();
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Buat objek pesan User
    const newUserMessage: Message = { id: timestamp, sender: 'me', text, time: timeString };
    
    // 2. Update UI & Simpan ke LocalStorage
    setMessages(prev => [...prev, newUserMessage]);
    saveToLocalHistory(newUserMessage); // <-- FIX: User chat sekarang disimpan!
    
    formRef.current?.reset();

    // 3. Kirim ke Server (Hanya untuk memicu fungsi RSC/CVE, database server akan mengabaikannya)
    await sendMessage(formData);

    // 4. Memicu respons John Smith
    onUserMessage();
  };

  const onUserMessage = () => {
    setIsTyping(true);
    const typingDelay = Math.random() * 2000 + 1500;

    setTimeout(() => {
      let responseIndex: number;
      do {
        responseIndex = Math.floor(Math.random() * johnSmithResponses.length);
      } while (lastResponses.includes(responseIndex));

      setLastResponses(prev => [responseIndex, ...prev.slice(0, 3)]);

      const replyTimestamp = Date.now();
      const newResponse: Message = { 
        id: replyTimestamp, 
        sender: 'them', 
        text: johnSmithResponses[responseIndex], 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      
      // Update UI & Simpan balasan bot ke LocalStorage
      setMessages(prev => [...prev, newResponse]);
      saveToLocalHistory(newResponse); // <-- FIX: Bot chat juga disimpan di tempat yang sama
      
      setIsTyping(false);
    }, typingDelay);
  };

  const handleDownloadLog = async () => {
    const data = await downloadServerLog('server.log');
    setLogData(data);
    setShowLogModal(true);
  };

  const Modal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}>
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#111827' }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✖</button>
          </div>
          <div style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '14px' }}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: '"Inter", "Segoe UI", sans-serif', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden' }}>
        
        {/* SIDEBAR */}
        <div style={{ width: '320px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
          
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundImage: 'url("https://ui-avatars.com/api/?name=My+Profile&background=6366f1&color=fff")', backgroundSize: 'cover', marginRight: '12px' }}></div>
              <strong style={{ color: '#111827', fontSize: '16px' }}>My Profile</strong>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowSettings(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }} title="Settings">⚙️</button>
              <button onClick={handleDownloadLog} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }} title="Diagnostic Logs">📋</button>
            </div>
          </div>

          <div style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '20px', padding: '8px 15px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af', marginRight: '10px' }}>🔍</span>
              <input type="text" placeholder="Search chats..." style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '14px' }} />
            </div>
          </div>

          {/* LORE FAKE CHATS */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', padding: '15px 20px', backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', cursor: 'pointer', transition: 'background 0.2s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundImage: 'url("https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff")', backgroundSize: 'cover', marginRight: '15px' }}></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: '#111827', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>John Smith</strong>
                  <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '500' }}>18:03</span>
                </div>
                <div style={{ color: '#4b5563', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }}>Let's meet at the coffee shop.</div>
              </div>
            </div>

            <div style={{ display: 'flex', padding: '15px 20px', cursor: 'not-allowed', transition: 'background 0.2s', borderBottom: '1px solid #f3f4f6' }} onClick={() => alert("Chat locked. Clearance level insufficient.")}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundImage: 'url("https://ui-avatars.com/api/?name=Dave+(Intern)&background=f59e0b&color=fff")', backgroundSize: 'cover', marginRight: '15px', opacity: 0.7 }}></div>
              <div style={{ flex: 1, minWidth: 0, opacity: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: '#111827', fontSize: '15px' }}>Dave (Intern)</strong>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>Yesterday</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>I accidentally deleted the staging database again... oops! 😅</div>
              </div>
            </div>

            <div style={{ display: 'flex', padding: '15px 20px', cursor: 'not-allowed', transition: 'background 0.2s', borderBottom: '1px solid #f3f4f6' }} onClick={() => alert("Chat locked. Clearance level insufficient.")}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundImage: 'url("https://ui-avatars.com/api/?name=Sarah+(HR)&background=ef4444&color=fff")', backgroundSize: 'cover', marginRight: '15px', opacity: 0.7 }}></div>
              <div style={{ flex: 1, minWidth: 0, opacity: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: '#111827', fontSize: '15px' }}>Sarah (HR)</strong>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>Tuesday</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Can you please tell John to stop bringing his dog to the server room?</div>
              </div>
            </div>

            <div style={{ display: 'flex', padding: '15px 20px', cursor: 'not-allowed', transition: 'background 0.2s' }} onClick={() => alert("Chat locked.")}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundImage: 'url("https://ui-avatars.com/api/?name=Slopchat+Official&background=6366f1&color=fff")', backgroundSize: 'cover', marginRight: '15px', opacity: 0.7 }}></div>
              <div style={{ flex: 1, minWidth: 0, opacity: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: '#111827', fontSize: '15px' }}>Slopchat Official ✓</strong>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>Last Week</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>We just raised $50M in Series B! Security remains our #1 priority. 🚀</div>
              </div>
            </div>

          </div>
          
          <div style={{ padding: '10px', textAlign: 'center', fontSize: '11px', color: '#9ca3af', borderTop: '1px solid #e5e7eb' }}>
            Slopchat™ Enterprise v1.0.0
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#efeae2', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '15px 25px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', zIndex: 10 }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundImage: 'url("https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff")', backgroundSize: 'cover', marginRight: '15px' }}></div>
            <div>
              <strong style={{ color: '#111827', display: 'block', fontSize: '16px' }}>John Smith</strong>
              <span style={{ fontSize: '12px', color: '#10b981' }}>● Online</span>
            </div>
          </div>

          <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ alignSelf: 'center', backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '10px 20px', borderRadius: '8px', fontSize: '12px', color: '#92400e', marginBottom: '25px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '80%' }}>
              🔒 Messages are end-to-end encrypted. No one outside of this chat can read them. <br/>
              <span onClick={() => setShowWhitepaper(true)} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px', display: 'inline-block' }}>
                Learn more
              </span>
            </div>
            
            {messages.map((msg, idx) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={idx} style={{ 
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  backgroundColor: isMe ? '#d1fae5' : '#ffffff',
                  color: '#1f2937',
                  padding: '10px 16px', 
                  borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0', 
                  marginBottom: '12px', 
                  maxWidth: '65%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)', 
                  display: 'flex', 
                  flexDirection: 'column'
                }}>
                  <span style={{ fontSize: '14.5px', lineHeight: '1.4' }}>{msg.text}</span>
                  <span style={{ fontSize: '10px', color: '#6b7280', alignSelf: 'flex-end', marginTop: '6px' }}>{msg.time} {isMe && '✓✓'}</span>
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', color: '#6b7280', padding: '10px 16px', borderRadius: '12px 12px 12px 0', marginBottom: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', fontStyle: 'italic', fontSize: '13px' }}>
                John Smith is typing... ✍️
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '15px 25px', display: 'flex', alignItems: 'center', borderTop: '1px solid #e5e7eb' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9ca3af', cursor: 'not-allowed', marginRight: '15px' }} onClick={() => alert("Attachment feature is disabled for security reasons.")}>📎</button>
            <form ref={formRef} action={handleSend} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <input 
                type="text" 
                name="message" 
                placeholder="Type your message..." 
                style={{ flex: 1, padding: '12px 20px', borderRadius: '24px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none', fontSize: '15px', transition: 'border-color 0.2s' }} 
                autoComplete="off"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button type="submit" style={{ marginLeft: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)', transition: 'background 0.2s' }}>
                ➤
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <Modal isOpen={showWhitepaper} onClose={() => setShowWhitepaper(false)} title="Security Whitepaper">
        <p><strong>Slopchat Protocol v1.0</strong></p>
        <p>All communications on our platform are secured with military-grade <code>AES-256-CBC</code> encryption algorithms.</p>
        <p>Our infrastructure ensures that master keys are securely rotated and never stored in plain text alongside user data.</p>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>*We take privacy seriously. Trust us.</p>
      </Modal>

      <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title="System Diagnostics">
        <div style={{ backgroundColor: '#1f2937', color: '#10b981', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
          {logData || "Fetching logs..."}
        </div>
        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '10px' }}>Internal diagnostic tool. Do not share these logs.</p>
      </Modal>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Account Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', cursor: 'not-allowed' }}>Edit Profile (Disabled)</button>
          <button style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', cursor: 'not-allowed' }}>Privacy Controls (Disabled)</button>
          <button style={{ padding: '10px', borderRadius: '6px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }} onClick={() => setShowSettings(false)}>Close</button>
        </div>
      </Modal>

    </div>
  );
}
