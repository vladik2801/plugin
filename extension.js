const vscode = require('vscode');


let decorationType;

/**
 * 
 * @param {vscode.ExtensionContext} context 
 */
function activate(context) {
    console.log('Плагин для выделения const активирован');

    
    decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 223, 186, 0.5)',
        border: '1px solid orange'
    });

    
    let disposable = vscode.commands.registerCommand('highlightConst.highlight', () => {
        updateDecorations();
    });

    
    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
            updateDecorations();
        }
    });

    context.subscriptions.push(disposable);
}


function updateDecorations() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Откройте файл с расширением .cpp!');
        return;
    }

    const fileName = editor.document.fileName;
    if (!fileName.endsWith('.cpp')) {
        vscode.window.showErrorMessage('Этот плагин работает только с файлами .cpp!');
        return;
    }

    
    const text = editor.document.getText();

    
    const regex = /const\s+\w+\s+\w+\s*=\s*[^;]+;/g;
    let match;
    const decorations = [];

    while ((match = regex.exec(text)) !== null) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + match[0].length);

        decorations.push({
            range: new vscode.Range(startPos, endPos),
            hoverMessage: 'Константа: ' + match[0]
        });
    }

    
    editor.setDecorations(decorationType, decorations);
}


function deactivate() {
    if (decorationType) {
        decorationType.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};

