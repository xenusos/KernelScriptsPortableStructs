const fs = require("fs");
const util = require("util");
var data =  require("./compile.js");
var buffer = "";

function appendLn(data) {
    buffer += data += '\r\n';
}

appendLn('#include "common.h"');
appendLn('void test_structs(void) ');
appendLn('{');
appendLn('    size_t x_d;');
appendLn('    #define OFFSET_CHK(type, name)                            (size_t) ((((((&((type *)(NULL))->name))))))');
appendLn('    #define TEST_MACRO(type, member) x_d = OFFSET_CHK(type,  member);');
appendLn('    ');
appendLn('    ');

Object.keys(data).forEach((name) => {
    var entry  = data[name];
    entry.members.forEach((member) => {
        appendLn(util.format("    TEST_MACRO(%s, %s);", entry.type, member.name));
    });
});

appendLn('}');

fs.writeFileSync("test.c", buffer, "utf8");