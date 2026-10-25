<?php
session_start();
require_once __DIR__ . "/db.php";

if (!isset($_SESSION["user"])) {
    header("Location: /login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Notes App - Create</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="container">
    <div class="topbar">
      <h1>Create Note</h1>
      <div>
        <a class="btn" href="/dashboard.php">Back</a>
        <a class="btn" href="/logout.php">Logout</a>
      </div>
    </div>

    <div class="card locked">
      <div class="lock-badge">LOCKED</div>
      <h2>Fitur dikunci</h2>
      <p class="muted">Akun ini tidak punya izin untuk membuat catatan baru.</p>
      <div class="fake-form">
        <label>Title</label>
        <input type="text" placeholder="Judul catatan" disabled />
        <label>Content</label>
        <textarea rows="5" placeholder="Isi catatan" disabled></textarea>
        <button type="button" disabled>Create</button>
      </div>
      <div class="hint">Minta akses ke admin untuk membuka fitur ini.</div>
    </div>
  </div>
</body>
</html>
