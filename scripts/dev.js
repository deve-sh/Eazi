const express = require("express");
const { execSync } = require("node:child_process");
const chokidar = require("chokidar");

const fs = require("node:fs");

const app = express();

const port = 3500;

const bundle = () => {
	execSync("npm run bundle", { stdio: "inherit" });
};

// Initial bundling
bundle();

// Create an HTML File to copy and serve
const indexHTML = `
    <head>
        <script type="text/javascript" async src="./index.js"  id="mediator_loading_script"></script>
    </head>
    <body>
    Open the console and run whatever test you need to.
    <script type="text/javascript" defer>
        mediator_loading_script.onload = () => {
            window.Mediator = mediator.Mediator;
        }
    </script>
</body>`;
fs.writeFileSync("./dist/index.html", indexHTML);

app.use(express.static("dist"));

app.listen(port, () => console.log("Ready to test at port: ", port));

let watchTimeout;
chokidar.watch("./src").on('change', () => {
	if (watchTimeout) clearTimeout(watchTimeout);
	watchTimeout = setTimeout(() => {
		bundle();
		console.log("Bundling done, you can refresh the page to view your changes");
	}, 350);
});
