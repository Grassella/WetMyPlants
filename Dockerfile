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

ARG DATABASE_URL=postgresql://anthony_database_vp6k_user:JWTKUXbikxR0iaRoLJNfDnnnGUda49Rl@dpg-d0v7ng63jp1c73dsaigg-a.ohio-postgres.render.com/anthony_database_vp6k
ENV DATABASE_URL=${DATABASE_URL}

ARG SECRET_KEY=banana
ENV SECRET_KEY=${SECRET_KEY}

RUN pip install psycopg2[binary]

COPY ./bin/ ./bin/
COPY ./backend/requirements.txt ./backend/

RUN pip install -r ./backend/requirements.txt

COPY ./backend ./backend

COPY --from=frontend /frontend/dist ./frontend/dist

EXPOSE 5000

CMD [ "bash", "./bin/start.sh" ]
