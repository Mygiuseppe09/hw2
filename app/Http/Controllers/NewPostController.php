<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Place;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class NewPostController extends Controller
{
    public function simpleView() {
        if (!session('username'))
            return redirect('login');
        else
            return view('new_post');
    }

    public function RoadGoatAPI($city) {
        return Http::withBasicAuth(env('RG_ACCESS_KEY'), env('RG_SECRET_KEY'))
            -> get(env('RG_ENDPOINT'), [
                'q' => $city,
            ])
            -> json();
    }


    public function storeNewPost($place_id, $place_name) {
        /**********************************************************************************************
                                INSERISCE NEL DB UNA NUOVA RIGA NELLA TABELLA posts
                                    PRIMA PERO' AGGIUNGE UNA RIGA IN places
         *********************************************************************************************/

        if (Place::query() -> where('id', $place_id) -> get() -> isNotEmpty()) {
            // allora il luogo è già stato "travasato" dal db RoadGoat a quello locale: procediamo
            if (Post::query() -> create([
                'user' => session('username'),
                'place' => $place_id
            ])) // il post è stato salvato
            {
                $postId = Post::query() -> where('user', session('username'))
                    -> where('place', $place_id)
                    -> value('id');
                return array('is_post_stored' => 'TRUE', 'postId' => $postId);
            }

            else
                return array('is_post_stored' => 'FALSE');
        }
        else {
            //prima inseriamo il luogo
            if (Place::query() -> create([
                'id' => $place_id,
                'name' => $place_name
            ])) {
                if (Post::query() -> create([
                    'user' => session('username'),
                    'place' => $place_id
                ])) // il post è stato salvato
                {
                    $postId = Post::query() -> where('user', session('username'))
                                            -> where('place', $place_id)
                                            -> value('id');
                    return array('is_post_stored' => 'TRUE', 'postId' => $postId);
                }
                else
                    return array('is_post_stored' => 'FALSE');
            }
            else
                return array('is_post_stored' => 'FALSE');
        }
    }

    public function saveImages() {
        /**********************************************************************************************
            AGGIUNGE UN ELEMENTO ALLA COLLECTION IMAGES DEL DB NOSQL (MONGODB) CON ALL'INTERNO:
                     * POSTID
                     * ARRAY CONTENENTE L'URL DELLE IMMAGINI
         *********************************************************************************************/
        /* @var Image $new_item_in_collection */

        $new_item_in_collection = Image::query() -> create([
            'postId' => request('postId'),
            'images' => array()
        ]);

        $target_files = array();
        $x = 0;

        foreach ($_FILES['images']['name'] as $image_name)
            $target_files[] = 'post_images/' . basename($image_name);

        foreach ($_FILES['images']['tmp_name'] as $image_old_path) {
            move_uploaded_file($image_old_path, $target_files[$x]);
            $x++;
        }

        $new_item_in_collection -> images = $target_files;
        $new_item_in_collection -> save();

        return redirect('/home');
    }

}
