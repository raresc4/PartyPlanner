# Fetching the latest node image on alpine linux
FROM node:alpine

# Installing dependencies
COPY ./package.json .
COPY ./tailwind.config .

RUN npm install

# Copying all the files in our project
COPY . .

EXPOSE 3000

# Starting our application
CMD ["npm","run","start"]