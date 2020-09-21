# VLN-Mobile

Backend of the VLN mobile app

## Installation guide

To make your life easier create a new virtual environment (using conda for faster install).

Install the modules using `pip install -r requirements.txt`.

---

Make `.env` file with this configuration

```
SECRET_KEY = <your Django secret key>
DATABASE_NAME =
DATABASE_USER =
DATABASE_PASSWORD =
DATABASE_HOST =
DATABASE_PORT =
PRODUCTION = <0 OR 1>
```

`PRODUCTION = 0` if not in production or `PRODUCTION = 1` if in production.

---

`python manage.py migrate` to migrate the database

`python manage.py runserver`
