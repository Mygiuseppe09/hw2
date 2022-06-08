<!DOCTYPE html>
<html lang="{{str_replace('_', '-', app()->getLocale())}}">
<head>
    <title> {{config('app.name')}} - GESTISCI PROFILO </title>
    <link rel="stylesheet" href="{{asset('css/common-styles.css')}}">
    <link rel="stylesheet" href="{{asset('css/home.css')}}">
    <link rel="stylesheet" href="{{asset('css/manage_profile.css')}}">
    <script src='{{asset('js/manage_profile.js')}}' defer></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- FONT: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
</head>

<body>

@include('navbar')

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
        <h1> I tuoi post: </h1>

        <div class="feed__posts">
            <!-- da generare dinamicamente -->
        </div>
    </div>

    <div class="home_container__right">
        <div class="places_visited_by_logged_user">
            <h3 class="margin"> HAI VISITATO: </h3>
            <div class="list_places"> <!-- da generare dinamicamente --> </div>
        </div>
        <div class="deleteFeedback hidden"></div>
        <div class="delete_posts">
            <a class="button" id="deletePostsButton"> ELIMINA POST </a>
        </div>
    </div>
</div>

@include('like_modal_view')
@include('footer')
</body>
</html>
