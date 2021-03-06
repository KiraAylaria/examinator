<?php

// VP DH GR EE

namespace Core;

use PDO;
use Dashboard\DashboardController;
use Dashboard\DashboardRepository;
use Exams\ExamsController;
use Exams\ExamsRepository;
use User\UserController;
use User\UserRepository;
use Favorites\FavoritesController;
use Favorites\FavoritesRepository;
use Classes\ClassesController;
use Classes\ClassesRepository;
use Classes\ClassManagement\ClassManagementController;
use Classes\ClassOverview\ClassOverviewController;
use Subjects\SubjectsController;
use Subjects\SubjectsRepository;
use Subjects\SubjectManagement\SubjectManagementController;
use UserManagement\UserManagementController;
use UserManagement\UserManagementRepository;

use Login\LoginController;
use Login\LoginRepository;

//Klasse die sich um das erstellen von Objekten kümmert
//(DH)
class Container
{
  //Enthält alle Objekte die von make() erstellt werden
  private $instances = [];

  //Enthält die Templates zur Erstellung der Objekte
  private $receipts = [];

  //Wird benötigt, da man die Funktionen erst beim Instanziieren zuweisen kann
  //Hier werden die neuen Controller/Repositorys/DB Verbindung erstellt
  //(DH)
  public function __construct()
  {
    $this->receipts = [
      'dashboardController' => function(){
        return new DashboardController($this->make("userRepository"), $this->make("examsRepository"), $this->make("classesRepository"));
      },
      'dashboardRepository' => function(){
        return new DashboardRepository($this->make("pdo"));
      },
      'loginController' => function(){
        return new LoginController($this->make("loginRepository"), $this->make("userRepository"));
      },
      'loginRepository' => function(){
        return new LoginRepository($this->make("pdo"));
      },
      'classesController' => function(){
        return new ClassesController($this->make("classesRepository"));
      },
      'classesRepository' => function(){
        return new ClassesRepository($this->make("pdo"));
      },
      'examsController' => function(){
        return new ExamsController($this->make("examsRepository"), $this->make("classesRepository"), $this->make("subjectsRepository"));
      },
      'examsRepository' => function(){
        return new ExamsRepository($this->make("pdo"));
      },
      'subjectsController' => function(){
        return new SubjectsController($this->make("SubjectsRepository"));
      },
      'subjectsRepository' => function(){
        return new SubjectsRepository($this->make("pdo"));
      },
      'userController' => function(){
        return new UserController($this->make("userRepository"));
      },
      'userRepository' => function(){
        return new UserRepository($this->make("pdo"));
      },
      'favoritesController' => function(){
        return new FavoritesController($this->make("classesRepository"), $this->make("subjectsRepository"), $this->make("userRepository"));
      },
      'classmanagementController' => function(){
        return new ClassManagementController($this->make("classesRepository"));
      },
      'classoverviewController' => function(){
        return new ClassOverviewController($this->make("classesRepository"), $this->make("examsRepository"));
      },
      'subjectmanagementController' => function(){
        return new SubjectManagementController($this->make("subjectsRepository"));
      },
      'usermanagementController' => function(){
        return new UserManagementController($this->make("usermanagementRepository"), $this->make('userRepository'));
      },
      'usermanagementRepository' => function(){
          return new UserManagementRepository($this->make("pdo"));
      },
      //Stellt DB Verbindung her und gibt Sie zurück, falls das Objekt eine braucht
      'pdo' => function(){
        $pdo = new PDO('mysql:host='. DB_HOST .';dbname='. DB_NAME .';charset=utf8',
        DB_USER,
        DB_PWD);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        return $pdo;
      }
    ];
  }

  //Erstellt alle benötigten Objekte
  //z.B. Controller und deren benötigten Repositorys und Models sowie die Datenbankverbindung
  //Überprüft zusätzlich, dass keine Objekte mehrfach erzeugt werden. Falls bereits eines existiert, gibt es dieses zurück
  //(DH)
  public function make($name)
  {
    //Überprüft ob es bereits eine aktive Instanz mit dem Objekt gibt, falls ja gibt es das Objekt zurück
    if(!empty($this->instances[$name])){
      return $this->instances[$name];
    }

    //Falls es noch keine aktive Instanz gibt, wird überprüft, ob es ein Template zur Erstellung gibt
    if(isset($this->receipts[$name])){
      $this->instances[$name] = $this->receipts[$name]();
    }

    //Gibt das aktuelle Objekt zurück (Entweder NULL oder wurde grade durch das Template erstellt)
    return $this->instances[$name];
  }
}
