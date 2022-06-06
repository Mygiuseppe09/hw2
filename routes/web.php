<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ManageProfileController;
use App\Http\Controllers\NewPostController;
use App\Http\Controllers\SignupController;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use mysql_xdevapi\Session;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {return view('welcome');});

/****** SIGNUP ******/
Route::get('/signup', [SignupController::class, 'simpleView']);
Route::post('/signup', [SignupController::class, 'createNewUser']);

/****** LOGIN ********/
Route::get('/login', [LoginController::class, 'simpleView']);
Route::post('/login', [LoginController::class, 'goToHome']);

/****** HOME ********/
Route::get('/home', [HomeController::class, 'simpleView']);

/***** MANAGE PROFILE ****/
Route::get('/manage_profile', [ManageProfileController::class, 'simpleView']);

/***** NEW POST ****/
Route::get('/new_post', [NewPostController::class, 'simpleView']);

/****** LOGOUT ********/
Route::get('/logout', function () {
    session() -> flush();
    return redirect('login');
});

/***** FETCHES *******/
Route::get('/signup/{username}', [SignupController::class, 'boolCheckUsername']);
Route::get('/check_post_like/{postId}', [HomeController::class, 'boolCheckPostLiked']);
Route::get('/likes_counter/{postId}', [HomeController::class, 'getPostNlikes']);
Route::get('/likes_viewer/{postId}', [HomeController::class, 'getPostLikes']);
Route::get('/get_user_info/{username}', [HomeController::class, 'getUserInfo']);
Route::get('/get_logged_user_info', [HomeController::class, 'getLoggedUserInfo']);
Route::get('/get_users_by_place/{città}', [HomeController::class, 'getUsersByPlace']);
Route::get('/store_new_like/{postId}', [HomeController::class, 'storeNewLike']);
Route::get('/delete_like/{postId}', [HomeController::class, 'deleteLike']);
Route::get('/get_places_visited_by_logged_user', [HomeController::class, 'getPlaces']);
Route::get('/get_feed_section', [HomeController::class, 'getFeedSection']);
Route::get('/get_logged_user_posts', [ManageProfileController::class, 'getLoggedUserPosts']);
Route::get('/delete_post/{postId}', [ManageProfileController::class, 'deletePost']);
Route::get('/RoadGoatAPI/{place}', [NewPostController::class, 'RoadGoatAPI']);
Route::get('/store_new_post/{id}/{name}', [NewPostController::class, 'storeNewPost']);









