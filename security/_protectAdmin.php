<?php
if(!isset($_SESSION['user_username']) || $_SESSION['logged_in']!="true"){
    header("Location:../index.html");
}