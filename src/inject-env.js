const fs = require("fs");
const path = require("path");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const dotenv = require('dotenv');

console.log("injecting all environment variables into the /public folder.");

if (argv["from-env"]) {
  console.log("lading the env varibles from the .env file");
  dotenv.config();
}

let envs = {};
Object.keys(process.env).forEach(key => {
  if(key.startsWith("REACT_APP")){
    console.log(`injecting ${key}`);
    envs[key] = process.env[key];
  }
})

fs.writeFileSync(
  path.resolve(`${__dirname}/../public/env.js`),
  `window._env_ = JSON.parse("${JSON.stringify(envs).replaceAll(`"`, `\\"`)}"); console.log("injected all the env variables into browser context", window._env_);`
)
fs.writeFileSync(
  path.resolve(`${__dirname}/../build/env.js`),
  `window._env_ = JSON.parse("${JSON.stringify(envs).replaceAll(`"`, `\\"`)}"); console.log("injected all the env variables into browser context", window._env_);`
)


