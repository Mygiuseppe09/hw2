<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <title>{{config('app.name')}} - Registrati</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="{{asset('css/common-styles.css')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('css/signup.css')}}">
    <script src="{{asset('js/signup.js')}}" defer></script>
    <!-- FONT: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>

<div class="center_internal_items">
    @include('errors_input')
    <div id="errorBox"></div>
    <h1>Registrati a TripBook</h1>
    <div class="signup_container">
        <div class="form_container">
            <form enctype="multipart/form-data" id="formSignup" method="post" action="/signup">
                {{ csrf_field() }}
                <label for="inSignUpName"><input placeholder="nome" type="text" name="name" id="inSignUpName"></label>
                <label for="inSignUpSurname"><input placeholder="cognome" type="text" name="surname" id="inSignUpSurname"></label>
                <div class="input_radio_container">
                    <label for=inSignUpSexMale""><input type="radio" name="gender" id="inSignUpSexMale" value="M">Maschio</label>
                    <label for="inSignUpSexFemale"><input type="radio" name="gender" id="inSignUpSexFemale" value="F">Femmina</label>
                </div>
                <label for="inSignUpBirthday"><input type="date" name="birthday" id="inSignUpBirthday"></label>
                <label for="inSignUpUsername"><input placeholder="username" type="text" name="username" id="inSignUpUsername"></label>
                <label for="inSignUpemail"><input placeholder="email" type="email" name="email" id="inSignUpemail"></label>
                <label for="inSignUpPassword"><input placeholder="password" type="password" name="password" id="inSignUpPassword"></label>
                <label for="inSignUpCheckPassword"><input placeholder="digita nuovamente la password" type="password" name="check_password" id="inSignUpCheckPassword"></label>
                <input id="submitButton" class="button submit_button" type="submit" value="REGISTRATI">
            </form>
        </div>
    </div>
</div>



</body>
</html>


