#!/bin/sh
echo Bot starting...
yarn run start

while true
do 
  echo Bot Restarting...
  yarn run start
done
