function(instance, context) {

	if(instance.data.editor){
        instance.data.editor.setValue(instance.data.p.initValue);
        instance.publishState("current_value",);
    }

}