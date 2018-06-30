const fs = require("fs");
const util = require("util");
var data =  require("./compile.js");
var buffer = "";

function appendLn(data) {
	buffer += data += '\r\n';
}


Object.keys(data).forEach((name) => {
    var entry  = data[name];
    appendLn(util.format("PS_SRC_FUNC_ADD_TYPE(%s, %s)", entry.type, entry.name));
    entry.members.forEach((member) => {
        appendLn(util.format("PS_SRC_FUNC_ADD_TYPE_MEMBER(%s, %s, %s, %s);", entry.type, entry.name, member.name, member.stripped_name));
    });
	appendLn("");
});

fs.writeFileSync("bootstrap/_portable_structs.macros", buffer, "utf8");