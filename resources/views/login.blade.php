<!DOCTYPE html>
<html lang="{{str_replace('_', '-', app()->getLocale())}}">
<head>
    <title> {{config('app.name')}} - Login </title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="{{asset('css/common-styles.css')}}">
    <link rel="stylesheet" href="{{asset('css/login.css')}}">
    <!-- FONT: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>

@include('errors_input')

    <h1>Accedi a TripBook</h1>

    <div class="login_container">

        <div class="video_intro_container">
            <video autoplay muted loop>
                <source src="{{asset('videos/intro.mp4')}}" type="video/mp4"/>
            </video>
        </div>

        <div class="form_container">
            <form enctype="multipart/form-data" method="post" action="/login">
                {{ csrf_field() }}
                <div><label for="inLoginUsername"><input placeholder="nome utente" type="text" name="username" id="inLoginUsername"></label></div>
                <div><label for="inLoginPassword"><input placeholder="password" type="password" name="password" id="inLoginPassword"></label></div>
                <input class="button submit_button" type="submit" value="ACCEDI">
            </form>
        </div>
    </div>
    <p> Non hai ancora un account? <a id="signup_button" class="button" href="/signup">Registrati</a></p>


</body>
</html>

