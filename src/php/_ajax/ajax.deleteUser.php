<?php

    // GR & VP

    require_once("../db_config.php");
    require_once '../_class/Core/Container.php';
    require_once '../_class/User/UserRepository.php';
    require_once '../_class/User/UserController.php';
    require_once '../_class/User/UserModel.php';

    $data = (object) $_POST['data'];

    $container = new Core\Container();

    $userController = $container->make("userController");

    $selfDelete = false;
    $ok = false;
    // Prüfung, ob ein Admin eingeloggt ist (VP)
    if ($data->id != $_COOKIE['UserLogin']) {
        $ok = $userController->deleteUserById($data->id);
    } else {
        $selfDelete = true;
    }

    $obj = new stdClass;

    // Rückgabe, um Erfolgs- oder Fehlermeldung auszugeben
    if ($ok && !$selfDelete) {
        $obj->success = true;
    } else {
        $obj->success = false;
        if ($selfDelete) {
            $obj->status = "self_delete";
        }
    }

    $rtn = json_encode($obj);
    echo $rtn;