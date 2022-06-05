<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;


class SignupController extends Controller
{
    public function simpleView() {
         if (session('username'))
            return redirect('home');
        else
            return view('signup');
    }


    public function createNewUser() {
        $request = request();
        $errors = array();

        // Se i campi ricevuti sono "pieni"
        if (isset($request["name"]) && isset($request["surname"]) && isset($request["gender"])
            && isset($request["birthday"]) && isset($request["username"]) && isset($request["email"])
            && isset($request["password"]) && isset($request["check_password"]))
        {
            /*****************************************************************************
            FACCIAMO DEI CONTROLLI SU:
             * USERNAME => lunghezza, già in uso
             * EMAIL => formato, già in uso
             * PASSWORD => lunghezza, corrispondenza con la conferma
             ******************************************************************************/

            #USERNAME
            if (strlen($request["username"]) < 8)
                $errors[] = "username troppo corto: lunghezza minima 8 caratteri";
            if (User::query() -> where('username', $request["username"]) -> get() -> isNotEmpty())
                $errors[] = "il nome utente risulta gia' iscritto";

            #EMAIL
            if (!filter_var($request["email"],FILTER_VALIDATE_EMAIL))
                $errors[] = "email non valida";
            if (User::query() -> where('email', $request['email']) -> get() -> isNotEmpty())
                $errors[] = "l'email risulta presente nel database";

            #PASSWORD
            if (strlen($request["password"]) < 8)
                $errors[] = "Caratteri password insufficienti";
            if ($request["password"] != $request["check_password"])
                $errors[] = "le password non coincidono";

            // se non ci sono stati problemi durante le validazioni
            if (count($errors) == 0) {
                 if (User::query() -> create([
                    'username' => $request['username'],
                    'password' => $request['password'],
                    'name' => $request['name'],
                    'surname' => $request['surname'],
                    'email' => $request['email'],
                    'gender' => $request['gender'],
                    'date_of_birth' => $request['birthday']
                ])) {
                     // se la query d' inserimento va bene
                     session(['username' => $request['username']]);
                     return redirect('home');
                 }
            }
            else {
                // ci sono stati problemi durante le validazioni
                $errors[] = "problemi durante il salvataggio nel DB";
                return redirect('signup') -> withErrors($errors);
            }
        }
        else {
            // se invece almeno uno dei campi è vuoto
            $errors[] = "compila tutti i campi!";
            return redirect('signup') -> withErrors($errors);
        }

    }



    public function boolCheckUsername($username) {
        /**********************************************************************************************
                    RITORNA VERO SE ESISTE UN USERNAME nel DB, FALSO ALTRIMENTI.
         *********************************************************************************************/

        if (User::query() -> where('username', $username) -> get() -> isNotEmpty())
            // nome utente già registrato
            return array('exists' => 'TRUE');
        else
            return array('exists' => 'FALSE');
    }
}
