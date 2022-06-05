@if (count($errors) > 0 )
    <div class="error">
        <h3>SI SONO VERIFICATI I SEGUENTI ERRORI:</h3>
        <ul>
            @foreach($errors -> all() as $error)
                <li> {{$error}} </li>
            @endforeach
        </ul>
        <h4>Inserisci nuovamente i campi in modo corretto e riprova</h4>
    </div>
@endif
