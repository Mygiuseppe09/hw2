/************************************* GLOBAL VARIABLES *****************************/

const inSignUpName = document.querySelector('#inSignUpName');
const inSignUpSurname = document.querySelector('#inSignUpSurname');
const inSignUpUsername = document.querySelector('#inSignUpUsername');
const inSignUpemail = document.querySelector('#inSignUpemail');
const inSignUpPassword = document.querySelector('#inSignUpPassword');
const inSignUpCheckPassword = document.querySelector('#inSignUpCheckPassword');
const inSignUpBirthday = document.querySelector('#inSignUpBirthday');

const flags = {
    'name': '',
    'surname': '',
    'dateOfBirth': '',
    'username': '',
    'email': '',
    'password': '',
    'confirmPassword': ''
}

/************************************* FUNCTIONS ******************************/

function removeErrors(input) {
// rimuoviamo i msg di errori sottostanti all'input passato come parametro
    if (input.parentNode.querySelector('.errorInput')) {
        for (let boxError of input.parentNode.querySelectorAll('.errorInput'))
            boxError.remove();
    }
}


/************************************* EVENT'S HANDLERS ******************************/

function checkAllInput(event) {
    let problem;

    for (let value of Object.values(flags))
        if (value === 'error') {
            problem = 'TRUE';
            break;
        }

    if (problem === 'TRUE') {
        // impediadiamo l'invio al server dei dati
        event.preventDefault();

        // facciamo tremare il tasto invio
        document.querySelector('#submitButton').classList.add('shake');
        setTimeout(() => {
            document.querySelector('#submitButton').classList.remove('shake');
        }, 1000);

        // spariamo a schermo l'errore (se non lo si è già fatto prima)
        if (!document.querySelector('#errorBox div.error')) {
            const boxError = document.createElement('div');
            boxError.classList.add('error');
            const textElement = document.createElement('h3');
            textElement.innerText = 'SI SONO VERIFICATI I SEGUENTI ERRORI:';
            const unorderedListElement = document.createElement('ul');
            const errorType = document.createElement('li');
            errorType.innerText = 'Non hai inserito almeno uno dei campi';
            const adviceElement = document.createElement('h4');
            adviceElement.innerText = 'Inseriscili tutti e riprova';

            unorderedListElement.appendChild(errorType);
            boxError.appendChild(textElement);
            boxError.appendChild(unorderedListElement);
            boxError.appendChild(adviceElement);

            document.querySelector('#errorBox').appendChild(boxError);
        }
    }
}


function validateName(event) {
    /**********************************************************************************************
                            validazioni sul nome: campo non vuoto
     *********************************************************************************************/
    flags.name = 'error';
    const input = event.currentTarget;

    // rimuoviamo i msg di errori di un eventuale tentativo precedente
    removeErrors(input);

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorInput');

    if (input.value.length === 0) {
        input.classList.add('error');
        errorContainer.innerText = "campo vuoto";
        input.parentNode.appendChild(errorContainer);
    }
    else {
        // è tutto ok
        flags.name = 'ok';
        input.classList.remove('error');
    }
}


function validateSurname(event) {
    /**********************************************************************************************
                            validazioni sul cognome: campo non vuoto
     *********************************************************************************************/
    flags.surname = 'error';
    const input = event.currentTarget;

    // rimuoviamo il msg di errore di un eventuale tentativo precedente
    removeErrors(input);

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorInput');

    if (input.value.length === 0) {
        input.classList.add('error');
        errorContainer.innerText = "campo vuoto";
        input.parentNode.appendChild(errorContainer);
    }
    else {
        // è tutto ok
        flags.surname = 'ok';
        input.classList.remove('error');
    }
}


function validateUsername(event) {
    /**********************************************************************************************
                validazioni sull'username: campo non vuoto, lunghezza, già in uso
     *********************************************************************************************/
    flags.username = 'error';
    const input = event.currentTarget;

    // rimuoviamo i msg di errori di un eventuale tentativo precedente
    removeErrors(input);

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorInput');

    // check sul campo vuoto
    if (input.value.length === 0) {
        input.classList.add('error');
        errorContainer.innerText = "campo vuoto";
        input.parentNode.appendChild(errorContainer);
    }
    else if (input.value.length < 8) {
        input.classList.add('error');
        errorContainer.innerText = "lunghezza minima: 8 caratteri";
        input.parentNode.appendChild(errorContainer);
    }
    else
        // se il campo non è vuoto e l'username è lungo almeno 8 caratteri,
        // controlliamo il database e vediamo se non è già in uso
        fetch('/signup/' + input.value).then(onResponse).then(onUsername);
}


function validateEmail(event) {
    /**********************************************************************************************
                        validazioni sulla mail: campo non vuoto
     *********************************************************************************************/
    flags.email = 'error';
    const input = event.currentTarget;

    // rimuoviamo i msg di errori di un eventuale tentativo precedente
    removeErrors(input);

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorInput');

    if (input.value.length === 0) {
        input.classList.add('error');
        errorContainer.innerText = "campo vuoto";
        input.parentNode.appendChild(errorContainer);
    }
    else {
        // è tutto ok
        flags.email = 'ok';
        input.classList.remove('error');
    }
}

