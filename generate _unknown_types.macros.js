const fs = require("fs");
const util = require("util");
var data =  require("./compile.js");
var buffer = "";

function appendLn(data) {
	buffer += data += '\r\n';
}

Object.keys(data).forEach((name) => {
	appendLn(util.format("DEFINE_TYPE(%s, %s);", data[name].type, data[name].name));
});

fs.writeFileSync("bootstrap/_unknown_types.macros", buffer, "utf8");