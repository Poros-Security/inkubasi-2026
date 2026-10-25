#!/usr/bin/env python3
import os
import socketserver

HOST = os.getenv("CTF_HOST")
PORT = int(os.getenv("CTF_PORT"))

BANNER = """
███╗   ██╗███████╗████████╗ ██████╗ ██████╗ ███████╗
████╗  ██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
██╔██╗ ██║█████╗     ██║   ██║   ██║██████╔╝███████╗
██║╚██╗██║██╔══╝     ██║   ██║   ██║██╔═══╝ ╚════██║
██║ ╚████║███████╗   ██║   ╚██████╔╝██║     ███████║
╚═╝  ╚═══╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚══════╝
"""

QUESTIONS = [
    {
        "num": 1,
        "question": "What's the public IP of the website?",
        "format": "x.x.x.x",
        "answer": "129.226.4.167",
    },
    {
        "num": 2,
        "question": "What's the AS number of the website?",
        "format": "ASxxxxxxxx",
        "answer": "AS132203",
    },
    {
        "num": 3,
        "question": "What's the AS name of the website?",
        "format": "Gedung Fakultas Ilmu Komputer",
        "answer": "Tencent Building Kejizhongyi Avenue",
    },
    {
        "num": 4,
        "question": "What's the fingerprint key SSH (ECDSA) of the website?",
        "format": "1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
        "answer": "603f888e8eeb7048a5d32d0e61e1cd1d27b5990ab8377a58b9349bb0536dab79",
    },
    
    {
        "num": 5,
        "question": "What's the others subdomain of the website?",
        "format": "subdomain.example.com",
        "answer": "go.zenc.cc",
    },
    {
        "num": 6,
        "question": "Who is the real name of website's creator?",
        "format": "John Doe",
        "answer": "Abi Abdillah",
    },
    {
        "num": 7,
        "question": "What's the creator Twitter/X username?",
        "format": "@username",
        "answer": "@zenCipher_",
    },
    {
        "num": 8,
        "question": "Which city is the creator from?",
        "format": "Epstein Island",
        "answer": "South Tangerang",
    },
    {
        "num": 9,
        "question": "What's the creator's current GPA?",
        "format": "x.xx",
        "answer": "3.89",
    }
]

FLAG = "PorosCTF{doksing_dikit_ketua_kortim_poros_2026}"


class Handler(socketserver.BaseRequestHandler):
    def handle(self):
        ip = self.client_address[0]
        self.request.sendall(BANNER.encode())
        total = len(QUESTIONS)
        correct_answers = 0
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
            if data.lower() == "exit":
                self.request.sendall(b"\nBye.\n")
                return
            if data.lower() != q["answer"].lower():
                self.request.sendall(b"[-] Wrong\n\n")
                continue

            correct_answers += 1
            self.request.sendall(b"[+] Correct\n\n")

        if correct_answers == total:
            self.request.sendall(f"\n  FLAG: {FLAG}\n\n".encode())
            return

        self.request.sendall(b"\nDone.\n\n")

class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == "__main__":
    with Server((HOST, PORT), Handler) as s:
        print(f"[*] Running on {HOST}:{PORT}", flush=True)
        s.serve_forever()