<?php
$mysqli = new mysqli("localhost", "my_user", "my_password", "my_database");

/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

/* Select queries return a resultset */
$sql = "SELECT a, b FROM table LIMIT 10";

if ($result = $mysqli->query( $sql )) {
    printf("Select returned %d rows.\n", $result->num_rows);

    while ($myrow = $result->fetch_array(MYSQLI_ASSOC))
    {
      $a_value = $myrow["a"];
      $b_value = $myrow["b"];
      print 'a_value: '.$a_value.PHP_EOL;
      print 'b_value: '.$b_value.PHP_EOL;
    }

    /* free result set */
    $result->close();
}

$mysqli->close();
?>