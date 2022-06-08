<!DOCTYPE html>
<html lang="{{str_replace('_', '-', app()->getLocale())}}">
<head>
    <title> {{config('app.name')}} - NUOVO POST </title>
    <link rel="stylesheet" href="{{asset('css/common-styles.css')}}">
    <link rel="stylesheet" href="{{asset('css/new_post.css')}}">
    <script src='{{asset('js/new_post.js')}}' defer></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- FONT: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
</head>

<body>

@include('navbar')

<div class="video_background_container">
    <div class="overlay"></div>

    <div class="on_video">

        <div id="formOutputContainer">

            <form action="" id="newPostForm" >
                <h2>DOVE SEI STATO?</h2>
                <label for="inNewPostPlace"><input placeholder="es: Rome" type="text" name="place" id="inNewPostPlace"></label>
                <input id="submitButton" class="button" type="submit" value="CERCA">
            </form>

            <form action="/save_images" method="POST" enctype="multipart/form-data" name="upload">
                {{ csrf_field() }}
                <label class="hidden" id="imageLabel" for="imagesInput"> SELEZIONA LE IMMAGINI
                    <input type='file' name="images[]" id="imagesInput" accept='image/*' multiple>
                </label>
                <input id="submit" class="button hidden" type="submit" value="PUBBLICA">
                <input type="text" class="hidden" value="" name="postId" id="postIdtToServer">
            </form>

            @include('loader')

            <div id="placesResults" class="hidden"></div> <!-- feedback sulla ricerca -->

            <div id="outputPlaces" class="hidden"> <!-- da generare dinamicamente --> </div>

            <!--  <div id="isPostedFeedback" class="hidden"></div> -->

            <div id="API_attribution" class="">
                Powered by
                <img src="{{asset('icons/logo-API.png')}}" alt="">
            </div>

        </div>

    </div>
    <video autoplay muted loop>
        <source src="{{asset('videos/new_post_video_background.mp4')}}" type="video/mp4"/>
    </video>
</div>


</body>

</html>

