function(instance, properties, context) {
    
    instance.data.editor.setValue(properties.value || '');
    instance.data.currentValue = properties.value;
    instance.data.editor.updateOptions(instance.data.editorOptions);
    monaco.editor.setModelLanguage(instance.data.editor.getModel(), instance.data.p.language);
    instance.publishState("current_value",instance.data.p.initValue);

}