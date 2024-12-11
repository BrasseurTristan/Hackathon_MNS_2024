<?php
try{
    $host = 'localhost' ;
    $dbname = 'hackaton2024';
    $username = 'root';  // À modifier
    $userpwd = '';       // À modifier
    $db = new PDO("mysql:host=".$host.";dbname=".$dbname.";charset=utf8",$username,$userpwd,[PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    $db->exec('SET NAMES "UTF8"');
} catch(PDOException $e){
    echo 'Erreur : '.$e->getMessage();
    die();
}
?>