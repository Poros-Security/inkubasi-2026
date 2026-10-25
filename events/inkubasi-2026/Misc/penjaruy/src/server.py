#!/usr/bin/env python3
import os
import socketserver

HOST = os.getenv("CTF_HOST", "0.0.0.0")
PORT = int(os.getenv("CTF_PORT", "7771"))

BANNER = """
██████╗ ███████╗███╗   ██╗     ██╗ █████╗ ██████╗ ██╗   ██╗██╗   ██╗
██╔══██╗██╔════╝████╗  ██║     ██║██╔══██╗██╔══██╗██║   ██║╚██╗ ██╔╝
██████╔╝█████╗  ██╔██╗ ██║     ██║███████║██████╔╝██║   ██║ ╚████╔╝
██╔═══╝ ██╔══╝  ██║╚██╗██║██   ██║██╔══██║██╔══██╗██║   ██║  ╚██╔╝
██║     ███████╗██║ ╚████║╚█████╔╝██║  ██║██║  ██║╚██████╔╝   ██║
╚═╝     ╚══════╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝
"""

BLOCKED = ["import", "exec", "eval", "open", "os", "sys", "subprocess",
           "builtins", "__import__", "system", "popen", "read", "write",
           "flag", "cat", "breakpoint", "input", "globals", "locals", "vars"]

def check(code):
    for word in BLOCKED:
        if word in code.lower():
            return False, word
    return True, None

class Handler(socketserver.BaseRequestHandler):
    def send(self, msg):
        self.request.sendall(msg.encode())

    def recv(self):
        self.request.settimeout(30)
        return self.request.recv(4096).decode().strip()

    def handle(self):
        self.send(BANNER)
        self.send("bantu bigmo bebas dari penjaruy biar bisa streaming lg\n\n")

        while True:
            self.send("bigmo> ")
            try:
                code = self.recv()
            except Exception:
                break

            if not code:
                continue

            allowed, word = check(code)
            if not allowed:
                self.send(f"bigmo no no yah ga boleh ngomong '{word}'\n")
                continue

            try:
                self.send(str(eval(code, {"__builtins__": __builtins__})) + "\n")
            except Exception as e:
                self.send(f"Error: {e}\n")

class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == "__main__":
    with Server((HOST, PORT), Handler) as s:
        print(f"[*] Running on {HOST}:{PORT}")
        s.serve_forever()
