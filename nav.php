<?php
#Prints the navigation bar with options for disabling and selecting
function printNavBar($disabledArr, $selected){
  echo "<ul class=\"nav-tabs\">";
  $options = array(
    array(
      'path' => '/projects.php',
      'text' => 'Projects',
      'selected' => $selected == 'projects' ? true : false,
      'disabled' => in_array('projects', $disabledArr) ? true : false
    ),
    array(
      'path' => '/about.php',
      'text' => 'About Me',
      'selected' => $selected == 'about' ? true : false,
      'disabled' => in_array('about', $disabledArr) ? true : false
    ),
    array(
      'path' => '/Resume.pdf',
      'text' => 'Resume',
      'selected' => $selected == 'resume' ? true : false,
      'disabled' => in_array('resume', $disabledArr) ? true : false
    ),
    array(
      'path' => '/other_projects/other_projects.php',
      'text' => 'Other',
      'selected' => $selected == 'other' ? true : false,
      'disabled' => in_array('other', $disabledArr) ? true : false
    ),
    array(
      'path' => '/mainpage.php',
      'text' => 'Home',
      'selected' => $selected == 'home' ? true : false,
      'disabled' => in_array('home', $disabledArr) ? true : false
    )
  );
  
  foreach ($options as $option) {
    echo "<li class=\"nav-tab\">";
    $selectedString = $option['selected'] ? ' class="selected"' : '';
    $disabledString = $option['disabled'] ? ' disabled' : '';
    echo "  <a href=\"" . $option['path'] . "\"" . $selectedString . $disabledString . ">" . $option['text'] . "</a>";
    echo "</li>";
  }

  echo "</ul>";
}
?>