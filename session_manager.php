<?php
  include("redirect.php");
  function bounceSession() {
    if(!isset($_SESSION["username"])||!isset($_SESSION["password"])){
      redirect("/", "Please Log In");
    }
  }

  function showError(){
    if(isset($_SESSION["error"])){ 
?>    <div class="errorMessage"><?= $_SESSION["error"]?></div>
<?php
      unset($_SESSION["error"]);
    }
  }

  function directToMain() {
    if(isset($_SESSION["username"]) && isset($_SESSION["password"])){
      header("Location: /mainpage.php");
      die();
    }
  }
?>