#!/bin/bash
echo "injecting the env variables in the public and build folder of the react app..."
npm run inject-env
echo "running the npm start-server script..."
npm run start-server
