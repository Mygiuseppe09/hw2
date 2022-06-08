<!DOCTYPE html>
<html lang="{{str_replace('_', '-', app()->getLocale())}}">
<head>
    <title> {{config('app.name')}} - Home </title>
    <link rel="stylesheet" href="{{asset('css/common-styles.css')}}">
    <link rel="stylesheet" href="{{asset('css/home.css')}}">
    <script src='{{asset('js/home.js')}}' defer></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- FONT: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
</head>

<body>

<nav>
    <div class="nav_container">
        <div class="nav__left">
            <h1>TripBook</h1>
        </div>
        <div class="nav__right">
            <div class="icon_container"><img class="image" src="{{asset('icons/settings.png')}}" alt=""></div>
            <a id="manageProfileButton" href="/manage_profile" class="button">GESTISCI PROFILO</a>
            <a id="logoutButton" href="/logout" class="button">LOGOUT</a>

        </div>
    </div>
</nav>

<div class="home_container">

    <div class="profile">
        <h1 id="name"><!-- da generare dinamicamente --></h1>
        <h3 id="username"><!-- da generare dinamicamente --></h3>
        <div id="userAvatar" class="rounded_image_container"><!-- da generare dinamicamente --></div>
        <div class="user_informations">
            <div class="user_informations__posts">
                <h3>POST</h3>
                <p> <!-- da generare dinamicamente --> </p>
            </div>
            <div class="user_informations__places">
                <h3>LUOGHI VISITATI</h3>
                <p> <!-- da generare dinamicamente --> </p>
            </div>
        </div>

        <a class="button" id="new_post" href="/new_post"> NUOVO POST </a>

    </div>

    <div class="feed">
        <!-- da generare dinamicamente -->

        <!-- esempio:
            <div class="post" id="postID14" data-id="14">
            <div class="post__content">
                <div class="icon_container post__avatar"><img class="image" src="icons/avatar.png"></div>
                <h3>@Mygiuseppe09 ha vistitato: "Paris, France"</h3>
                <div class="icon_container">
                    <img class="image like_button" id="postID14" data-post-id="14" src="icons/liked.png">
                </div>
            </div>
            <div class="post_images">
                <div class="image_container"><img class="image"  src="post_images/paris.jpg"></div>
                <div class="image_container"><img class="image"  src="post_images/paris2.jpg"></div>
                <div class="image_container"><img class="image"  src="post_images/paris3.jpg"></div>
            </div>
            <div class="post__informations">
                <p>2022-06-06 12:47:20</p>
                <p class="likes_counter" data-post-id="14">Piace a 1 utenti</p>
            </div>
        </div>
         -->

    </div>

    <div class="home_container__right">

        <div class="places_visited_by_logged_user">
            <h3 class="margin"> HAI VISITATO: </h3>
            <div class="list_places"> <!-- da generare dinamicamente --> </div>
        </div>

        <div class="search_users_by_cities">
            <h4 class="margin title"> Vuoi viaggiare in una città e vuoi consigli da chi ci è già stato? </h4>
            <h5 class="margin"> Inseriscila nella barra apposita: ti verranno mostrati gli utenti TripBook che vi sono stati </h5>

            <form method="get" id="search_bar">
                <div class="center"><label for="inCity"><input placeholder="es: Rome" type="text" name="city" id="inCity"></label></div>
                <input class="button" type="submit" value="CERCA">
            </form>

            <div id="areThereMatchesFeedback" class="hidden"></div>

            <div id="userInfo" class="hidden"></div>
            <div id="listUsers"> <!-- da generare dinamicamente --> </div>
            @include('loader')
            <div class="close_button hidden">CHIUDI</div>
        </div>
    </div>
</div>

@include('like_modal_view')
@include('footer')

</body>
</html>
