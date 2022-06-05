/************************************* EVENT'S HANDLERS ******************************/

function openLikeModalView(event) {
    const postId = event.currentTarget.dataset.postId;

    fetch("/likes_viewer/" + postId).then(onResponse).then(onLikesJson);
}

function deletePost(event) {
    const postId = event.currentTarget.dataset.id;
    fetch("/delete_post/" + postId).then(onResponse).then(onDeletePostJson);
}

function showDeleteButtons(event) {
    const deleteButtons = document.querySelectorAll('#deletePostButton');
    for (let button of deleteButtons) {
        if (button.classList.contains('hidden')) {
            button.classList.remove('hidden');
            event.currentTarget.innerText = 'ANNULLA';
        }
        else {
            button.classList.add('hidden');
            event.currentTarget.innerText = 'ELIMINA POST';
        }
    }
}

/********************************** PROMISE'S HANDLERS ******************************/

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
        if (user.sesso === 'M')
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

function onDeletePostJson(json) {
    document.querySelector('.deleteFeedback').innerHTML = '';

    if (json.deleted === 'TRUE') {
        //post eliminato
        const successText = document.createElement('h2');
        successText.innerText = 'Il post con id ' + '"' + json.postId + '"' + ' è stato eliminato con successo';

        document.querySelector('.deleteFeedback').classList.remove('hidden');
        document.querySelector('.deleteFeedback').classList.remove('error');
        document.querySelector('.deleteFeedback').classList.add('success');
        document.querySelector('.deleteFeedback').appendChild(successText);

        setTimeout(() => {
            fetch('/get_logged_user_posts').then(onResponse).then(onPostsJson);
            document.querySelector('.deleteFeedback').classList.add('hidden');
            document.querySelector('#deletePostsButton').innerText = 'ELIMINA POST';

        }, 2000);
    }
    else {
        //post NON eliminato
        const errorText = document.createElement('h2');
        errorText.innerText = 'Operazione non riuscita';
        document.querySelector('.deleteFeedback').classList.remove('hidden');
        document.querySelector('.deleteFeedback').classList.remove('success');
        document.querySelector('.deleteFeedback').classList.add('error');
        document.querySelector('.deleteFeedback').appendChild(errorText);

        setTimeout(() => {
            document.querySelector('.deleteFeedback').classList.add('hidden');
        }, 2000);

    }
}

function onPostsJson(json) {
    const feedSection = document.querySelector('.feed__posts');
    feedSection.innerHTML = '';

    if (json.length === 0) {
        // allora non ci sono posts nel DataBase
        const boxError = document.createElement('div');
        boxError.id = "FeedSectionIsEmpty";
        boxError.classList.add('text_align_center');
        boxError.innerText = 'Ancora 0 posts pubblicati, sbrigati a crearne uno nuovo!';
        boxError.style.color ='black';

        document.querySelector('.feed__posts').appendChild(boxError);
    }
    else {
        // ci sono Posts :)

        for (let post of json) {

            const postContainer = document.createElement('div');
            postContainer.classList.add('post');
            postContainer.id = 'postID' + post.id;
            postContainer.dataset.id = post.id;
            const contentContainer = document.createElement('div');
            contentContainer.classList.add('post__content');
            const textPost = document.createElement('h4');
            textPost.innerText = '"' + post.place_name + '"';

            // elimina posts
            const deleteButton = document.createElement('a');
            deleteButton.classList.add('button');
            deleteButton.id = 'deletePostButton';
            deleteButton.innerText = 'ELIMINA';
            deleteButton.dataset.id = post.id;
            deleteButton.classList.add('hidden');
            deleteButton.addEventListener('click', deletePost);

            const infoPostContainer = document.createElement('div');
            infoPostContainer.classList.add('post__informations');
            const dateText = document.createElement('p');
            dateText.innerText = post.time;
            const numberLikesText = document.createElement('p');
            numberLikesText.classList.add('likes_counter');
            numberLikesText.innerText = 'likes: ' + post.nlikes;
            numberLikesText.dataset.postId = post.id; //per la modale dei like
            numberLikesText.addEventListener('click', openLikeModalView);

            contentContainer.appendChild(textPost);
            infoPostContainer.appendChild(dateText);
            postContainer.appendChild(contentContainer);
            postContainer.appendChild(infoPostContainer);
            postContainer.appendChild(numberLikesText);
            postContainer.appendChild(deleteButton);

            feedSection.appendChild(postContainer);
        }
    }
}

function onPlacesJson(json) {
    const listPlacesDIV = document.querySelector('.list_places');
    listPlacesDIV.innerHTML = '';

    for (let place of json) {
        const namePlace = place.name;

        const placeContainer = document.createElement('div');
        placeContainer.classList.add('list_item');
        const pinContainer = document.createElement('div');
        pinContainer.classList.add('icon_container');
        const pinIcon = document.createElement('img');
        pinIcon.classList.add('image');
        pinIcon.src = 'icons/pin.png';
        pinIcon.alt = 'icon not found';
        const textContainer = document.createElement('h4');

        textContainer.innerText = namePlace;

        pinContainer.appendChild(pinIcon);
        placeContainer.appendChild(pinContainer);
        placeContainer.appendChild(textContainer);

        listPlacesDIV.appendChild(placeContainer);
    }
}

function onUserJson(json) {
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

function onResponse(response) {
    return response.json();
}

/********************************************************************************************/


fetch("/get_logged_user_info").then(onResponse).then(onUserJson);
fetch("/get_places_visited_by_logged_user").then(onResponse).then(onPlacesJson);
fetch('/get_logged_user_posts').then(onResponse).then(onPostsJson);


document.querySelector('#deletePostsButton').addEventListener('click', showDeleteButtons);


