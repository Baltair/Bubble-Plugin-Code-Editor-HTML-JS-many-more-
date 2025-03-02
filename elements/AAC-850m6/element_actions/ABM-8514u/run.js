function(instance, properties, context) {
    
	instance.data.initContentLoaded = false;
	if(instance.data.editor){
        instance.data.editor.setValue(instance.data.p.initValue || '');
        instance.data.editor.updateOptions(instance.data.editorOptions);
        monaco.editor.setModelLanguage(instance.data.editor.getModel(), instance.data.p.language);
        instance.publishState("current_value",instance.data.p.initValue);
    }
}