# Elasticsearch API

- When using the API always add a trailing slash!

---

## Pagination

`<int:page>` Is the current page your want (pagination is a multiple of 20)

## Queries

`<str:query>` Is your search query for the search

## Endpoints

All the endpoints are `GET` requests.

1. Authors (/author/<str:query>/<int:page>/)
1. Lectures (lecture/<str:query>/<int:page>/)
1. Categories (category/<str:query>/<int:page>/)
