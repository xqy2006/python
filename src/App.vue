<template>
<div>
    <div class="markdown-body" style="margin-top: 15px;margin-inline-start: 15px;">
        <h1>Python模拟器</h1>
        <strong>代码区：</strong>
        <button class="btn btn-primary" @click="run()">运行</button>
        <div class="codearea">
            <Codemirror :disabled="!load" v-model:value="code" :options="cmOptions" border :height="200" @change="change" />
        </div>
        <br />
        <strong>控制台：</strong>
        <br />
        <textarea class="form-control" style="width: 100%;height: 200px;" disabled v-model="console"></textarea>
    </div>

</div>
</template>

<style lang="scss">
@import "@primer/css/index.scss";

html,
body {
    display: block;
    margin: 0px;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
}
.width-auto {
    width: 100% !important;
}
</style>

<script>
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/python/python.js";
import "codemirror/theme/idea.css";
import { ref } from "vue";
import {loadPyodide} from "pyodide";
async function main() {
    let pyodide = await loadPyodide();
    return pyodide;
      }

export default {
  components: { Codemirror },
  data(){
    return{
        load:false,
        pyodide:null,
        console:"正在加载Python中..."
    }
  },
  mounted() {
    let pyodideReadyPromise = main();
    pyodideReadyPromise.then((pyodide) => {
        this.pyodide = pyodide;
        this.code = `#安装模块示例代码
import micropip
await micropip.install('snowballstemmer') 
package_list = micropip.list()
print(package_list)`;
        this.console = "Python加载完成！";
        this.load = true;
    //  pyodide.runPython(code);
    });
  },
  setup() {
    const code = ref(`正在加载Python中...`);
    return {
      code,
      cmOptions: {
        mode: "text/x-cython", // Language mode
        theme: "idea", // Theme
        lineNumbers: true, // Show line number
        smartIndent: true, // Smart indent
        indentUnit: 4, // The smart indent unit is 2 spaces in length
        viewportMargin: Infinity,
        matchBrackets:true,
        foldGutter: true, // Code folding
        styleActiveLine: true, // Display the style of the selected row
      },
    };
  },
  methods:{
    async run(){
        this.console = "运行中...";
        try{
            await this.pyodide.loadPackage("micropip");
            await this.pyodide.loadPackage("packaging");
            await this.pyodide.loadPackage("pyparsing");
            const std = `
    		import sys
    		import io
    		sys.stdout = io.StringIO()
  		    `
		    await this.pyodide.runPythonAsync(std)
            console.log(this.code);
            const output = await this.pyodide.runPythonAsync(this.code) ?? ''
            const stdout = await this.pyodide.runPythonAsync('sys.stdout.getvalue()')
            this.console += stdout;
        }
        catch(e){
            this.console += e;
        }

    },
  }
};
</script>
