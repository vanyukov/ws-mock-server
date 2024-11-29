import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";

const fileEnvPath = path.normalize(`${path.resolve()}/.env`);
const fileEnvExamplePath = path.normalize(`${path.resolve()}/.env.example`);

fsExtra.ensureFileSync(fileEnvPath);

const env = fs.readFileSync(fileEnvPath);
const envObj = Object.fromEntries(envByLines(env));
const envExample = fs.readFileSync(fileEnvExamplePath);
envByLines(envExample).forEach(item => {
  if (!envObj[item[0]]) {
    console.log('add to .env: ',item.join("="));
    fs.appendFile(fileEnvPath, item.join("=") + "\n", err => {
      if (err) {
        console.error(err);
        return;
      }
      //готово!
    });
  }
});

function envByLines(data) {
  const lines = data.toString().split(/\s/);
  return lines.map(item => item.split("="));
}
