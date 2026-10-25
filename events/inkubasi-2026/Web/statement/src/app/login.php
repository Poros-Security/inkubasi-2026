<?php
session_start();
require_once __DIR__ . "/db.php";

$error = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"] ?? "");
    $password = $_POST["password"] ?? "";

    $db = get_db();
    $stmt = $db->prepare("SELECT * FROM users WHERE username = :u LIMIT 1");
    $stmt->execute([":u" => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        $_SESSION["user"] = $user["username"];
        header("Location: /dashboard.php");
        exit;
    }

    $error = "Login gagal";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Notes App - Login</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="center">
    <div class="card auth">
      <div class="badge">Notes App</div>
      <h1>Login</h1>
      <p class="muted">Akses catatanmu yang tersembunyi.</p>
      <?php if ($error): ?>
        <div class="error"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>
      <form method="post">
        <label>Username</label>
        <input type="text" name="username" required />
        <label>Password</label>
        <input type="password" name="password" required />
        <button type="submit">Login</button>
      </form>
      <div class="hint">Akun demo: <code>user</code> / <code>userpass</code></div>
    </div>
  </div>
</body>
</html>
