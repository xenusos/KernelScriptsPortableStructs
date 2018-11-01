mkdir bootstrap
mkdir liblinux
mkdir "liblinux/headers/ITypes"
mkdir "liblinux/headers/ITypes/Macros"
mkdir "liblinux/headers/ITypes/Macros/4.14.n"
mkdir "liblinux/source"
mkdir "liblinux/source/ITypes"

node "generate _generic_linux_structs.h.js"
node "generate _unknown_types.macros.js"
node "generate test.js"
node "generate _portable_structs.macros.js"
node "generate liblinux.js"