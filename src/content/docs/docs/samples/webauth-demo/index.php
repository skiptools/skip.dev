<?php
$scheme = $_GET['scheme'] ?? null;
$token = $_GET['token'] ?? null;

if ($scheme && $token) {
    header("HTTP/1.1 302 Found");
    header("Location: $scheme://auth?token=$token");
    exit;
}
?>
<!DOCTYPE html>
<head>
<meta name="viewport" content="width=device-width">
<title>Example Page for WebAuthenticationSession</title>
<style>
html {
    font-family: system-ui, sans-serif;
}
body {
    max-width: 60ch;
    font-size: 16px;
}
input, button {
    font-size: 16px;
}
</style>
</head>
<body>
<h1>WebAuthenticationSession Example</h1>
<p>A proper login page would accept a user name and password, verify them with values in a database, and then redirect the user to the native app's custom URL scheme.</p>
<p>This dummy login page accepts a <code>scheme</code> URL query parameter, lets you type in a token, and redirects the user to that scheme.</p>
<?php
if (!$scheme) {
    $currentUrl = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    $separator = (strpos($currentUrl, '?') !== false) ? '&' : '?';
    $exampleUrl = $currentUrl . $separator . 'scheme=asdf';
    echo "<p>Visit this page with a scheme URL query parameter, e.g. " . htmlspecialchars($exampleUrl) . "</p>";
} else {
?>
    <p>This form will submit the token below to &lt;<?= htmlspecialchars($scheme) ?>://auth?token=12345&gt;</p>
    <form method="get">
        <input type="hidden" name="scheme" value="<?= htmlspecialchars($scheme) ?>">
        <input type="text" name="token" value="12345">
        <button type="submit">Submit</button>
    </form>
<?php
}
?>
</div>
</body>
</html>
