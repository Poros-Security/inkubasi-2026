#!/usr/bin/env python3
import os
from datetime import datetime
import socketserver

HOST = os.getenv("CTF_HOST")
PORT = int(os.getenv("CTF_PORT"))

BANNER = """
=========================================================
          WELCOME TO THE POROS FORENSICS CHALLENGE!
=========================================================
"""

QUESTIONS = [
    {
        "num": 1,
        "question": "What's the victim's IP address?",
        "format": "xx.xx.xx.xx",
        "answer": "10.10.10.50",
    },
    {
        "num": 2,
        "question": "What's the attacker IP address?",
        "format": "xx.xx.xx.xx",
        "answer": "10.10.10.100",
    },
    {
        "num": 3,
        "question": "There are 3 tools that used by attacker, what are they? (order it alphabetically)",
        "format": "abc,def,ghi",
        "answer": "hping3,nmap,sqlmap",
    },
    {
        "num": 4,
        "question": "There is a vulnerable plugin exploited by the attacker, what's the name of the plugin?",
        "format": "lowercase-letters",
        "answer": "easy-quotes",
    },
    {
        "num": 5,
        "question": "What's the CVE ID of the vulnerable plugin?",
        "format": "CVE-XXXX-XXXX",
        "answer": "CVE-2025-26943",
    },
    {
        "num": 6,
        "question": "When exploitation of vulnerable plugin started?",
        "format": "DD/MM/YYYY HH:MM:SS",
        "answer": "12/03/2026 16:52:39",
    },
    {
        "num": 7,
        "question": "What's the username exfiltrated by the attacker?",
        "format": "-",
        "answer": "2byteFansClub",
    },
    {
        "num": 8,
        "question": "What's the password hash exfiltrated by the attacker?",
        "format": "$algorithm$hash",
        "answer": "$P$BDVrT8ijki8iH97aVCY25ZXJOSMtlL/",
    },
    {
        "num": 9,
        "question": "What's the password cracked by the attacker?",
        "format": "-",
        "answer": "dontkillmepleasexxx",
    },
    {
        "num": 10,
        "question": "When did the attacker successfully log in?",
        "format": "DD/MM/YYYY HH:MM:SS",
        "answer": "12/03/2026 16:56:00",
    },
]

FLAG = "PorosCTF{7bh_ini_ch411_d4p37_in5pir45i_k4r3n4_1i47_m0du1_pr4k7ikum_KI_TIF_73rim4k45ih_IC33N}"


class Handler(socketserver.BaseRequestHandler):
    def handle(self):
        ip = self.client_address[0]
        self.request.sendall(BANNER.encode())
        total = len(QUESTIONS)
        for q in QUESTIONS:
            self.request.sendall(
                f"---------------------------------------------------------\n"
                f"  Question {q['num']}/{total}\n"
                f"  {q['question']}\n"
                f"  Format: {q['format']}\n"
                f"---------------------------------------------------------\n"
                f">>> Answer: ".encode()
            )
            try:
                data = self.request.recv(4096).decode().strip()
            except Exception:
                return
            ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
            print(f"[LOG] [{ts}] {ip} entered: {data}", flush=True)
            if data.lower() == "exit":
                self.request.sendall(b"\n[!] Goodbye, investigator.\n")
                return
            if data.lower() != q["answer"].lower():
                self.request.sendall(b"[-] Wrong answer! Investigation failed.\n")
                return
            self.request.sendall(b"[+] Correct!\n\n")
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        print(f"[LOG] [{ts}] {ip} SOLVED", flush=True)
        self.request.sendall(f"\n  FLAG: {FLAG}\n\n".encode())

class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == "__main__":
    with Server((HOST, PORT), Handler) as s:
        print(f"[*] Running on {HOST}:{PORT}", flush=True)
        s.serve_forever()
