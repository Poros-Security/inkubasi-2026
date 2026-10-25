<?php
session_start();
require_once __DIR__ . "/db.php";

if (!isset($_SESSION["user"])) {
    header("Location: /login.php");
    exit;
}

// Soft delay to slow down blind enumeration a bit
usleep(200000);

$id = $_GET["id"] ?? "";
$db = get_db();
$stmt = $db->prepare("SELECT * FROM notes WHERE id = :id LIMIT 1");
$stmt->execute([":id" => $id]);
$note = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Notes App - Note</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="container">
    <div class="topbar">
      <h1>Note Detail</h1>
      <a class="btn" href="/dashboard.php">Back</a>
    </div>

    <div class="card">
      <?php if (!$note): ?>
        <div class="error">Catatan tidak ditemukan</div>
      <?php else: ?>
        <div class="meta">Owner: <?php echo htmlspecialchars($note["owner"]); ?></div>
        <div class="note"><?php echo nl2br(htmlspecialchars($note["content"])); ?></div>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
