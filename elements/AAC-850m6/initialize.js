function(instance, context) {
    
    // Load Monaco Library
    instance.data.loadMonaco = function(callback) {
      const monacoLoader = document.createElement("script");
      monacoLoader.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs/loader.min.js";
      monacoLoader.onload = () => {
        require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs" } });
        require(["vs/editor/editor.main"], callback);
      };
      document.head.appendChild(monacoLoader);
    }
    
    instance.data.triggerInit = true;
    
}