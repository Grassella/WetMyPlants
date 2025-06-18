# FRONTEND BUILD
FROM --platform=amd64 node:18 AS frontend

WORKDIR /frontend

COPY ./frontend/package.json .

RUN npm install

COPY ./frontend .

RUN npm run build


# BACKEND BUILD - production website
FROM --platform=amd64 python:3.9

WORKDIR /var/www

ENV FLASK_APP=app

ENV SQLALCHEMY_ECHO=True

ARG FLASK_ENV=production
ENV FLASK_ENV=${FLASK_ENV}

ARG SCHEMA=graciela_cap
ENV SCHEMA=${SCHEMA}

ARG DATABASE_URL=postgresql://aa_projs_user:yhTY188pcl5AiccdCyzPUwRwwp1n3d9s@dpg-d18c3cruibrs738eidu0-a/aa_projs
ENV DATABASE_URL=${DATABASE_URL}

ARG SECRET_KEY=banana
ENV SECRET_KEY=${SECRET_KEY}

RUN pip install psycopg2[binary]

COPY ./bin/ ./bin/
COPY ./backend/requirements.txt ./backend/

RUN pip install -r ./backend/requirements.txt

COPY ./backend ./backend

COPY --from=frontend /frontend/dist ./frontend/dist

EXPOSE 8000

CMD [ "bash", "./bin/start.sh" ]
