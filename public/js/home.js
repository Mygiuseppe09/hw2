/************************************* FUNCTIONS ******************************/
function checkIfThePostIsLikedByLoggedUser(postId) {
    fetch("/check_post_like/" + postId).then(onResponse).then(setLike);
}

function refreshAllPostsLikes() {
    // Refresh dei like relativi ai posts presenti nella home
    const posts = document.querySelectorAll('.post');
    for (let post of posts) {
        // facciamo attenzione al fatto che all'id va tolto "postID"
        const filtred_postId = post.id.replace("postID","");
        fetch("/likes_counter/" + filtred_postId).then(onResponse).then(onNlikesJson);
    }
}

/************************************* EVENT'S HANDLERS ******************************/

function openLikeModalView(event) {
    const postId = event.currentTarget.dataset.postId;

    fetch("/likes_viewer/" + postId).then(onResponse).then(onLikesJson);
}

function setLike(json) {
    // qui arriva un json con l'id del post e TRUE o FALSE in base se c'è un mi piace da parte dell'utente loggato

    //selezioniamo il post relativo e il bottone mi piace
    const post = document.querySelector('#postID' + json.postId);
    const likeButton = post.querySelector('.like_button');

    if (json.is_liked === 'TRUE')
        // allora mettiamo l'immagine colorata al bottone del post
        likeButton.src = "icons/liked.png";
    else
        likeButton.src = "icons/like_empty.png";
}

function putLikeOnPost(event) {
    // dall'utente loggato è stato cliccato il tasto mi piace (img) di un post
    // n.b per ogni tasto mi piace c'è un data-id settato con l'id del post
    const postId = event.currentTarget.dataset.postId;

    // ora bisogna controllare il db e vedere se il suo like al post c'era già:
    // se non c'è, metto like nel e coloro il cuoricino
    // se c'è, lo tolgo dal db e svuoto il cuoricino
    fetch("/check_post_like/" + postId).then(onResponse).then(onBoolLikeJson);
}

function closeSearchUsers() {
    // una volta che clicco il bottono CHIUDI questo va nascosto
    const closeButton = document.querySelector('.search_users_by_cities .close_button');
    closeButton.classList.add('hidden');

    // nascondiamo sia il box di feedback che la lista (vuota o piena che sia)
    document.querySelector('#areThereMatchesFeedback').classList.add('hidden');
    document.querySelector('#listUsers').classList.add('hidden');
    document.querySelector('#userInfo').classList.add('hidden');
}

function getUserInfo(event) {
    const nomeUtente = event.currentTarget.dataset.nomeUtente;
    fetch('/get_user_info/' +  nomeUtente).then(onResponse).then(onUserByUsernameJson);

}

function searchUsersByPlace(event) {
    event.preventDefault();

    // Facciamo comparire l'animazione di Loading
    document.querySelector('.search_users_by_cities .loader').classList.remove('hidden');

    // nascondiamo i risultati (se ci sono) precedenti
    document.querySelector('#areThereMatchesFeedback').classList.add('hidden');
    document.querySelector('#listUsers').classList.add('hidden');

    const input = document.querySelector('#inCity').value;
    if (input) {
        const encodedInput = encodeURIComponent(input);
        fetch('/get_users_by_place/' + encodedInput).then(onResponse).then(onUsersByPlaceJson);
    }
}

/********************************** PROMISE'S HANDLERS ***************************/

function onLikesJson(json) {
    document.querySelector('.like_modal').classList.remove('hidden');
    document.querySelector('#closeLikeModal').addEventListener('click',() =>
        document.querySelector('.like_modal').classList.add('hidden'));

    const listBox = document.querySelector('.list_users_like');
    listBox.innerHTML = '';

    for (let user of json) {
        /*
            <div class="user">
                        <div class="like_avatar_container image_container"><img class="image" src="icons/girl_avatar.png" alt=""></div>
                        <h4>@Maria_Rossi</h4>
                    </div>
        */
        const userBox = document.createElement('div');
        userBox.classList.add('user');
        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('like_avatar_container');
        avatarContainer.classList.add('image_container');
        const avatarIMG = document.createElement('img');
        avatarIMG.classList.add('image');
        if (user.gender === 'M')
            avatarIMG.src = 'icons/avatar.png';
        else avatarIMG.src = 'icons/girl_avatar.png';
        const usernameText = document.createElement('h4');
        usernameText.innerText = '@' + user.user;

        avatarContainer.appendChild(avatarIMG);
        userBox.appendChild(avatarContainer);
        userBox.appendChild(usernameText);
        listBox.appendChild(userBox);
    }
}

