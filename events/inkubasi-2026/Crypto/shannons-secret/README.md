# Shannons Secret 
> Category: Crypto
> Author: RFB

## Description
Tahun 2031. Dunia kriptografi digemparkan oleh kemunculan seorang hacker misterius bernama Shannon.

Ia mengklaim telah menciptakan cipher sempurna terinspirasi dari teori information-theoretic security milik Claude Shannon.

“Tidak ada yang bisa membobol ini,” tulisnya di forum underground.

Namun agen intelijen berhasil mencegat dua transmisi terenkripsi yang dikirim Shannon dalam satu sesi menggunakan sistem buatannya sendiri.

Apakah cipher ini benar-benar sempurna?

Temukan kelemahannya dan ungkap pesan rahasianya.

## PoC
```
Step
1. Decode hint (base64) → dapat msg
2. Recover Key Stream dari msg 
3. Langsung decrypt aja setelah itu
```

## Flag
```
PorosCTF{m4nt4p_br0_b7w_9k_5U1I7k4n_y4?_h3h3}
```

## Hints
1. lihat code chall baik-baik
2. XOR
3. K = C ⊕ P → jadi P = ?