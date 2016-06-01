<?php 
session_start();
header('Content-type: text/html; charset=UTF-8');
include("session_manager.php");
include("nav.php");
bounceSession();
?>
<!DOCTYPE html>
<html>
  <head>
    <title> Chip Fukuhara's Homepage</title>
    <link href = "projects.css" type="text/css" rel="stylesheet">
    <link href = "homepage_images/logo.png" type="all/screen" rel="shortcut icon">
  </head>

  <body>
    <nav class="header">
      <div class="header-logo">
        <a href="/mainpage.php"><img src="homepage_images/logo.png"></a>
      </div>
      <?= printNavBar(array("projects"), "projects"); ?>
    </nav>

    <?php showError(); ?>
    <div class="mainSection projects">
      <figure class="portal">
        <a href="cse154.php">
          <img src="homepage_images/step_by_step.jpg" alt="cse154">
          <figcaption> CSE 154 Projects </figcaption>
        </a>
      </figure>
      <figure class="portal">
        <a href="info343.php">
          <img src="homepage_images/info_logo.png" alt="info343">
          <figcaption> Info 343 Projects </figcaption>
        </a>
      </figure>
      <figure class="portal">
        <a href="other_projects/other_projects.php">
          <img src="homepage_images/cse_logo.png" alt="other projects">
          <figcaption> Other Projects </figcaption>
        </a>
      </figure>
      <figure class="portal">
        <a href="treevis/path-visualization.html">
          <img src="homepage_images/paths-vis.png" alt="tree visualization">
          <figcaption> Tree Visualization </figcaption>
        </a>
      </figure>
      <figure class="portal">
        <a href="AutoVis/index.php">
          <img src="homepage_images/mid_level_current.png" alt="autos vis">
          <figcaption> Autos Visualization </figcaption>
        </a>
      </figure>
      <figure class="portal">
        <a href="WordSolver">
          <img src="homepage_images/wordsolver.png" alt="word solver">
          <figcaption> WordSolver </figcaption>
        </a>
      </figure>
    </div>
  </body>
</html>
