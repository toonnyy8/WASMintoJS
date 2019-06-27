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
    if (err) {
        console.log(err)
    } else {
        console.log('WiJ begin')
    }

    //確認有無WiJ標記
    if (jsFile.search("//this file is WiJ") == -1) {
        //修改wasm的引入路徑
        jsFile = jsFile.split("var wasmBinaryFile")
        jsFile[1] = jsFile[1].slice(jsFile[1].search(";") + 1, jsFile[1].length)
        jsFile = `${jsFile[0]}var wasmBinaryFile = wasmUrl;${jsFile[1]}`

        //將wasmBinaryFile = locateFile(wasmBinaryFile);註解調以避免路徑遭更改後出錯
        jsFile = jsFile.split("wasmBinaryFile = locateFile(wasmBinaryFile);")
        jsFile = `${jsFile[0]}//wasmBinaryFile = locateFile(wasmBinaryFile);${jsFile[1]}`

        //使用URL物件建立wasm路徑
        if (program.dispersion != "Y") {
            let wasmFile = fs.readFileSync(`${program.path}.wasm`, { encoding: "base64" })
            jsFile = `let wasmUrl = URL.createObjectURL(new Blob([Uint8Array.from(atob("${wasmFile}"), c => c.charCodeAt(0))]))\n${jsFile}`
        } else {
            jsFile = `import fs from "fs"
            \nlet wasmUrl = URL.createObjectURL(new Blob([fs.readFileSync(__dirname+"/${program.path.split("/").pop()}.wasm")]))\n${jsFile}`
        }

        //決定數否導出模組
        if (program.export == "Y") {
            jsFile += `\nexport { Module, runtimeInitialized, runtimeExited };`
        }

        //增加WiJ標記
        jsFile += `\n//this file is WiJ`

        //寫入WiJ.js
        fs.writeFile(`${program.path}.WiJ.js`, jsFile, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('WiJ end')
            }
        })
    }
})