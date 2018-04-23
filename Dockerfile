FROM node:8.9.4

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install -g yarn
RUN npm set strict-ssl false
RUN yarn install --production=false
RUN yarn global add nodemon

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "run", "dev" ]