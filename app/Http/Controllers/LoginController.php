<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;


class LoginController extends Controller
{
    public function simpleView() {
        if (session('username'))
            return redirect('home');
        else
            return view('login');
    }


    public function goToHome() {
        $errors = array();
        $request = request();

        if (isset($request["username"]) && isset($request["password"]))
        {
            if (User::query() -> where('username', $request["username"]) -> get() -> isEmpty())
                // L'utente non registrato
                $errors[] = "utente non registrato";
            else {
                $user = User::query() -> where('username', $request["username"]) -> first();
                if ($request["password"] != $user -> password) {
                    // password non corretta
                    $errors[] = "Password non corretta";
                }
            }

            if (count($errors) == 0) {
                session(['username' => $request['username']]);
                return redirect('home');
            }
            else
                // ci sono stati problemi durante le validazioni
                return redirect('login') -> withErrors($errors);
        }
        else {
            $errors[] = "compila tutti i campi!";
            return redirect('login') -> withErrors($errors);
        }

    }


}
