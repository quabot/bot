#!/bin/sh
echo 'Installing dependencies'
npm install
echo 'Building'
npm run build
echo 'Pruning devDependencies'
copyfiles -u 1 src/**/*.ttf dist/
echo 'Copying files'
npm prune --omit=dev
echo 'Deployed successfully!'
