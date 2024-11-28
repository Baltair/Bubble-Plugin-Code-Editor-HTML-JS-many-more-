function(instance, properties, context) {
    // Verify re-initialisation conditions
    if (instance.data.p) {
        for (var k in properties) {
            if (instance.data.p[k] != properties[k] &&
                k != "bubble") {
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

        instance.data.editorOptions = {
            value: instance.data.p.initValue,
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
            instance.publishState("current_value", instance.data.editor.getValue());
            instance.data.editor.updateOptions(instance.data.editorOptions);
            if(instance.data.editor.getModel().getLanguageId() != instance.data.p.language){
                monaco.editor.setModelLanguage(instance.data.editor.getModel(), instance.data.p.language);
            } // Initialize first state value on editor loading
        } else {
            // First initialization
            instance.data.loadMonaco(() => {
                // IMPLEMENT LISTENERS ON EDITOR CREATION
                monaco.editor.onDidCreateEditor((editor) => {
                    // When content is updated
                    editor.onDidChangeModelContent(() => {
                        const content = editor.getValue(); // Get the updated content
                        instance.publishState("current_value", content);
                        const now = Date.now();
                        if (now - instance.data.lastContentUpdateTime >= instance.data.p.contentUpdateDelay) { // Check if at least X millisecond has passed
                            instance.data.lastContentUpdateTime = now; // Update the last trigger time
                            instance.triggerEvent("content_modified"); // Trigger the event
                        }
                        else {
                            clearTimeout(instance.data.delayedTimeout)
                            instance.data.delayedTimeout = setTimeout(()=>{
                                instance.data.delayedUpdate = false;
                                instance.triggerEvent("content_modified");
                            },instance.data.p.contentUpdateDelay);
                                
                        }
                    });
                });
                instance.data.editor = monaco.editor.create(instance.canvas, instance.data.editorOptions);

                // EXTRA LANGUAGES OPTIONS         

                monaco.languages.registerCompletionItemProvider('html', {
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
                            suggestions: [{
                                label: `</${tag}>`,
                                kind: monaco.languages.CompletionItemKind.EnumMember,
                                insertText: `$1</${tag}>`,
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                range: {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: word.startColumn,
                                    endColumn: word.endColumn,
                                },
                            }],
                        };
                    },
                });
                instance.publishState("current_value", instance.data.editor.getValue()); // Initialize first state value on editor loading
                instance.triggerEvent("editor_initialized");
            });

            instance.data.initCompleted = true;
        }

    }

}