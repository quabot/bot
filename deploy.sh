#!/bin/sh
echo 'Installing dependencies'
yarn install
echo 'Building'
yarn build
echo 'Pruning devDependencies'
yarn install --production
echo 'Deployed successfully!'