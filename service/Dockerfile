FROM node:18.13.0
RUN apt update && apt upgrade -y && apt install -y mailutils msmtp msmtp-mta
COPY ./msmtprc /etc/msmtprc
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
COPY . .
# Build the app
RUN npm run build
ENV NODE_ENV=development
EXPOSE 8080
CMD [ "node", "./dist/mailer.js" ]


