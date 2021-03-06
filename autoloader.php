<?php

// (DH) Lädt automatisch ressourcen

function autoloader($className)
{
    $className = str_replace("\\", "/", $className);
    if(!str_contains($className, "ajax")) {
        if(file_exists("./src/php/_class/{$className}.php"))
        {
            require "./src/php/_class/{$className}.php";
        }
    }
}

spl_autoload_register("autoloader");
?>