function onNlikesJson(json) {
    // ho nel json l'id del post da aggiornare e i suoi like

    const post = document.querySelector('#postID' + json.postId);
    const likesCounter = post.querySelector('.likes_counter');
    likesCounter.innerText = 'Piace a ' + json.nlikes + ' utenti';
}

function finallyPutLike(json) {
    const postId = json.postId;

    // coloriamo il like del post associato: selezionamolo
    const likeIMG = document.querySelector('#postID'+ postId + ' img.like_button');
    likeIMG.src = "icons/liked.png"

    refreshAllPostsLikes();
}

function finallyRemoveLike(json) {
    const postId = json.postId;

    // DEcoloriamo il like
    const likeIMG = document.querySelector('#postID'+ postId + ' img.like_button');
    likeIMG.src = "icons/like_empty.png"

    refreshAllPostsLikes();
}

function onBoolLikeJson(json) {
    //reperiamo l'id del POST
    const postId = json.postId;

    if (json.is_liked === 'FALSE') {
        // Va messo il mi piace
        fetch("/store_new_like/" + postId).then(onResponse).then(finallyPutLike);

    }
    else {
        // va tolto il mi piace
        fetch("/delete_like/" + postId).then(onResponse).then(finallyRemoveLike);

    }
}

function onPostsJson(json) {
    console.log("json restituito dalla route 'get_feed_section' => function: getFeedSection");
    console.log(json);
    if (json.length === 0) {
        // allora non ci sono posts nel DataBase
        const boxError = document.createElement('div');
        boxError.id = "FeedSectionIsEmpty";
        boxError.classList.add('text_align_center');
        boxError.innerText = 'Nessun utente, compreso te, ha mai postato qualcosa...';
        boxError.style.color ='black';

        document.querySelector('.feed').appendChild(boxError);
    }
    else {
        // ci sono Posts :)

        // agganciamoci al nodo HTML e svuotiamolo
        const feedSection = document.querySelector('.feed');
        feedSection.innerHTML = '';

        for (let post of json) {
            //creiamo gli elementi del post e inseriamo i contenuti del json
            const postContainer = document.createElement('div');
            postContainer.classList.add('post');
            postContainer.id = 'postID' + post.id; // necessario ai likes
            postContainer.dataset.id = post.id;
            const contentContainer = document.createElement('div');
            contentContainer.classList.add('post__content');
            const icon_Container = document.createElement('div');
            icon_Container.classList.add('icon_container');
            icon_Container.classList.add('post__avatar');
            const iconImg = document.createElement('img');
            iconImg.classList.add('image');
                if (post.user_gender === 'M')
                    iconImg.src = 'icons/avatar.png';
                else
                    iconImg.src = 'icons/girl_avatar.png';
            const textPost = document.createElement('h3');
            textPost.innerText = '@' + post.user + ' ha vistitato: ' + '"' + post.name_place + '"';

            // sezione relativa alle immagini allegate ai post
            const imagesContainer = document.createElement('div');
            imagesContainer.classList.add('post_images');

            if (post.images_urls != null) {
                for (let image_url of post.images_urls) {
                    const imageContainer = document.createElement('div');
                    imageContainer.classList.add('image_container');
                    const image = document.createElement('img');
                    image.classList.add('image');
                    image.src = image_url;

                    imageContainer.appendChild(image);
                    imagesContainer.appendChild(imageContainer);
                }
            }

            // LIKES..
            const likeButtonContainer = document.createElement('div');
            likeButtonContainer.classList.add('icon_container');
            const likeButtonImg = document.createElement('img');
            likeButtonImg.classList.add('image');
            likeButtonImg.classList.add('like_button');

            // associamo all'immagine "Mi Piace" l'id del post su cui è messa
            likeButtonImg.id = 'postID' + post.id;
            likeButtonImg.dataset.postId = post.id;
            likeButtonImg.addEventListener('click', putLikeOnPost);

            const infoPostContainer = document.createElement('div');
            infoPostContainer.classList.add('post__informations');
            const dateText = document.createElement('p');
            // sistemiamo l'ora e il giorno
            const dateArray = post.time.split("-");
            const day = dateArray[2].split(" "); //in day[0] abbiamo il giorno
                                                // in day[1] abbiamo l'ora (anche i secondi)
            const hour = day[1].split(":");
            dateText.innerText = day[0] + "/" + dateArray[1] + "/" + dateArray[0] + " alle " + hour[0] + ":" + hour[1];
            const numberLikesText = document.createElement('p');

            numberLikesText.classList.add('likes_counter');
            numberLikesText.innerText = 'Piace a ' + post.nlikes + ' utenti';
            numberLikesText.dataset.postId = post.id; //per la modale dei like
            numberLikesText.addEventListener('click',openLikeModalView);

            // formattazione
            icon_Container.appendChild(iconImg);
            likeButtonContainer.appendChild(likeButtonImg);
            contentContainer.appendChild(icon_Container);
            contentContainer.appendChild(textPost);
            contentContainer.appendChild(likeButtonContainer);
            infoPostContainer.appendChild(dateText);
            infoPostContainer.appendChild(numberLikesText);
            postContainer.appendChild(contentContainer);
            postContainer.appendChild(imagesContainer);
            postContainer.appendChild(infoPostContainer);

            feedSection.appendChild(postContainer);

            // LIKES..
            checkIfThePostIsLikedByLoggedUser(post.id);
        }
    }
}

