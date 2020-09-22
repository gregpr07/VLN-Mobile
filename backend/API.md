# API
When using the API always add a trailing slash (especially when using operations other than GET)!

:warning: - authentication required

## Author
1. Listing top authors (http://127.0.0.1:8000/api/author/top/) (ordered by views desc)

## Slides
1. Slides for specific lecture (http://127.0.0.1:8000/api/slide/lecture/<pk:lecture_id>/) (ordered by timestamp asc)

## Note
1. :warning: User notes for specific lecture (http://127.0.0.1:8000/api/note/lecture/<pk:lecture_id>/) (ordered by timestamp asc)

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