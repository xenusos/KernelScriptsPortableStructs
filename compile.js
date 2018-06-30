const fs = require("fs");
const util = require("util");

let objs = {};

function sliceLine(line)
{
    line = line.split("\t").join("    ");
    line = line.split("struct ").join("struct_");
    line = line.split(" ").join("");
    line = line.split("struct_").join("struct ");
    line = line.split(" ,").join(","); // "struct task_struct             ," -> "struct task_struct," -> "struct_task_struct_," -> "struct task_struct ," (bad) -> "struct task_struct,"
    return line.split(",");
}

function convertName(member) {
	return member.split('_').map((part) => { return part.substring(0, 1).toUpperCase() + part.substring(1); }).join('');
}

function process(line)
{
    var bits = sliceLine(line);

    if (bits.length == 0) return;
    if (bits.length == 1) return;

    if (bits.length != 6 && bits.length != 3) {
        console.log(util.format("Illegal %i line %s", bits.length, line));
        return;
    }

    var entry = objs[bits[1]] = objs[bits[1]] || {};
    var members = entry.members = entry.members || [];
	
	entry.type = bits[0];
	entry.name = bits[1];
	entry.cpptype = convertName(bits[2]);
	entry.msft = convertName(bits[1]);
	
    if (bits.length == 6)
        members.push({name: bits[3], stripped_name: bits[4], msft: convertName(bits[5])})
}

fs.readFileSync("types  _ linux.1.14.n").toString("UTF8").split("\r\n").forEach(process);

module.exports = objs;