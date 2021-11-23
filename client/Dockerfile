#Base Image
FROM node:alpine

#Setting workdir
WORKDIR /app

#Operations
COPY ./package.json ./
RUN npm install
COPY ./ ./

#Startup command
CMD ["npm", "run", "dev"]