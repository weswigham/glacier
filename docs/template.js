const handlebars = require("handlebars");
const fileContents = require("fs").readFileSync("docs/index.html.handelbars", "utf8");
const result = handlebars.compile(fileContents);
const date = new Date();
const localFiles = require("fs").readdirSync("docs/baselines/local");
localFiles.shift();
localFiles.sort();
const data = {
    "date" : date,
    "files" : localFiles,
}

const output = result(data);

require("fs").writeFileSync("docs/index.html", output);