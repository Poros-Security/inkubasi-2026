import socket
import threading

HOST = "0.0.0.0"
PORT = 6767

FLAG = "PorosCTF{S3puH_BlU3_T34m_d4n_N3tw0rk_4n4lys1s_Harus_Join_ICN_Sih_Ini_ditunggu_yah_tahun_ini}"

questions = [
    {
        "question": "1) IP Victim? contoh: fe80::3485:7fff:fef7:b023 (jika IPv6), 192.168.0.0 (jika IPv4) \n> ",
        "answer": "10.0.0.42"
    },
    {
        "question": "2) Jenis Serangan apakah ini? (Kata pertama huruf kapital) ex: Man In The Middle \n",
        "answer": "Smurf Attack"
    },
    {
        "question": "3) Ada berapa jumlah IP yang membalas broadcast? ex: Delapan Puluh \n",
        "answer": "Empat Puluh"
    },
    {
        "question": "4) Pada layer TCP/IP berapa serangan ini bekerja? ex: Sepuluh \n",
        "answer": "Tiga"
    },
    {
        "question": "5) Attacker mengirimkan apa ketika menyamar menjadi IP victim? (Kata pertama huruf kapital) ex: Apel \n",
        "answer": "Broadcast"
    },
    {
        "question": "6) IP Penyerang? contoh: fe80::3485:7fff:fef7:b023 (jika IPv6), 192.168.0.0 (jika IPv4) \n",
        "answer": "10.0.0.34"
    }
]

def handle_client(conn, addr):
    print(f"[+] Client connected: {addr}")
    conn.send(b"=== Welcome to broKen Challenge ===\n")
    conn.send(b"Jawab 6 pertanyaan dengan benar dan harus berdasar ya, utk chall ini dinilai WU-nya\n\n")

    for q in questions:
        try:
            conn.send(q["question"].encode())
            conn.settimeout(7)

            data = conn.recv(1024)

            if not data:
                break

            user_answer = data.decode().strip()

            if user_answer != q["answer"]:
                conn.send(b"Diteliti yah PCAP-nya.\n")
                conn.close()
                return

            conn.send(b"Benar!\n\n")

        except socket.timeout:
            conn.send(b"Waktu habis! Koneksi ditutup.\n")
            conn.close()
            print(f"[!] Client timeout: {addr}")
            return

        except Exception as e:
            print(f"[!] Error: {e}")
            conn.close()
            return

    conn.send(f"Udah jago nih baca PCAP:\n{FLAG}\n".encode())
    conn.close()
    print(f"[-] Client disconnected: {addr}")

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((HOST, PORT))
        s.listen(10)

        print(f"[+] Listening on port {PORT}...")

        while True:
            conn, addr = s.accept()
            thread = threading.Thread(target=handle_client, args=(conn, addr))
            thread.daemon = True
            thread.start()

if __name__ == "__main__":
    main()
