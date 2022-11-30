#!/bin/sh

echo 'Pulling code from GitHub'
git pull origin main

echo 'Installing dependencies'
npm ci

echo 'Building'
npm run build

echo 'Pruning devDependencies'
npm prune --omit=dev

echo 'Deployed successfully!'
