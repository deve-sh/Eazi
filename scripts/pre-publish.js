const fs = require("node:fs");

["package.json", "README.md", ".gitignore"].forEach((fileName) =>
	fs.copyFileSync(fileName, `./dist/${fileName}`)
);

try {
	fs.unlinkSync("./dist/index.html");
} catch {}
