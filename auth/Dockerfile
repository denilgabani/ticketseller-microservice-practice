# Base Image
FROM node:alpine

#Wroking directory
WORKDIR /app

#operations
COPY package.json ./
RUN npm install
COPY ./ ./

#startup commad
CMD ['npm', 'start']
