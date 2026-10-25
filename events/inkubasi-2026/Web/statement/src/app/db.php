<?php
function db_path(): string {
    return __DIR__ . "/data/notes.db";
}

function get_db(): PDO {
    static $db = null;
    if ($db !== null) {
        return $db;
    }

    $db_file = db_path();
    $first_run = !file_exists($db_file);

    $db = new PDO("sqlite:" . $db_file);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($first_run) {
        init_db($db);
    } else {
        ensure_schema($db);
    }

    return $db;
}

function has_column(PDO $db, string $table, string $column): bool {
    $stmt = $db->query("PRAGMA table_info($table)");
    $cols = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($cols as $c) {
        if (isset($c["name"]) && $c["name"] === $column) {
            return true;
        }
    }
    return false;
}

function ensure_schema(PDO $db): void {
    if (!has_column($db, "notes", "isHidden")) {
        $db->exec("ALTER TABLE notes ADD COLUMN isHidden INTEGER NOT NULL DEFAULT 0");
    }
    $db->exec("UPDATE notes SET isHidden = CASE WHEN id > 50 THEN 1 WHEN ((id * 37 + 11) % 5) < 3 THEN 1 ELSE 0 END");
}

function hidden_seed(int $id): bool {
    if ($id > 50) {
        return true;
    }
    // Deterministic spread for 1-50
    return ($id * 37 + 11) % 5 < 3;
}

function init_db(PDO $db): void {
    $db->exec("
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    ");

    $db->exec("
        CREATE TABLE notes (
            id INTEGER PRIMARY KEY,
            owner TEXT NOT NULL,
            content TEXT NOT NULL,
            isHidden INTEGER NOT NULL DEFAULT 0
        );
    ");

    $stmt = $db->prepare("INSERT INTO users (username, password) VALUES (:u, :p)");
    $stmt->execute([
        ":u" => "user",
        ":p" => password_hash("userpass", PASSWORD_BCRYPT),
    ]);

    // Admin account (not used for login in the challenge)
    $stmt->execute([
        ":u" => "admin",
        ":p" => password_hash("supersexniggercret", PASSWORD_BCRYPT),
    ]);

    $samples = [
        "belanja sayur di pasar",
        "jadwal praktikum jaringan",
        "ide nama project baru",
        "minum air jam tiga sore",
        "ngecek laptop yang panas",
        "rangkuman materi minggu ini",
        "pinjam buku perpustakaan",
        "coba resep ayam mentega",
        "backup file ke flashdisk",
        "pengen belajar docker",
        "deadline laporan jam sembilan",
        "temu dosen besok pagi",
        "perbaiki bug login",
        "list tugas semester",
        "ingat bayar listrik",
        "meeting komunitas jam tujuh",
        "nonton ulang materi",
        "kirim email ke admin",
        "catatan rapat departemen",
        "testing fitur baru",
        "beli kabel charger",
        "ide buat lomba ctf",
        "buat outline presentasi",
        "jadwal bimbingan skripsi",
        "cek nilai kuis",
        "baca artikel keamanan web",
        "patch dependency",
        "susun rencana liburan",
        "ingat ultah teman",
        "cicil tugas besar",
        "review PR di repo",
        "ingat kunci lab",
        "list belanja mingguan",
        "ganti password akun",
        "tes koneksi wifi",
        "nambah dokumentasi",
        "buat desain poster",
        "ngecek log server",
        "bikin catatan debugging",
        "update resume",
        "draft proposal proyek",
        "latihan soal crypto",
        "rapihin struktur folder",
        "cari template cv",
        "experiment query",
        "catat ide startup",
        "prepare bahan workshop",
        "nambah contoh soal",
        "pikirin nama tim",
        "schedule deploy",
        "rekap biaya",
        "cek tiket kereta",
        "buat checklist harian",
        "periksa baterai mouse",
        "ingat bawa jas hujan",
        "cuci jaket minggu ini",
        "beli tinta printer",
        "perbarui antivirus",
        "cek status beasiswa",
        "download dataset baru",
        "rapat panitia acara",
        "pindah file ke drive",
        "isi absen kelas",
        "bikin catatan rapat singkat",
        "kirim laporan ke mentor",
        "lihat jadwal ujian",
        "cek saldo ewallet",
        "bayar langganan musik",
        "hapus file duplikat",
        "rename folder proyek",
        "rapi kabel meja",
        "ganti wallpaper",
        "isi bensin besok",
        "cek info seminar",
        "siapkan pertanyaan dosen",
        "latihan presentasi",
        "buat flowchart tugas",
        "cari referensi jurnal",
        "bandingin dua library",
        "setup environment lokal",
        "update package lock",
        "baca doc API",
        "cek error di console",
        "kumpulin feedback user",
        "cek perangkat lab",
        "buat mindmap ide",
        "scan dokumen",
        "atur jadwal olahraga",
        "cek draft email",
        "temu kelompok tugas",
        "buat daftar prioritas",
        "beli botol minum",
        "cari tempat makan",
        "susun agenda mingguan",
        "backup foto lama",
        "hapus cache browser",
        "cek lampu kamar",
        "tes build sebelum deploy",
        "tulis rangkuman meeting",
        "update catatan pribadi",
        "review soal ctf",
        "cek grammar laporan",
        "kirim permintaan akses",
        "rapi meja kerja",
        "bikin template dokumen",
        "cari inspirasi desain"
    ];

    $db->beginTransaction();
    $ins = $db->prepare("INSERT INTO notes (id, owner, content, isHidden) VALUES (:id, :owner, :content, :hidden)");
    for ($i = 1; $i <= 100; $i++) {
        $owner = "user";
        $content = $samples[$i % count($samples)];
        $hidden = hidden_seed($i) ? 1 : 0;

        if ($i === 41) {
            $owner = "admin";
            $content = "flag palsu: PorosCTF{dummy_decoy_note}";
        } elseif ($i === 67) {
            $owner = "admin";
            $content = "PorosCTF{34sy_a5_fuck_1dor_wait_f0r_th3_0thers_llmnx}";
        }

        $ins->execute([
            ":id" => $i,
            ":owner" => $owner,
            ":content" => $content,
            ":hidden" => $hidden,
        ]);
    }
    $db->commit();
}
