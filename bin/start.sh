#! bin/bash

cd ./backend

flask db upgrade

gunicorn --bind 0.0.0.0:8000 app:app