function validateDateOfBirth(event) {
    /**********************************************************************************************
                            validazioni sula data di nascita:
     campo non vuoto, minima e massima età (4 anni => 110 anni), anno input minore di quello attuale
     *********************************************************************************************/
    flags.dateOfBirth = 'error';
    const input = event.currentTarget;

    // rimuoviamo i msg di errori di un eventuale tentativo precedente
    removeErrors(input);

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorInput');

    // recuperiamo l'anno corrente
    const date = new Date();
    let today = date.getFullYear();
    let dateOfBirth = parseInt(input.value);

    if (input.value.length === 0) {
        input.classList.add('error');
        errorContainer.innerText = "campo vuoto";
        input.parentNode.appendChild(errorContainer);
    }
    else if ((today - dateOfBirth) < 0) {
        input.classList.add('error');
        errorContainer.innerText = "Non è consentito l'accesso a chi viene dal futuro";
        input.parentNode.appendChild(errorContainer);
    }
    else if ((today - dateOfBirth) < 4) {
        input.classList.add('error');
        errorContainer.innerText = "L'età minima per l'iscrizione è di 4 anni";
        input.parentNode.appendChild(errorContainer);
    }
    else if ((today - dateOfBirth) > 110) {
        input.classList.add('error');
        errorContainer.innerText = "Non è consentito l'accesso a chi ha più di 110 anni.. " +
            "D'altronde, a quell'età, è difficile viaggiare!";
        input.parentNode.appendChild(errorContainer);
    }
    else {
        // è tutto ok
        flags.dateOfBirth = 'ok';
        input.classList.remove('error');
    }
}


function validatePassword(event) {
    /**********************************************************************************************
                                    validazioni sula password:
     campo non vuoto, lunghezza, minuscola, maiuscola, numero, numero, carattere speciale
     *********************************************************************************************/
    flags.password = 'error';
    const input = event.currentTarget;

    // rimuoviamo i msg di errori di un eventuale tentativo precedente
    removeErrors(input);

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorInput');

    if (input.value.length === 0) {
        input.classList.add('error');
        errorContainer.innerText = "campo vuoto";
        input.parentNode.appendChild(errorContainer);
    }
    else if (input.value.length < 8) {
        input.classList.add('error');
        errorContainer.innerText = "La password deve essere lunga almeno 8 caratteri";
        input.parentNode.appendChild(errorContainer);
    }
    else if (!input.value.match(/[a-z]/g)) {
        input.classList.add('error');
        errorContainer.innerText = "La password deve contenere almeno una minuscola";
        input.parentNode.appendChild(errorContainer);
    }
    else if (!input.value.match(/[A-Z]/g)) {
        input.classList.add('error');
        errorContainer.innerText = "La password deve contenere almeno una maiuscola";
        input.parentNode.appendChild(errorContainer);
    }
    else if (!input.value.match(/[0-9]/g)) {
        input.classList.add('error');
        errorContainer.innerText = "La password deve contenere almeno un numero";
        input.parentNode.appendChild(errorContainer);
    }
    else if (!input.value.match(/[^a-zA-Z\d]/g)) {
        input.classList.add('error');
        errorContainer.textContent = "La password deve contenere almeno un carattere speciale";
        input.parentNode.appendChild(errorContainer);
    }
    else {
        // è tutto ok
        flags.password = 'ok';
        input.classList.remove('error');
    }
}

function validateConfirmPassword(event) {
    /**********************************************************************************************
                validazioni sul nome: campo non vuoto, campo uguale alla password
     *********************************************************************************************/
    flags.confirmPassword = 'error';
    const input = event.currentTarget;

    // rimuoviamo i msg di errori di un eventuale tentativo precedente
    removeErrors(input);

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorInput');

    if (input.value.length === 0) {
        input.classList.add('error');
        errorContainer.innerText = "campo vuoto";
        input.parentNode.appendChild(errorContainer);
    }
    else if (input.value !== inSignUpPassword.value) {
        input.classList.add('error');
        errorContainer.innerText = "Le due password non combaciano";
        input.parentNode.appendChild(errorContainer);
    }
    else {
        // è tutto ok
        flags.confirmPassword = 'ok';
        input.classList.remove('error');
    }
}

    /********************************** PROMISE'S HANDLERS ******************************/

    function onUsername(json) {
        if (json.exists === 'TRUE') {
            inSignUpUsername.classList.add('error');

            const errorContainer = document.createElement('div');
            errorContainer.classList.add('errorInput');
            errorContainer.innerText = "l'username è già presente nel nostro database";
            inSignUpUsername.parentNode.appendChild(errorContainer);
        }
        else {
            // è tutto ok (perchè gli altri potenziali problema sono stati verificati prima della fetch)
            flags.username = 'ok';
            inSignUpUsername.classList.remove('error');
        }
    }

    function onResponse(response) {
        return response.json();
    }

    /********************************************************************************************/

// Aggiungiamo dei listener all'evento "blur" (quando si esce dall'input) ai campi che vogliamo validare
    inSignUpName.addEventListener('blur', validateName);
    inSignUpSurname.addEventListener('blur', validateSurname);
    inSignUpUsername.addEventListener('blur', validateUsername);
    inSignUpemail.addEventListener('blur', validateEmail);
    inSignUpPassword.addEventListener('blur', validatePassword);
    inSignUpCheckPassword.addEventListener('blur', validateConfirmPassword);
    inSignUpBirthday.addEventListener('blur', validateDateOfBirth);

// quando clicchiamo su registrati, controlliamo che non ci sia nessun errore
    document.querySelector('#formSignup').addEventListener('submit', checkAllInput);
