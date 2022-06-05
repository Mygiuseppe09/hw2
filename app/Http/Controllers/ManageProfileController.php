<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ManageProfileController extends Controller
{
    public function simpleView() {
        if (!session('username'))
            return redirect('login');
        else
            return view('manage_profile');
    }

    public function getLoggedUserPosts() {
        /**********************************************************************************************
      RITORNA TUTTI I POST PRESENTI NEL DB PUBBLICATI DALL'UTENTE LOGGATO (DAL PIU' RECENTE AL MENO RECENTE)
                    n.b. Ritorna anche il NOME del luogo associato al corrispondente ID
         *********************************************************************************************/
        /** @var Post $posts_db */

        $posts = array();

        $posts_db = Post::query()
            -> where('user', session('username'))
            -> orderBy('time','desc')
            -> get();

        if ($posts_db -> isNotEmpty()) {
            // l'utente ha pubblicato posts
            foreach ($posts_db as $post) {
                $place_name = $post -> places() -> value('name');
                $post -> place_name = $place_name;
                $posts[] = $post;
            }
        }
        return $posts;
    }

    public function deletePost($postId) {
        /**********************************************************************************************
                    ELIMINA DAL DB UNA RIGA DALLA TABELLA posts e ne ritorna l'id
         *********************************************************************************************/

        $rows_deleted = Post::query()
            -> where('user', session('username'))
            -> where('id', $postId)
            -> delete();

        if ($rows_deleted > 0)
            //post eliminato correttamente
            return array('deleted' => 'TRUE', 'postId' => $postId);
        else
            return array('deleted' => 'FALSE', 'postId' => $postId);
    }




}
