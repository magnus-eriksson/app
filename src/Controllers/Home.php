<?php

namespace App\Controllers;

use App\App;

class Home
{
    /**
     * @param App $app
     *
     * @return string
     */
    public function home(App $app): string
    {
        return $app->render('home');
    }
}
