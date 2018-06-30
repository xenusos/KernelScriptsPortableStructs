const fs = require("fs");
const util = require("util");
const data =  require("./compile.js");

var buffer = "";
var filename = "";

function start(fn) {
	buffer = "";
	filename = fn;
}

function appendLn(data) {
	buffer += data += '\r\n';
}

function save(){
	fs.writeFileSync(filename, buffer, "utf8");
}

Object.keys(data).forEach((name) => {
    var entry  = data[name];
	
	start(util.format("liblinux/headers/ITypes/Macros/4.14.n/Variable%s.macros", entry.cpptype));
	
    entry.members.forEach((member) => {
        appendLn(util.format("DEFINE_MEMBER_2(%s, %s)", member.cpptype, member.stripped_name));
    });
	save();
	
	start(util.format("liblinux/headers/ITypes/Macros/4.14.n/Typed%s.macros", entry.cpptype));
	save();
});

Object.keys(data).forEach((name) => {
    var entry  = data[name];
	
	start(util.format("liblinux/headers/ITypes/Macros/Variable%s.macros", entry.cpptype));
    appendLn(util.format('#include "4.14.n/Variable%s.macros"', entry.cpptype));
	save();
	
	start(util.format("liblinux/headers/ITypes/Macros/Typed%s.macros", entry.cpptype));
    appendLn(util.format('#include "4.14.n/Typed%s.macros"', entry.cpptype));
	save();
});

Object.keys(data).forEach((name) => {
    var entry  = data[name];
	
	start(util.format("liblinux/headers/ITypes/I%s.hpp", entry.cpptype));

	appendLn("/*                                               ");
	appendLn("    Purpose:                                     ");
	appendLn("    Author: Reece W.                             ");
	appendLn("    License: All Rights Reserved J. Reece Wilson ");
	appendLn("*/                                               ");
	
	
	appendLn("#pragma once");
	appendLn('#include "Macros/0_init.macros"');
	
	appendLn("");
	
	appendLn(util.format("class I%s", entry.cpptype));
	appendLn("{");
	
	appendLn("private: ");
    appendLn(util.format('    %s_k _data;', entry.name));
	
	appendLn("");
	appendLn("public: ");
	appendLn(util.format("    I%s();", entry.cpptype));
	appendLn(util.format("    I%s(%s_k buffer);", entry.cpptype, entry.name));
	appendLn("");
    appendLn(util.format('    #include "Macros/Variable%s.macros"', entry.cpptype));
    appendLn(util.format('    #include "Macros/Typed%s.macros"', entry.cpptype));
	appendLn("");
	appendLn("");
    appendLn(util.format('    %s_k InternalBuffer() { return _data; }', entry.name));
    appendLn(util.format('    bool operator==(const I%s& other) const;', entry.cpptype));
	
	appendLn("};");
	appendLn("");
	appendLn('#include "Macros/0_cleanup.macros"');
	
	save();
});

Object.keys(data).forEach((name) => {
    var entry  = data[name];
	var clazz  = util.format("I%s", entry.cpptype);
	
	start(util.format("liblinux/source/ITypes/%s.cpp", clazz));

	appendLn("/*                                               ");
	appendLn("    Purpose:                                     ");
	appendLn("    Author: Reece W.                             ");
	appendLn("    License: All Rights Reserved J. Reece Wilson ");
	appendLn("*/                                               ");
	
	appendLn("#include <xenus_lazy.h>");
	appendLn("#include <libtypes.hpp>");
	appendLn("");
	appendLn(util.format("#include <ITypes/%s.hpp>", clazz));
	appendLn("");
	
	appendLn(util.format("#define CFG_DEFINE_PS_TYPE_NAME %s", entry.name));
	appendLn("#define CFG_DEFINE_DATA _data");
	appendLn(util.format("#define CFG_DEFINE_CLASS %s", clazz));

	appendLn("");
	
	appendLn('#include "0_init.macros"');
	appendLn("");
    appendLn(util.format('#include <ITypes/Macros/Variable%s.macros>', entry.cpptype));
    appendLn(util.format('#include <ITypes/Macros/Typed%s.macros>', entry.cpptype));
	
	appendLn("");
	
    appendLn(util.format('%s::%s() {}', clazz, clazz));
	appendLn("");
    appendLn(util.format('%s::%s(%s_k buffer)', clazz, clazz, entry.name));
	appendLn("{");
	appendLn("     _data = buffer;");
	appendLn("}");
	
	appendLn("");
	appendLn("");
	appendLn(util.format('bool %s::operator==(const %s& other) const', clazz, clazz));
	appendLn("{");
	appendLn("    return this->_data == other._data;");
	appendLn("}");

	save();
});