/************************************* EVENT'S HANDLERS ******************************/

function storeThePost(event) {
    //reperiamo l'id del luogo scelto
    const id = event.currentTarget.dataset.id;
    const name = event.currentTarget.dataset.name;

    // lato server carico il post sul DB
    fetch("/store_new_post/" + id + "/" + name).then(onResponse).then(storeThePost2);
}


function callAPI(event) {
    event.preventDefault();

    //facciamo comparire il loading
    document.querySelector('#formOutputContainer .loader').classList.remove('hidden');

    //nascondiamo quello che sta sotto (scorse ricerche)
    document.querySelector('#outputPlaces').classList.add('hidden');
    document.querySelector('#placesResults').classList.add('hidden');

    const input = document.querySelector('#inNewPostPlace').value;

    if (input) {
        const encodedInput = encodeURIComponent(input);

        fetch("/RoadGoatAPI/" + encodedInput).then(onResponse).then(onJson);
    }

}

/********************************** PROMISE'S HANDLERS ******************************/

function storeThePost2(json) {
    if (json.is_post_stored === 'TRUE') {
        // nascondiamo le città mostrate precedentemente
        document.querySelector('#placesResults').classList.add('hidden');
        document.querySelector('#outputPlaces').classList.add('hidden');

        // mostriamo il pulsante per aggiungere le immagini
        document.querySelector('#inNewPostPlace').classList.add('hidden');
        document.querySelector('#submitButton').classList.add('hidden');
        document.querySelector('#newPostForm h2').classList.add('hidden');
        document.querySelector('#API_attribution').classList.add('hidden');
        document.querySelector('#imageLabel').classList.remove('hidden');

        // non appena l'utente seleziona le immagini...
        document.querySelector('#imagesInput').addEventListener('change',
            () => {
            // spediamo il postId al Server
            document.querySelector('#postIdtToServer').value = json.postId;

            // nascondiamo tutto il resto
            document.querySelector('#imageLabel').classList.add('hidden');
            document.querySelector('#API_attribution').classList.add('hidden');
            document.querySelector('h2').classList.add('hidden');

            // mostriamo solo il tasto 'pubblica'
            const submit = document.querySelector('#submit');
            submit.classList.remove('hidden');
        });
    }
}

function onJson(json) {
    console.log(json);
    // avendo fatto partire il loader prima della fetch, ora lo nascondiamo
    document.querySelector('#formOutputContainer .loader').classList.add('hidden');

    if (json.data.length === 0) {
        // NON sono state trovate corrispondenze
        const boxResult = document.querySelector('#placesResults');
        boxResult.innerText = '';
        boxResult.classList.remove('hidden');
        boxResult.classList.remove('success');
        boxResult.classList.add('error');
        boxResult.innerText = '0 risultati, riprova';
    }
    else {
        // sono state trovate corrispondenze :)
        const boxResult = document.querySelector('#placesResults');
        boxResult.innerText = '';
        boxResult.classList.remove('hidden');
        boxResult.classList.remove('error');
        boxResult.classList.add('success');
        boxResult.innerText = 'Seleziona la città corretta';

        // a questo punto prendo i risultati e li mostro
        document.querySelector('#placesResults').classList.remove('hidden');
        document.querySelector('#outputPlaces').classList.remove('hidden');

        const cities = json.data;

        // agganciamoci al nodo HTML
        const box = document.querySelector('#outputPlaces');
        box.innerHTML = '';

        // mostriamo max 5 città utilizzando un contatore
        let limiter = 0;
        for (let city of cities) {
            if (limiter === 5)
                break;

            const name = city.attributes.name;
            const id = city.id;

            const nameContainer = document.createElement('div');
            const nameElement = document.createElement('a');
            nameElement.classList.add('clickable');
            nameElement.dataset.name = name;
            nameElement.dataset.id = id; // da mettere nel database
            nameElement.innerText = name;

            // aggiungiamo il lister al click per ogni città
            nameElement.addEventListener('click', storeThePost);

            nameContainer.appendChild(nameElement);
            box.appendChild(nameContainer);

            limiter ++;
        }
    }
}

function onResponse(response) {
    console.log(response);
    return response.json();
}

/********************************************************************************************/
document.querySelector('#newPostForm').addEventListener('submit', callAPI);
