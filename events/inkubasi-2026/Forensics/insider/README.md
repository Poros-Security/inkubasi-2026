# insider
> Category: Forensics<br>
> Author: [unlikeneptune](https://github.com/unlikeneptunev)

## Description
A serious alert went off on one of the internal servers of Tracen Academy's IT Division. The security team was able to record the network traffic while the incident was happening. 

Early analysis indicates that either a compromised internal device or a rogue employee might have tried to access another host on the same network without permission, and they might have actually succeeded. 

As a DFIR analyst, your job is to look into the captured traffic, piece together the timeline of the attack, and find out what transpired after the attacker established a presence.

`nc 10.34.9.100 6741`

## PoC
## Gambaran Umum

Peserta diberikan sebuah file capture jaringan (`traffic.pcap`). Skenarionya adalah serangan insider di jaringan internal Tracen Academy IT Division, di mana sebuah perangkat internal melakukan SSH brute force ke host lain, berhasil masuk, lalu men-deploy malware yang melakukan C2 beaconing. Peserta harus menjawab tujuh pertanyaan investigatif secara berurutan untuk mendapatkan flag.

---

## Langkah Penyelesaian

### 1. Identifikasi IP Attacker dan Victim

Buka `traffic.pcap` di Wireshark, lalu pergi ke **Statistics > Endpoints > IPv4**.

Akan terlihat dua IP dengan volume traffic dominan yang saling bertukar packet dalam jumlah besar. IP dengan Tx Packets tinggi ke port 22 adalah attacker, sedangkan yang menerima adalah victim.

```
Attacker : 192.168.92.128
Victim   : 192.168.92.130
```

### 2. Waktu Brute Force Dimulai

Pastikan Wireshark menampilkan absolute timestamp via **View > Time Display Format > Date and Time of Day**.

Filter SSH traffic:

```
ssh
```

Catat timestamp packet SSH pertama.

```
2026-03-11 18:21:24
```

### 3. Durasi Brute Force

Masih dengan filter `ssh`, pergi ke packet SSH terakhir dan catat timestampnya.

```
Selesai : 2026-03-11 18:22:12
Durasi  : 48 detik
```

### 4. Port C2 Beaconing

Filter untuk mengisolasi traffic non-SSH:

```
tcp.port == 4444
```

Destination port yang dipakai malware untuk beacon ke C2 server adalah `4444`.

### 5. Waktu Beacon Pertama

Masih dengan filter `tcp.port == 4444`, catat timestamp packet pertama yang muncul.

```
2026-03-11 19:08:56
```

### 6. Kredensial di Payload Beacon

Klik kanan salah satu packet hasil filter `tcp.port == 4444`, lalu pilih **Follow > TCP Stream**.

Akan terlihat payload plaintext berisi kredensial yang dikirim malware ke C2 server:

```
BEACON|user=ElNumeroUno|pass=verysecurepassword2026
```

Jawaban dalam format `username:password`:

```
ElNumeroUno:verysecurepassword2026
```

---

## Ringkasan Jawaban

| No | Pertanyaan | Jawaban |
|----|-----------|---------|
| 1 | IP attacker | `192.168.92.128` |
| 2 | IP victim | `192.168.92.130` |
| 3 | Waktu brute force dimulai | `2026-03-11 18:21:24` |
| 4 | Durasi brute force (detik) | `48` |
| 5 | Port C2 beacon | `4444` |
| 6 | Waktu beacon pertama | `2026-03-11 19:08:56` |
| 7 | Kredensial dari payload beacon | `ElNumeroUno:verysecurepassword2026` |

## Flag
```
PorosCTF{1NGiN_m3Nj4Di_bLUE_tE4M_N4mUn_en9g4n_M3mbACa_tRaFfIC}
```

## Hints
