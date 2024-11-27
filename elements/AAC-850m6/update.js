function(instance, properties, context) {
    
    // Verify re-initialisation conditions
    if(instance.data.p){
        for (var k in properties){
            if (instance.data.p[k] != properties[k] 
                && k != "bubble") {
                instance.data.triggerInit = true;
                instance.data.p.initValue == properties.initValue ? instance.data.dataMemory = instance.data.editor.getValue() : null;
                break;
            }
        }
    }
    
    // Remember properties to be usable in actions
    instance.data.p = properties;
    
    // INITIALIZE EDITOR
    if (instance.data.triggerInit){
        instance.data.triggerInit = false;
        let initValue = instance.data.p.initValue
        if(instance.data.dataMemory){initValue = instance.data.dataMemory}
        if(instance.data.editor){instance.data.editor.dispose()}
        
        let editorOptions = {
            value: initValue,
            language: instance.data.p.language,
            theme: instance.data.p.theme,
            autoIndent: instance.data.p.autoIndent,
            autoSurround: instance.data.p.autoSurround,
            automaticLayout: instance.data.p.automaticLayout,
            cursorBlinking: instance.data.p.cursorBlinking,
            cursorStyle: instance.data.p.cursorStyle,
            folding: instance.data.p.folding,
            foldingHighlight: instance.data.p.foldingHighlight,
            showFoldingControls: instance.data.p.showFoldingControls,
            fontSize: instance.data.p.fontSize,
            letterSpacing: instance.data.p.letterSpacing,
            lineHeight: instance.data.p.lineHeight,
            largeFileOptimizations: instance.data.p.largeFileOptimizations,
            lineNumbers: instance.data.p.lineNumbers,
            lineNumbersMinChars: instance.data.p.lineNumbersMinChars,
            linkedEditing: instance.data.p.linkedEditing,
            links: instance.data.p.links,
            matchBrackets: instance.data.p.matchBrackets,
            minimap: {
            	enabled: instance.data.p.minimap_enabled,
                autohide: instance.data.p.minimap_autohide,
                showSlider: instance.data.p.minimap_showSlider,
                side: instance.data.p.minimap_side,
                size: instance.data.p.minimap_size,
            },
            placeholder: instance.data.p.placeholder,
            readOnly: instance.data.p.readOnly,
            scrollBeyondLastColumn: instance.data.p.scrollBeyondLastColumn,
            scrollBeyondLastLine: instance.data.p.scrollBeyondLastLine,
            scrollbar: {
            	vertical: instance.data.p.scrollbar_vertical,
                verticalHasArrows: instance.data.p.scrollbar_verticalHasArrows,
                verticalScrollbarSize: instance.data.p.scrollbar_verticalScrollbarSize,
                verticalSliderSize: instance.data.p.scrollbar_verticalSliderSize,
                horizontal: instance.data.p.scrollbar_horizontal,
                horizontalHasArrows: instance.data.p.scrollbar_horizontalHasArrows,
                horizontalScrollbarSize: instance.data.p.scrollbar_horizontalScrollbarSize,
                horizontalSliderSize: instance.data.p.scrollbar_horizontalSliderSize,
            },
            selectionHighlight: instance.data.p.selectionHighlight,
            showUnused: instance.data.p.showUnused,
            stickyScroll: {
                enabled: instance.data.p.stickyScroll_enabled,
                defaultModel: instance.data.p.stickyScroll_defaultModel,
                scrollWithEditor: instance.data.p.stickyScroll_scrollWithEditor,
            },
            trimAutoWhitespace: instance.data.p.trimAutoWhitespace,
            wordWrap: instance.data.p.wordWrap,
            inlineCompletionsAccessibilityVerbose: instance.data.p.inlineCompletionsAccessibilityVerbose,
            tabCompletion: instance.data.p.tabCompletion,
            autoClosingBrackets: instance.data.p.autoClosingBrackets,
            autoClosingComments: instance.data.p.autoClosingComments,
            autoClosingDelete: instance.data.p.autoClosingDelete,
            autoClosingOvertype: instance.data.p.autoClosingOvertype,
            autoClosingQuotes: instance.data.p.autoClosingQuotes,
            colorDecorators: instance.data.p.colorDecorators,
            defaultColorDecorators: true,
            colorDecoratorsActivatedOn: instance.data.p.colorDecoratorsActivatedOn,
            
        };
        
        if (instance.data.initCompleted) {
            // Changing a value
            instance.data.editor = monaco.editor.create(instance.canvas, editorOptions);
            instance.publishState("current_value",instance.data.editor.getValue()); // Initialize first state value on editor loading
        }
        else {
        	// First initialization
           
            instance.data.loadMonaco(() => { 
                // IMPLEMENT LISTENERS ON EDITOR CREATION
                monaco.editor.onDidCreateEditor((editor) => {
                    // When content is updated
                    editor.onDidChangeModelContent((test) => {
                        const content = editor.getValue(); // Get the updated content
                        instance.publishState("current_value",content);
                        //editor.onEndUpdate((test)=>{console.log("onDidChangeModelContent",test)});  // Triggered on each interaction even just selection that didn't modified any data
                    });
                    
                });
                instance.data.editor = monaco.editor.create(instance.canvas, editorOptions);

                instance.publishState("current_value",instance.data.editor.getValue()); // Initialize first state value on editor loading
                // EXTRA LANGUAGES OPTIONS         
                
                monaco.languages.registerCompletionItemProvider('html',{
                    triggerCharacters: ['>'],
                    provideCompletionItems: (model, position) => {
                        const codePre = model.getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column,
                        });

                        const tag = codePre.match(/.*<(\w+)>$/)?.[1];

                        if (!tag) {
                        	return;
                        }

                        const word = model.getWordUntilPosition(position);

                        return {
                        suggestions: [
                            {
                                label: `</${tag}>`,
                                kind: monaco.languages.CompletionItemKind.EnumMember,
                                insertText: `$1</${tag}>`,
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                range:  {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: word.startColumn,
                                    endColumn: word.endColumn,
                                },
                            }
                        ],
                    };
                },
              });
            });

            instance.data.initCompleted = true;
            instance.data.dataMemory = null;
        }
        
    }

}