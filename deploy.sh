#!/bin/sh

# echo 'Pulling code from GitHub'
# git pull origin main

echo 'Installing dependencies'
yarn install

echo 'Building'
yarn build

echo 'Pruning devDependencies'
yarn install --production

echo 'Deployed successfully!'
