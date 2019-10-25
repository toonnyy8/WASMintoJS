console.log(Module);
let isload = () => {
    if (runtimeInitialized && !runtimeExited) {
        let int_sqrt = Module.cwrap('int_sqrt', 'number', ['number'])
        console.log(
            int_sqrt(12),
            int_sqrt(28)
        );
        console.log(Module.ccall('int_sqrt', 'number', ['number'], [81]))
        console.log(Module._int_sqrt(1024))
    } else {
        requestAnimationFrame(isload)
    }
}
requestAnimationFrame(isload)