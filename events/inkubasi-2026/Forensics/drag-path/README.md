# drag path
> Category: forensic
> Author: 2byte

## Description
I dug my heels into the gravel, as evidence for you to unravel. A drag path, etched in the surface. Can you find me?

## PoC
1. buka .img di autopsy, ada deleted file `_ur.png` dan `move-on/_hredder`
2. extract keduanya
3. `_hredder` itu PyInstaller binary, extract pakai `pyinstxtractor` -> dapet `shredder.pyc`
4. decompile `.pyc` pakai `pylingual` -> source code obfuscated (21 layer `zlib -> base64 -> reverse`)
5. decode 21 layer -> dapet shredder source
6. reverse algorithm: cari trailer setelah PNG IEND (magic `\x13\x37\xCA\xFE`), parse offset table, byte-pair swap + reverse + XOR `gen_key(s,x,y)` -> restore pixel strips
7. build recovery script untuk `our.png`

## Flag
```
PorosCTF{0ur_m3m0ry_4r3_57i11_in_my_h34d}
```
