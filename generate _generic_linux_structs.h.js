const fs = require("fs");
const util = require("util");
const data =  require("./compile.js");

var buffer = "";

function appendLn(data) {
    buffer += data += '\r\n';
}

// Header start
appendLn('#pragma once');
appendLn('#include <deps/lib_port_structs.h>');


// Define structs 
appendLn('PS_HEADER_GLOBAL_START');
Object.keys(data).forEach((name) => {
    var entry  = data[name];
    appendLn(util.format("    PS_HEADER_TYPE_START //%s aka %s", entry.type, entry.name));
    entry.members.forEach((member) => {
        appendLn(util.format("        PS_HEADER_MEMBER(%s, %s)", member.name, member.stripped_name));
    });
    appendLn(util.format("    PS_HEADER_TYPE_END(%s, %s)", entry.type, entry.name));
});
appendLn('PS_HEADER_GLOBAL_END');


appendLn('');

// Add inline functions, if we're outside of the LKM
appendLn('#ifndef BOOTSTRAP');
Object.keys(data).forEach((name) => {
    var entry  = data[name];
    appendLn(util.format("PS_HEADER_INIT_TYPE(%s)", entry.name));
    entry.members.forEach((member) => {
        appendLn(util.format("PS_HEADER_INIT_MEMBER(%s, %s)", entry.name, member.stripped_name));
    });
});
appendLn('#endif');

// Save
fs.writeFileSync("bootstrap/_generic_linux_structs.h", buffer, "utf8");