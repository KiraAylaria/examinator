<?php

    // VP
    require "sharedVars.php";

    echo $twig->render('exams.twig', array(
        'pageTitle' => 'Examinator - Klausuren',
        'applicationName' => 'Examinator',
        'pageJs' => 'src/js/exams.js',
        'tpl' => 'exams',
        'darkMode' => $darkMode,
        'classes' => $classes,
        'subjects' => $subjects,
        'isAdmin' => $isAdmin,
        'isTeacher' => $isTeacher,
        'firstname' => $firstname,
        'lastname' => $lastname,
        'className' => $className
    ));
