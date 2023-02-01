FROM node:18.13.0 as mailer
RUN apt update && apt upgrade -y && apt install -y mailutils msmtp msmtp-mta
COPY ./msmtprc /etc/msmtprc

FROM node:18.13.0 as build
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm ci
# Bundle app source
COPY . .
# Build the app
RUN npm run build

FROM mailer
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist/src ./dist
COPY --from=build /usr/src/app/package.json ./package.json
ENV NODE_ENV=production
EXPOSE 8080
CMD [ "node", "./dist/mailer.js" ]


