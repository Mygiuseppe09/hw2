<?php

namespace App\Http\Controllers;

use App\Models\Image;
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
                $images_urls = Image::query()
                    -> where('postId', strval($post -> id))
                    -> value('images');

                $place_name = $post -> places() -> value('name');

                $post -> place_name = $place_name;
                $post -> images_urls = $images_urls;

                $posts[] = $post;
            }
        }
        return $posts;
    }

    public function deletePost($postId) {
        /**********************************************************************************************
                    * ELIMINA DAL DB MySQL UNA RIGA DALLA TABELLA posts
                    * ELIMINA DAL DB MongoDB
                    * ELIMINA LE IMMAGINI SALVATE SUL SERVER
         *********************************************************************************************/

        $rows_deleted = Post::query()
            -> where('user', session('username'))
            -> where('id', $postId)
            -> delete();

        // recupero la lista delle immagini associate al posto
        $images_assoc = Image::query()
            -> where('postId', strval($postId))
            -> value('images');
        //elimino i file
        foreach ($images_assoc as $path_to_remove)
            unlink($path_to_remove);

        //elimino da MongoDB
        $images_deleted = Image::query()
            -> where('postId', strval($postId))
            -> delete();

        if ($rows_deleted > 0 && $images_deleted > 0)
            //post eliminato correttamente
            return array('deleted' => 'TRUE', 'postId' => $postId);
        else
            return array('deleted' => 'FALSE', 'postId' => $postId);
    }




}
