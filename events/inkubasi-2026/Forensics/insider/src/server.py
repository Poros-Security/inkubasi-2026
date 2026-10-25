#!/usr/bin/env python3
import os
import socketserver

HOST = os.getenv("CTF_HOST", "0.0.0.0")
PORT = int(os.getenv("CTF_PORT", "6741"))

BANNER = """
  ███                      ███      █████
 ▒▒▒                      ▒▒▒      ▒▒███
 ████  ████████    █████  ████   ███████   ██████  ████████
▒▒███ ▒▒███▒▒███  ███▒▒  ▒▒███  ███▒▒███  ███▒▒███▒▒███▒▒███
 ▒███  ▒███ ▒███ ▒▒█████  ▒███ ▒███ ▒███ ▒███████  ▒███ ▒▒▒
 ▒███  ▒███ ▒███  ▒▒▒▒███ ▒███ ▒███ ▒███ ▒███▒▒▒   ▒███
 █████ ████ █████ ██████  █████▒▒████████▒▒██████  █████
▒▒▒▒▒ ▒▒▒▒ ▒▒▒▒▒ ▒▒▒▒▒▒  ▒▒▒▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒  ▒▒▒▒▒

Category   : Forensics
Difficulty : Medium
Author     : unlikeneptune
"""

QUESTIONS = [
    {
        "num": 1,
        "question": "What is the IP address of the attacker?",
        "format": "x.x.x.x",
        "answer": "192.168.92.128",
    },
    {
        "num": 2,
        "question": "What is the IP address of the victim?",
        "format": "x.x.x.x",
        "answer": "192.168.92.130",
    },
    {
        "num": 3,
        "question": "What time did the brute force attack begin?",
        "format": "YYYY-MM-DD HH:MM:SS",
        "answer": "2026-03-11 18:21:24",
    },
    {
        "num": 4,
        "question": "How long did the brute force attack last, in seconds?",
        "format": "-",
        "answer": "48",
    },
    {
        "num": 5,
        "question": "After gaining access, the attacker deployed malware that communicated with a C2 server. What port did the malware use to beacon out?",
        "format": "-",
        "answer": "4444",
    },
    {
        "num": 6,
        "question": "What time was the first beacon sent?",
        "format": "YYYY-MM-DD HH:MM:SS",
        "answer": "2026-03-11 19:08:56",
    },
    {
        "num": 7,
        "question": "Analyze the beacon payload. What are the compromised credentials found in the beacon traffic?",
        "format": "username:password",
        "answer": "ElNumeroUno:verysecurepassword2026",
    },
]

FLAG = "PorosCTF{1NGiN_m3Nj4Di_bLUE_tE4M_N4mUn_en9g4n_M3mbACa_tRaFfIC}"


class Handler(socketserver.BaseRequestHandler):
    def handle(self):
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
                self.request.settimeout(30)
                data = self.request.recv(4096).decode().strip()
            except TimeoutError:
                self.request.sendall(b"\n[!] Time's up! Connection closed.\n")
                return
            except Exception:
                self.request.sendall(b"\n[!] Goodbye!\n")
                return
            if data.lower() == "exit":
                self.request.sendall(b"\n[!] Goodbye!\n")
                return
            if data != q["answer"]:
                self.request.sendall(b"[-] Wrong :(\n")
                return
            self.request.sendall(b"[+] Correct!\n\n")
        self.request.sendall(f"Congratulations! Here is your flag:\n{FLAG}\n".encode())


class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with Server((HOST, PORT), Handler) as s:
        print(f"[*] Running on {HOST}:{PORT}")
        s.serve_forever()
