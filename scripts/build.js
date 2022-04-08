const { execSync } = require("child_process");
execSync("npm install --loglevel=error", { stdio: "inherit" });

const readline = require("readline-sync");
const path = require("path");
process.chdir(path.join(__dirname, ".."));

const projectHost =
  readline.question("Project deploy host [localhost]: ") || "localhost";
const projectPort = readline.question("Project deploy port [3000]: ") || "3000";

const mongoDbUrl =
  readline.question("MongoDB url param [mongodb://localhost:27017]: ") ||
  "mongodb://localhost:27017";
console.log(mongoDbUrl);

const mongoDb =
  readline.question("MongoDB database param [gateway]: ") || "gateway";
console.log(mongoDb);

const importData = readline.keyInYN("Import data?: ") || false;
const productionMode = readline.keyInYN("Run on production mode?: ") || false;

const httpUrl = projectHost.startsWith("http") ? "" : "http://";
const envPath = ".env";
const fullUrl = `${httpUrl}${projectHost}:${projectPort}`;
const fs = require("fs-extra");
fs.writeFileSync(envPath, `API_BASE=${fullUrl} \n`, function (err) {
  if (err) return console.log(err);
});
fs.appendFileSync(envPath, `MONGODB_URI=${mongoDbUrl} \n`);
fs.appendFileSync(envPath, `MONGODB_DB=${mongoDb} \n`);
fs.appendFileSync(envPath, `PORT=${projectPort} \n`);
fs.appendFileSync(envPath, `IMPORT_DATA=${importData} \n`);

if (importData) {
  fs.writeJSONSync("runImport.json", {
    run: true,
  });
}

fs.emptyDirSync("./.next");

const { run } = require("./runStart");
run(projectHost, projectPort, productionMode, fullUrl);
