<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <title>{{config('app.name')}}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- CSS -->
        <link rel="stylesheet" href="{{asset('css/common-styles.css')}}">
        <link rel="stylesheet" href="{{asset('css/index.css')}}">
        <!-- FONT: Inter -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
    </head>

    <body>

    <div class="video_background_container">
        <div class="overlay"></div>
        <div class="on_video">
            <h1> TripBook </h1>
            <h2> Il social per chi ama viaggare </h2>
        </div>
        <video autoplay muted loop>
            <source src="{{asset('videos/index_video_background.mp4')}}" type="video/mp4"/>
        </video>
    </div>

    <a href="/login" class="button" id="do_login">AVVIA WEB APP</a>

    </body>

</html>
