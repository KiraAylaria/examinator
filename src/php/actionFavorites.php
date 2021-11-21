<?php
require_once __DIR__ . "/_class/Core/Container.php";
require_once __DIR__ . "/_class/Favorites/FavoritesController.php";
require_once __DIR__ . "/_class/Subjects/SubjectsRepository.php";
require_once __DIR__ . "/_class/Classes/ClassesRepository.php";
require_once __DIR__ . "/_class/User/UserRepository.php";
require_once __DIR__ . "/_class/User/UserModel.php";


$userId = 2;

$container = new Core\Container();
$userRepository = $container->make('userRepository');

$user = $userRepository->fetchUserById($userId);

if($user){
  $data = $_POST;

  $classIds = [];
  $subjectIds = [];

  foreach($data AS $key => $value)
  {
    if(preg_match('/class.*/', $key)){
      $classIds[] = $value;
    } elseif(preg_match('/subject.*/', $key)){
      $subjectIds[] = $value;
    }
  }

  $favoritesController = $container->make('favoritesController');

  $favoritesController->desert('classes', $classIds, $userId);
  $favoritesController->desert('subjects', $subjectIds, $userId);

  header("Refresh:0; url=?page=dashboard");
  exit();
}




