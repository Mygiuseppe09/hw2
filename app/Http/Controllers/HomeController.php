<?php

namespace App\Http\Controllers;

use App\Models\Place;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function simpleView() {
        if (!session('username'))
            return redirect('login');
        else
            return view('home');
    }

    public function boolCheckPostLiked($postId) {
        /**********************************************************************************************
        RITORNA VERO SE ESISTE UN MI PIACE AD UN POST DA PARTE DELL'UTENTE LOGGATO, FALSO ALTRIMENTI.
                        p.s. restituisce anche l'id del post controllato
         *********************************************************************************************/
        /** @var User $logged_user */

        $logged_user = User::query() -> where('username', session('username')) -> first();
        if($logged_user -> likes() -> where('post', $postId) -> get() -> isNotEmpty())
            // il like c'è
            return array('is_liked' => 'TRUE', 'postId' => $postId);
        else
            // bisogna mettere like
            return array('is_liked' => 'FALSE', 'postId' => $postId);
    }


    public function getPostNlikes($postId) {
        /**********************************************************************************************
                                RITORNA nlikes di un POST ed il suo id
         *********************************************************************************************/
        $post = Post::query() -> where('id', $postId) -> first();
        return array('nlikes' => $post -> nlikes, 'postId' => $postId);
    }

    public function getPostLikes($postId) {
        /**********************************************************************************************
                RITORNA il nome utente e il sesso degli utenti che hanno messo mi piace ad un POST
         *********************************************************************************************/
        /** @var Post $post */

        $users = array();

        $post = Post::query() -> where('id', $postId) -> first();
        $likers = $post -> likes() -> get();

        foreach ($likers as $liker)
            $users[] = ['user' => $liker -> username, 'gender' => $liker -> gender];
        return $users;
    }

    public function getUserInfo($username) {
        /**********************************************************************************************
                RITORNA LE INFORMAZIONI NON PRIVATE DELL'UTENTE DI CUI E' PASSATO L'USERNAME
         *********************************************************************************************/

        return User::query() -> where('username', $username) -> first();
    }

    public function getLoggedUserInfo() {
        /**********************************************************************************************
            RITORNA LE INFORMAZIONI NON PRIVATE DELL'UTENTE LOGGATO + QUANTITA' LUOGHI VISITATI
         *********************************************************************************************/
        /** @var User $logged_user */

        $logged_user = User::query() -> where('username', session('username')) -> first();
        $num_luoghi_visitati = $logged_user -> visits() -> distinct() -> count('place');

        $logged_user -> nplaces = $num_luoghi_visitati;
        return $logged_user;
    }

    public function getUsersByPlace($place_name) {
        /**********************************************************************************************
                RITORNA GLI UTENTI CHE HANNO VISITATO UN LUOGO ESCLUDENDO L'UTENTE LOGGATO
         *********************************************************************************************/
        /** @var Place $place */

        $place = Place::query() -> where('name', 'like', $place_name .'%') -> first();
        if ($place != null)
        return $place -> visits() -> where('username','!=', session('username')) -> get();
        else return array(); // perchè lato js faccio un check sulla lunghezza del json
    }

    public function storeNewLike($postId) {
        /**********************************************************************************************
                INSERISCE UN LIKE (ASSOCIATO ALL'UTENTE LOGATO) DA UN POST e ne ritorna l'id
         *********************************************************************************************/
        /** @var User $liker */

        $liker = User::query() -> where('username', session('username')) -> first();
        $liker -> likes() -> attach($postId);
        return array('postId' => $postId);
    }

    public function deleteLike($postId) {
        /**********************************************************************************************
                TOGLIE UN LIKE (ASSOCIATO ALL'UTENTE LOGATO) DA UN POST e ne ritorna l'id
         *********************************************************************************************/
        /** @var User $unliker */

        $unliker = User::query() -> where('username', session('username')) -> first();
        $unliker -> likes() -> detach($postId);
        return array('postId' => $postId);
    }

    public function getPlaces() {
        /**********************************************************************************************
                            RITORNA I LUOGHI VISITATI DALL'UTENTE LOGGATO
         *********************************************************************************************/
        /** @var User $logged_user */

        $logged_user = User::query() -> where('username', session('username')) -> first();
        return $logged_user -> visits() -> get();
    }


    public function getFeedSection() {
        /**********************************************************************************************
                RITORNA I PRIMI 10 POST PRESENTI NEL DB (DAL PIU' RECENTE AL MENO RECENTE)
                n.b. Ritorna anche:
                - il nome del luogo associato al corrispondente ID
                - il sesso associato all'utente che l'ha postato (per stabilire l'avatar)
         *********************************************************************************************/
        /** @var Post $posts */

        $posts_plus = array();

        $posts = Post::query() -> limit(10) -> orderBy('time','desc') -> get();
        if ($posts -> isNotEmpty())
            // ci sono posts nel db
            foreach ($posts as $post) {
                $place_name = $post -> places() -> value('name');
                $user_gender = $post -> users() -> value('gender');

                // aggiungiamo i nuovi campi
                $post -> name_place = $place_name;
                $post -> user_gender = $user_gender;
                $posts_plus[] = $post;
            }
        return $posts_plus;
    }

}
