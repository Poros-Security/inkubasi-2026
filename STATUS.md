# Status konversi — Inkubasi POROS 2026

Sumber: 24 repo di `github.com/inkubasi-poros-2026` (di-clone ke `../inkubasi-2026`).
**21 challenge** terkonversi, **3 dilewati**.

Semua `challenge.yml` lolos validasi skema (field wajib + tipe + blok container).

## Challenge

| Kategori | Nama | Tipe | Masih perlu |
|---|---|---|---|
| Crypto | Shannons Secret | StaticAttachment | — |
| Crypto | see the unforseen | StaticContainer | — |
| Forensics | Go, Go, Mun! | StaticAttachment | lampiran |
| Forensics | Iseng | StaticContainer | flag, deskripsi |
| Forensics | The Last Melody | StaticAttachment | — |
| Forensics | drag path | StaticAttachment | — |
| Forensics | ey dih es | StaticContainer | — |
| Forensics | insider | StaticContainer | — |
| Forensics | thr | StaticContainer | — |
| Misc | penjaruy | StaticContainer | — |
| Misc | penjaruyV2 | StaticContainer | — |
| OSINT | Admin Lapar | StaticAttachment | — |
| OSINT | Thing of Eternity | StaticAttachment | lampiran |
| OSINT | netops | StaticContainer | author, deskripsi |
| Pwn | git gud | StaticContainer | author, deskripsi |
| Reverse | mbg (inkubasi) | StaticContainer | — |
| Web | AiArt | StaticContainer | deskripsi |
| Web | F1 | StaticContainer | flag, author, deskripsi |
| Web | gapura | StaticContainer | — |
| Web | slopchat | StaticContainer | author, deskripsi |
| Web | statement | StaticContainer | author, deskripsi |

## Dilewati (repo & README sama-sama kosong)

- `Crypto-2byte-FANS-CLUB` — tidak ada file apa pun dan README tanpa deskripsi/flag
- `Reverse---PorosChat` — tidak ada file apa pun dan README tanpa deskripsi/flag
- `web-aldis-burger` — tidak ada file apa pun dan README tanpa deskripsi/flag

## Yang masih harus dikerjakan manual

1. **Flag belum ketemu** — hanya `Web/f1`. Tidak ada di README
   maupun di file mana pun; harus ditanya ke author.
2. **Lampiran hilang** — `Forensics/go-go-mun` deskripsinya menunjuk ke arsip di
   Google Drive (ada SHA256 + password arsip di README), dan `OSINT/thing-of-eternity`
   memang challenge tanpa lampiran. Yang go-go-mun perlu diunduh lalu ditaruh di `dist/`.
3. **`exposePort` tebakan** — challenge yang ditandai *cek port* tidak punya
   `EXPOSE` di Dockerfile maupun mapping di compose, jadi diisi 1337. Wajib dicek.
4. **Semua container bertipe `StaticContainer`** — flag-nya statis, dipanggang di
   dalam image. Kalau mau flag per-tim (`[TEAM_HASH]`), tiap challenge harus diubah
   dulu supaya membaca `GZCTF_FLAG` saat start, baru tipenya dinaikkan ke
   `DynamicContainer`. Lihat `codex-2025-chall` sebagai contoh yang sudah jadi.
5. **Tanggal event** di `events/inkubasi-2026/.gzevent` masih placeholder.
6. **`reverse-mbg` dinamai `mbg (inkubasi)`** supaya tidak bentrok dengan `mbg`
   yang sudah ada di game 5 server produksi.
