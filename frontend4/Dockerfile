# Fetching the latest node image on alpine linux
FROM node:alpine

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /react-app

# Installing dependencies
COPY ./package*.json /react-app
COPY ./tailwind.config /react-app/tailwind.config

RUN npm install

# Copying all the files in our project
COPY . .

EXPOSE 3000

# Starting our application
CMD ["npm","run","start"]