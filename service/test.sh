#!/bin/bash

FILE=msmtprc

if [ -f "$FILE" ]; then
    echo "$FILE exists."
else
    echo "$FILE does not exist."
    echo "Creating $FILE"
    cp msmtprc.example msmtprc
fi
docker compose up -d --build --force-recreate
sleep 5
docker compose run mailer bash -c "./node_modules/.bin/jest --clearCache && ./node_modules/.bin/jest"