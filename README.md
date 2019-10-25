# WASMintoJS
將emscripten編譯出的wasm填進膠水js中
```
npm i
npm run WiJ -- -p <filename> -e <Y/N> -d <Y/N>
```

```
-p, --path:檔案路徑+主檔名(膠水js與wasm的位置)
-e, --export:是否要使用ES6的export導出Module, runtimeInitialized, runtimeExited(需要babel轉譯)(預設為N)
-d, --dispersion:是否要將膠水js與wasm用fs模塊連結(需要parcel等建構工具)(預設為N)
```

測試
```
npm run test
開啟./test/index.html
```