function onUserByUsernameJson(json) {
    // voglio che compaia sopra, al click del bottone "CONTATTA", un box con la mail dell'utente...
    let email = json.email;

    const box = document.querySelector('#userInfo');
    box.classList.remove('hidden');
    box.innerText = email;
}

function onUsersByPlaceJson(json) {

    // il timeout serve solo a mostrare un po' l'animazione
    setTimeout(() => {

        if (json.length === 0) {
            // allora non sono state trovate corrispondenze

            // inizializziamo la lista degli utenti (visto che sarà vuota)
            const listUsersContainer = document.querySelector('#listUsers');
            listUsersContainer.innerHTML = '';

            //togliamo il loader
            document.querySelector('.search_users_by_cities .loader').classList.add('hidden');

            // mostriamo il box di errore
            const boxFeedback = document.querySelector('#areThereMatchesFeedback');
            boxFeedback.classList.remove('hidden');
            boxFeedback.classList.remove('success');
            boxFeedback.classList.add('error');
            boxFeedback.classList.add('text_align_center');
            boxFeedback.innerText = "non sono state trovate corrispondenze";
        }
        else {
            // ci sono corrispondenze

            //togliamo il loader
            document.querySelector('.search_users_by_cities .loader').classList.add('hidden');

            // mostriamo il box di successo
            const boxFeedback = document.querySelector('#areThereMatchesFeedback');
            boxFeedback.classList.remove('hidden');
            boxFeedback.classList.remove('error');
            boxFeedback.classList.add('success');
            boxFeedback.classList.add('text_align_center');
            boxFeedback.innerText = "sono stati trovati " + json.length + " utenti";

            // selezioniamo i nodi HTML che ci interessa "ripempire"
            const listUsersContainer = document.querySelector('#listUsers');
            listUsersContainer.classList.remove('hidden');
            listUsersContainer.innerHTML = '';

            for (let user of json) {
                let username = user.username;

                const userContainer = document.createElement('div');
                userContainer.classList.add('list_item');
                const genericIconContainer = document.createElement('div');
                genericIconContainer.classList.add('icon_container');
                const iconIMG = document.createElement('img');
                iconIMG.classList.add('image');
                iconIMG.src = 'icons/generic_user.png';
                const textElement = document.createElement('h4');
                const viewMailButton = document.createElement('a');
                viewMailButton.classList.add('button')
                viewMailButton.innerText = 'CONTATTA';

                textElement.innerText = '@' + username;

                // per il click sugli utenti...
                viewMailButton.dataset.nomeUtente = username;
                viewMailButton.addEventListener('click', getUserInfo);

                // formattazione
                genericIconContainer.appendChild(iconIMG);
                userContainer.appendChild(genericIconContainer);
                userContainer.appendChild(textElement);
                userContainer.appendChild(viewMailButton);

                listUsersContainer.appendChild(userContainer);
            }
        }

        // mostriamo il tasto chiudi
        const closeButton = document.querySelector('.search_users_by_cities .close_button');
        closeButton.classList.remove('hidden');
        closeButton.addEventListener('click', closeSearchUsers);

    }, 1000);

}

