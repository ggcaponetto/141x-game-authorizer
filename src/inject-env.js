const fs = require("fs");
const path = require("path");
console.log("injecting all environment variables into the /public folder.");

let envs = {};
Object.keys(process.env).forEach(key => {
  if(key.startsWith("REACT_APP")){
    envs[key] = process.env[key];
  }
})

fs.writeFileSync(
  path.resolve(`${__dirname}/../public/env.js`),
  `window._env_ = JSON.parse("${JSON.stringify(envs).replaceAll(`"`, `\\"`)}"); console.log("injected all the env variables into browser context", window._env_);`
)


