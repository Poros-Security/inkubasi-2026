# Go, Go, Mun!
> Category: Forensics<br>
> Author: [unlikeneptune](https://github.com/unlikeneptunev)

## Description
Have you ever pondered what your surroundings disclose to you?

URL: https://drive.google.com/file/d/14cI2bTRRgOPEETp9s4S4mk_a780E3RI7/view?usp=sharing
<br>SHA256 (archive): `bbf23284823c1b0a7213e7ed82032214c2ab05437a6a03f6cf94c59b8a723f7e`
<br>Archive password: `3915a0e02a8d52dd1b3bf4201adec68a`

**RESOURCES**:<br>
[Cheatsheet](https://github.com/unlikeneptunev/Volatility3-CheatSheet)
[Contoh soal](https://)

Author: **unlikeneptune**

## PoC
## Gambaran Umum

Peserta diberikan sebuah file memory dump Windows (`memory.raw`). Tujuannya adalah menemukan flag yang tersembunyi di dalam environment variable proses target `obmam.exe`, yang berjalan tepat di titik tengah antara waktu boot sistem dan waktu pengambilan dump.

---

## Langkah Penyelesaian

### 1. Identifikasi Informasi Sistem

```bash
vol -f "path/to/memory.raw" windows.info.Info
```

Catat nilai `SystemTime` sebagai waktu dump diambil.

```
SystemTime    YYYY-MM-DD HH:MM:02+00:00
```

### 2. Analisis Daftar Proses

```bash
vol -f "path/to/memory.raw" windows.pslist
```

Dari output, catat dua timestamp penting:

| Keterangan | Waktu |
|---|---|
| Boot time (CreateTime proses `System`) | `T0` |
| Dump time (dari `windows.info`) | `T1` |
| Titik tengah ideal | `T0 + (T1 - T0) / 2` |

Peserta yang jeli akan menyadari bahwa `obmam.exe` adalah satu-satunya proses non-sistem yang memiliki `CreateTime` paling mendekati titik tengah tersebut.

### 3. Periksa Cmdline (Hint)

```bash
vol -f "path/to/memory.raw" windows.cmdline --pid [PID obmam.exe]
```

Output:
```
obmam.exe --resolve=newfound_resolve_check_your_surroundings
```

Argument `--resolve` mengarahkan peserta untuk memeriksa lebih jauh atribut proses, khususnya environment variables.

### 4. Ekstrak Environment Variables

```bash
vol -f "path/to/memory.raw" windows.envars --pid [PID obmam.exe]
```

Output:
```
PID     Process Block   Variable        Value

3448    obmam.exe       0x111250        STAMINA_RECOVERED       UG9yb3NDVEZ7UmVjb3Zlcl9lbmR1cmFuY2VfYW5kX21vZGVyYXRlbHlfaW5jcmVhc2VfdmVsb2NpdHlfd2l0aF9uZXdmb3VuZF9yZXNvbHZlX3doZW5faW5fbWlkcGFja19hcm91bmRfaGFsZndheV90aHJvdWdoX3RoZV9yYWNlLn0=
3448    obmam.exe       0x111250        SPEED_BOOST     true
3448    obmam.exe       0x111250        PATH    C:\Windows\System32
```

`SPEED_BOOST=true` adalah red herring. `STAMINA_RECOVERED` berisi nilai base64.

### 5. Decode Flag

```bash
echo 'UG9yb3NDVEZ7UmVjb3Zlcl9lbmR1cmFuY2VfYW5kX21vZGVyYXRlbHlfaW5jcmVhc2VfdmVsb2NpdHlfd2l0aF9uZXdmb3VuZF9yZXNvbHZlX3doZW5faW5fbWlkcGFja19hcm91bmRfaGFsZndheTFocm91Z2hfdGhlX3JhY2UufQ=' | base64 -d
```

Output:
```
PorosCTF{Recover_endurance_and_moderately_increase_velocity_with_newfound_resolve_when_in_midpack_around_halfway_through_the_race.}
```
---

## Kesimpulan

| Langkah | Plugin |
|---|---|
| Cek waktu sistem | `windows.info` |
| Temukan proses target via timing | `windows.pslist` |
| Baca hint cmdline | `windows.cmdline` |
| Ekstrak env var | `windows.envars` |
| Decode base64 | - |

## Flag
```
PorosCTF{Recover_endurance_and_moderately_increase_velocity_with_newfound_resolve_when_in_midpack_around_halfway_through_the_race.}
```

## Hints
1. Timestamps are everything
