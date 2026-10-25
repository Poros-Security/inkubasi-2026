# The Last Melody
> Category: Forensic
> Author: FAZer0

## Description
Pada suatu hari, ada salah satu mahasiswa FILKOM angkatan kemarin yang nggak sengaja nemu file .zip di grup Line PKKMB dulu. Pas dicek, lagu "PUSPA" ini ukurannya agak mencurigakan, padahal kalau didengerin mah biasa aja. Kemudian mahasiswa itu ngide buat tanya ke kating angkatan 17 yang dulu upload filenya, terus dibales gini:

"Wah, nemu aja arsip itu! Dulu emang iseng gue modif dikit buat seru-seruan, eh ternyata sampai lulus nggak ada yang sadar. Coba deh lu ulik lagi, pasti ada yang janggal kok kalau teliti. Tapi hati-hati ya, jangan gampang percaya sama apa yang kelihatan di luar atau yang tiba-tiba muncul di akhir—bisa jadi itu cuma distraksi doang. Mending lu fokus cari pola yang konsisten di dalamnya. Good Luck yak"

Bisakah kamu mengungkap rahasia yang tersimpan di balik melodi terakhir ini?

## PoC
```
1. Peserta mungkin akan mengecek strings atau binwalk dan menemukan Fake Flag di akhir file (Append Data).
2. Mengecek exiftool mungkin akan menemukan pesan distraksi soal Spectrogram.
3. Peserta harus menyadari petunjuk "17" merujuk pada LSB Steganography dengan interval/step 17.
4. Menggunakan skrip Python untuk membaca bit ke-0 (LSB) dari setiap byte ke-17 pada data audio WAV.
5. Flag akan muncul dengan diawali marker START_FLAG{ dan diakhiri END_FLAG.
```

## Flag
```
PorosCTF{I75_m4_FIR57_cH411_15b_4nD_J4di_in937_P45_m4b4_d3h}
```

## Hints
1. Kalo udah masuk jangan lupa yang di luar sih kataku
2. Kalo udah bingung coba deh Liat Saja Besok (LSB) deh
3. Jalan tiap 17 dari START_FLAG{ dan diakhiri END_FLAG
