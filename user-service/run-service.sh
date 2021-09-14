# !/bin/bash

echo 'Running user service'

npm install && npm run build:dev && npm run start:dev;

sleep 5
