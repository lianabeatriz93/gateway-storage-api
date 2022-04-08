module.exports = {
  run: (host, port, prod, fullUrl) => {
    const { execSync } = require("child_process");
    if (prod) {
      execSync("npx next build", { stdio: "inherit" });
      execSync(`start ${fullUrl}`, { stdio: "inherit" });
      execSync(`npx next start -p ${port} -H ${host}`, { stdio: "inherit" });
    } else {
      execSync(`start ${fullUrl}`, { stdio: "inherit" });
      execSync(`npx next dev -p ${port} -H ${host}`, {
        stdio: "inherit",
      });
    }

    execSync("npm run test", { stdio: "inherit" });
  },
};
