<?php
session_start();
require_once __DIR__ . "/db.php";

if (!isset($_SESSION["user"])) {
    header("Location: /login.php");
    exit;
}

$db = get_db();
$stmt = $db->prepare("SELECT id, content FROM notes WHERE owner = :o AND isHidden = 0 ORDER BY id ASC");
$stmt->execute([":o" => $_SESSION["user"]]);
$notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Notes App - Dashboard</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="container">
    <div class="topbar">
      <h1>Dashboard</h1>
      <div>
        <a class="btn" href="/create.php">Create Note</a>
        <span class="muted">Logged in as <?php echo htmlspecialchars($_SESSION["user"]); ?></span>
        <a class="btn" href="/logout.php">Logout</a>
      </div>
    </div>

    <div class="card">
      <h2>Catatanmu</h2>
      <p class="muted">Klik catatan untuk melihat detail.</p>
      <div class="cards">
        <?php foreach ($notes as $n): ?>
          <a class="note-card" href="/note.php?id=<?php echo (int)$n["id"]; ?>">
            <div class="note-id">#<?php echo (int)$n["id"]; ?></div>
            <div class="note-preview"><?php echo htmlspecialchars($n["content"]); ?></div>
            <div class="note-cta">Open</div>
          </a>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</body>
</html>
