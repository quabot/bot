#!/bin/sh
echo 'Installing dependencies'
npm install
echo 'Building'
npm run build
echo 'Pruning devDependencies'
npm prune --production
echo 'Deployed successfully!'
