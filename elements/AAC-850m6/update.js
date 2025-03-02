function(instance, properties, context) {

    if (!instance.data.initContentLoaded) {
        instance.data.currentValue = properties.initValue + "";
        instance.data.initContentLoaded = true;
    }   
    

	const excludedKeys = ["bubble", "initValue", "autobinding"];
    if (instance.data.p) {
        for (var k in properties) {
            if (excludedKeys.includes(k)) { continue; }
            if (instance.data.p[k] != properties[k]) {
                instance.data.triggerInit = true;
                break;
            }
        }
    }

    // Remember properties to be usable in actions
    instance.data.p = properties;

    // INITIALIZE EDITOR
    if (instance.data.triggerInit) {
        instance.data.triggerInit = false;
        instance.data.initEditor();
    }
}