function onUserJson(json) {
        // selezioniamo i nodi HTML che ci interessa "ripempire"
        const name = document.querySelector('#name');
        const username = document.querySelector('#username');
        const userAvatarContainer = document.querySelector('#userAvatar');
        const nPosts = document.querySelector('.user_informations__posts p');
        const nPlaces = document.querySelector('.user_informations__places p');

        // formatto
        name.innerText = '';
        username.innerText = '';
        userAvatarContainer.innerHTML = '';
        nPosts.innerText = '';
        nPlaces.innerText = '';

        // immagine che varia in base al sesso
        let src = undefined;
        if (json.gender === 'F')
            src = 'icons/girl_avatar.png';
        else
            src = 'icons/avatar.png';

        // creo l'elemento immagine e lo stilizzo
        const icon = document.createElement('img');
        icon.classList.add('image');
        icon.alt = 'image not found';

        // inizializzazione
        name.innerText = json.name + ' ' + json.surname;
        username.innerText = '@' + json.username;
        icon.src = src;
        nPosts.innerText = json.nposts;
        nPlaces.innerText = json.nplaces;

        // formattazione
        userAvatarContainer.appendChild(icon);
}

function onPlacesJson(json) {
        // selezioniamo i nodi HTML che ci interessa "ripempire"
        const listPlacesDIV = document.querySelector('.list_places');
        listPlacesDIV.innerHTML = ''; //inizializzo

        //cicliamo il json (array)
        for (let place of json) {
            // prendiamo quello che vogliamo utilizzare per ogni elemento dell'array
            const namePlace = place.name;

            // creiamo gli elementi HTML e gli diamo degli stili aggiungendogli classi
            const placeContainer = document.createElement('div');
            placeContainer.classList.add('list_item');
            const pinContainer = document.createElement('div');
            pinContainer.classList.add('icon_container');
            const pinIcon = document.createElement('img');
            pinIcon.classList.add('image');
            pinIcon.src = 'icons/pin.png';
            pinIcon.alt = 'icon not found';
            const textContainer = document.createElement('h4');

            // inizializzazione
            textContainer.innerText = namePlace;

            // formattazione
            pinContainer.appendChild(pinIcon);
            placeContainer.appendChild(pinContainer);
            placeContainer.appendChild(textContainer);

            listPlacesDIV.appendChild(placeContainer);
        }
}

function onResponse(response) {
    return response.json();
}

/********************************************************************************************/

fetch("/get_places_visited_by_logged_user").then(onResponse).then(onPlacesJson);
fetch("/get_logged_user_info").then(onResponse).then(onUserJson);
fetch('/get_feed_section').then(onResponse).then(onPostsJson);

document.querySelector('#search_bar').addEventListener('submit',searchUsersByPlace);

/* al click del pulsante impostazioni mandiamo l'utente loggato alla pagina di gestione profilo */
document.querySelector('.nav__right .icon_container')
    .addEventListener('click', () => window.location.href = '/manage_profile');





