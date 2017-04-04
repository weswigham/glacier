const handlebars = require("handlebars");
const fileContents = require("fs").readFileSync("docs/index.html.handelbars", "utf8");
const result = handlebars.compile(fileContents);
const date = new Date();
const localFiles = require("fs").readdirSync("docs/baselines/local").filter(f => f.endsWith(".svg")).sort((f1, f2) => {
    const filename1 = f1.substring(f1.lastIndexOf("/"));
    const filename2 = f2.substring(f2.lastIndexOf("/"));
    const [f1p1, f1p2] = filename1.split("-");
    const [f2p1, f2p2] = filename2.split("-");
    if (f1p2 && f2p2) {
        return +f1p1 - +f2p1; // Numbers seperated by a dash are sorted numerically and placed first
    }
    else {
        return filename1.localeCompare(filename2);
    }
});
const data = {
    "date" : date,
    "files" : localFiles,
}

const output = result(data);

require("fs").writeFileSync("docs/index.html", output);