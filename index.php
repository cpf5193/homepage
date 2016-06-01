<?php 
session_start();
header("Connection: keep-alive");
header('Content-type: text/html; charset=UTF-8');
include("session_manager.php");
directToMain();
?>
<!DOCTYPE html>
<html>
  <head>
    <title> Chip Fukuhara's Homepage</title>
    <link href="index.css" type="text/css" rel="stylesheet">
    <link href="homepage_images/logo.png" type="all/screen" rel="shortcut icon">
  </head>
  <body>
    <?php showError();?>
    <div class="logo">
      <img src="homepage_images/logo.png">
    </div>
    <form action="login.php" method="post" class="signin-form">
      <div class="username">
        <span class="username-label">Username:</span>
        <input type="text" name="username" class="username-input">
      </div>
      <div class="password">
        <span class="password-label">Password:</span>
        <input type="password" name="password" class="password-input">
      </div>
      <input type="submit" value="Login" class="btn btn-primary login-btn">
      <div class="hint">
        <p>Please use these credentials to sign in:</p>
        <p>Username: generic_user</p>
        <p>Password: password</p>
      </div>
    </form>
  </body>
</html>
