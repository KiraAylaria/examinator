<?php

    // (VP & DH)

    namespace Dashboard;

    use User\UserRepository;
    use Exams\ExamsRepository;
    use Classes\ClassesRepository;
    use Dashboard\DashboardRepository;

    class DashboardController
    {
        private $userRepository;
        private $examsRepository;
        private $classesRepository;
        private $subjectRepository;

        //Übergibt das Repository vom Container
        //(DH)
        public function __construct(UserRepository $userRepository, ExamsRepository $examsRepository, ClassesRepository $classesRepository)
        {
            $this->userRepository = $userRepository;
            $this->examsRepository = $examsRepository;
            $this->classesRepository = $classesRepository;
        }

        //(DH)
        private function render($view, $content, $login_type)
        {
            $twig = $content['twig'];
            $exams = $content['exams'];
            $loginState = $content['loginState'];

            if($login_type == 'user'){
                $classes = $content['classes'];
                $user = $content['user'];
            }else if($login_type == 'class'){
                $class = $content['class'];
            }

            include "./templates/php/{$view}.php";
        }

        //Öffnet das Dashboard (Klasse oder Lehrer/Administrator)
        //(DH)
        public function index($tpl, $twig, $loginState)
        {
            $userId = isset($_COOKIE['UserLogin']) ? $_COOKIE['UserLogin'] : false;
            $classId = isset($_COOKIE['ClassesLogin']) ? $_COOKIE['ClassesLogin'] : false;

            if($userId){
                $login_type = 'user';
                $user = $this->userRepository->fetchUserById($userId);
                $exams = $this->examsRepository->fetchUserExams($user->id, 9);
                $classes = $this->classesRepository->fetchClasses();

                // VP
                $this->render("{$tpl}", [
                    'twig' => $twig,
                    'user' => $user,
                    'classes' => $classes,
                    'exams' => $exams,
                    'loginState' => $loginState
                    ],
                    $login_type
                );
            } elseif($classId) {
                $login_type = 'class';
                $class = $this->classesRepository->fetchClass($classId);
                $exams = $this->examsRepository->fetchClassExams($class->id, 9);

                // VP
                $this->render("{$tpl}", [
                    'twig' => $twig,
                    'class' => $class,
                    'exams' => $exams,
                    'loginState' => $loginState
                    ],
                    $login_type
                );
            }
        }
    }
