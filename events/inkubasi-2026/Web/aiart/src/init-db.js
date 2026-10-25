const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    
    db.run("INSERT INTO users (username, password) VALUES ('kurator', 'S3cr3t_rbabrf_@7eYB_brBs_152')");

    db.run("CREATE TABLE notes (id INTEGER PRIMARY KEY, content TEXT)");
    
    const hintKurator = `Catatan Sang Kurator Utama:

1. [Insiden CVE-2025-55182] Tolong perhatikan cara mesin ini melakukan penggabungan data. Warnanya meresap terlalu dalam, hingga menodai cetak biru (prototype) dari sistem itu sendiri. Segera terapkan patch perbaikan sebelum galeri ini sepenuhnya diambil alih oleh peretas.
2. [Mandat Asisten] Untuk Robin, jangan lupa tugas rutinanmu. Aku telah memberimu mandat rahasia untuk mengurus pembaruan paket-paket di galeri ini tanpa perlu repot memasukkan kata sandi. Jika kamu lupa apa saja kekuatanmu, cobalah periksa daftar hak istimewamu.
3. [Ruang Pameran] Mahakarya kita yang paling berharga masih terkunci rapat di puncak hierarki (/root). Pastikan tidak ada yang menyentuhnya.`;

    db.run(`INSERT INTO notes (content) VALUES (?)`, [hintKurator]);
});

db.close();
console.log("Database ok!");
