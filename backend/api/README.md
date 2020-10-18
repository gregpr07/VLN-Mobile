# API
+ When using the API always add a trailing slash!

Legend  
:warning: - authentication required

## Pagination
There are up to 50 results per page. To navigate between pages pass `page` parameter with index in the URL. Like so:
http://127.0.0.1:8000/api/user/?page=2

## Authentication
Some endpoints require you to be authenticated in order to use them. They are tagged with :warning:.

### Obtaining auth token
```js
var formdata = new FormData();
formdata.append("username", "username");
formdata.append("password", "password");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("http://localhost:8000/api/auth/login/", requestOptions)
  .then(response => response.json())
  .then(result => console.log(response["token"]))
  .catch(error => console.log('error', error));
```

### Passing auth token to requests
To access secured endpoints add this header:  `Authorization: Token YOUR_TOKEN`.

```js
var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://127.0.0.1:8000/api/note/lecture/1/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

## Endpoints

### UserModel
1. List (http://127.0.0.1:8000/api/user/)
1. Detail (http://127.0.0.1:8000/api/user/user_id/)

### Author
1. List (http://127.0.0.1:8000/api/author/)
1. Detail (http://127.0.0.1:8000/api/author/author_id/)
1. Most viewed authors (http://127.0.0.1:8000/api/author/most_viewed/)

### Lecture
1. List (http://127.0.0.1:8000/api/lecture/)
1. Detail (http://127.0.0.1:8000/api/lecture/lecture_id/)
1. Most viewed lectures (http://127.0.0.1:8000/api/lecture/most_viewed/)
1. Most starred lectures (http://127.0.0.1:8000/api/lecture/most_starred/)
1. Latest lectures (http://127.0.0.1:8000/api/lecture/latest/)
1. :warning: Starred (http://127.0.0.1:8000/api/starred/) (returns all user's starred lectures)
1. :warning: Star (http://127.0.0.1:8000/api/star/lecture_id/)
1. :warning: Unstar (http://127.0.0.1:8000/api/unstar/lecture_id/)

:warning: If you're logged in List & Detail will also return 'starred' boolean field, which let's you know if the user starred the lecture.

### Slide
1. List (http://127.0.0.1:8000/api/slide/)
1. Detail (http://127.0.0.1:8000/api/slide/slide_id/)
1. Slides for a specific lecture (http://127.0.0.1:8000/api/slide/lecture/lecture_id/) (ordered by timestamp asc)

### Event
1. List (http://127.0.0.1:8000/api/event/)
1. Detail (http://127.0.0.1:8000/api/event/event_id/)

### Playlist
1. List (http://127.0.0.1:8000/api/playlist/)
1. Detail (http://127.0.0.1:8000/api/playlist/playlist_id/)
1. Most viewed playlists (http://127.0.0.1:8000/api/playlist/most_viewed/)

### Note
1. :warning: List (http://127.0.0.1:8000/api/note/)
1. :warning: Detail (http://127.0.0.1:8000/api/note/note_id/)
1. :warning: User notes for a specific lecture (http://127.0.0.1:8000/api/note/lecture/lecture_id/) (ordered by timestamp asc)

#### Adding a new user note
:warning: POST `http://127.0.0.1:8000/api/note/`
```js
var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN");

var formdata = new FormData();
formdata.append("lecture", "LECTURE_ID");
formdata.append("text", "NOTE_TEXT");
formdata.append("timestamp", "TIMESTAMP");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

fetch("http://127.0.0.1:8000/api/note/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

#### Deleting a user note
:warning: DELETE `http://127.0.0.1:8000/api/note/NOTE_ID/`
```js
var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN");

var requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://127.0.0.1:8000/api/note/NOTE_ID/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

## CURL examples
### Logging in/obtaining API_TOKEN token 
```
curl --request POST \
  --url http://localhost:8000/api/auth/login/ \
  --header 'content-type: application/json' \
  --data '{
    "username": "username",
    "password": "password"
  }'
```

### Accessing restricted endpoints
```
curl --request GET \
  --url http://localhost:8000/api/auth/user/ \
  --header 'authorization: Token YOUR_API_TOKEN_HERE' \
  --header 'content-type: application/json'
```