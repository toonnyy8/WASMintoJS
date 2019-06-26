let fs = require("fs")

var program = require('commander');

//定义参数,以及参数内容的描述
program
    .version('0.0.1')
    .usage('[options] [value ...]')
    .option('-p, --path <string>', 'file path and filename')
    .option('-e, --export <Y/N>', 'use ES6 "export" (need babel)')
    .option('-d, --dispersion <Y/N>', 'Disperse WiJ.js and .wasm (need to build tools to use "fs")')


//解析commandline arguments
program.parse(process.argv)

//输出结果
console.info('--path:')
console.log(program.path);
console.log('\n')

program.export = program.export || "N"
console.info('--export:')
console.log(program.export);
console.log('\n')

program.dispersion = program.dispersion || "N"
console.info('--dispersion:')
console.log(program.dispersion);
console.log('\n')





fs.readFile(`${program.path}.js`, "utf8", function (err, jsFile) {
    if (err)
        console.log(err)
    else
        console.log('WiJ begin')

    if (jsFile.search("//this file is WiJ") == -1) {
        jsFile = jsFile.split("var wasmBinaryFile")
        jsFile[1] = jsFile[1].slice(jsFile[1].search(";") + 1, jsFile[1].length)
        jsFile = `${jsFile[0]}var wasmBinaryFile = wasmUrl;${jsFile[1]}`

        jsFile = jsFile.split("wasmBinaryFile = locateFile(wasmBinaryFile);")
        jsFile = `${jsFile[0]}//wasmBinaryFile = locateFile(wasmBinaryFile);${jsFile[1]}`

        if (program.dispersion != "Y") {
            let wasmFile = fs.readFileSync(`${program.path}.wasm`)
            jsFile = `let wasmUrl = URL.createObjectURL(new Blob([new Uint8Array([${JSON.parse(JSON.stringify(wasmFile))["data"]}])]))\n${jsFile}`
        } else {
            jsFile = `import fs from "fs"
            \nlet wasmUrl = URL.createObjectURL(new Blob([fs.readFileSync(__dirname+"/${program.path.split("/").pop()}.wasm")]))\n${jsFile}`
        }
        if (program.export == "Y") {
            jsFile += `\nexport { Module, runtimeInitialized, runtimeExited };`
        }
        jsFile += `\n//this file is WiJ`

        fs.writeFile(`${program.path}.WiJ.js`, jsFile, function (err) {
            if (err)
                console.log(err);
            else
                console.log('WiJ end');
        })
    }
})

