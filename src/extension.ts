import * as vscode from 'vscode';

// NOTE: Extension is activated the very first time a command is executed
export function activate(context: vscode.ExtensionContext)
{
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "taylors-tools" is now active!');
	
	// +--------------------------------------------------------------+
	// |                      taylors-tools.test                      |
	// +--------------------------------------------------------------+
	context.subscriptions.push(vscode.commands.registerCommand('taylors-tools.test', () => {
		console.log("Wooo hooo taylor");
		console.error("Oh no taylor!");
		vscode.window.showInformationMessage('Hello World from Taylor\'s Tools!!! :D Woo hoo');
		vscode.debug.activeDebugConsole.append("This is a debug console message :O");
	}));
	
	// +--------------------------------------------------------------+
	// |                 taylors-tools.gotoEmptyLine                  |
	// +--------------------------------------------------------------+
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.gotoEmptyLine', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args) => {
		var params: any = args[0];
		var arg_forward: Boolean = (params && params["forward"] !== undefined) ? Boolean(params["forward"]) : true;
		var arg_select: Boolean = (params && params["select"] !== undefined) ? Boolean(params["select"]) : false;
		
		var newSelections: vscode.Selection[] = [];
		var revealRangeMin: vscode.Position|null = null;
		var revealRangeMax: vscode.Position|null = null;
		for (var sIndex: number = 0; sIndex < textEditor.selections.length; sIndex++)
		{
			let sel: vscode.Selection = textEditor.selections[sIndex];
			var currLineNum: number = sel.active.line;
			var currLineStr: vscode.TextLine|null = textEditor.document.lineAt(currLineNum);
			do
			{
				currLineNum += (arg_forward ? 1 : -1);
				if (currLineNum >= textEditor.document.lineCount) { vscode.window.showInformationMessage("Hit end of file"); currLineStr = null; break; }
				if (currLineNum < 0) { vscode.window.showInformationMessage("Hit beginning of file"); currLineStr = null; break; }
				currLineStr = textEditor.document.lineAt(currLineNum);
			} while (!currLineStr.isEmptyOrWhitespace);
			
			if (currLineStr === null) //we reached the beginning/end of the file
			{
				if (currLineNum < 0) { currLineNum = 0; }
				else { currLineNum = textEditor.document.lineCount-1; }
				currLineStr = textEditor.document.lineAt(currLineNum);
			}
			if (arg_select) { newSelections.push(new vscode.Selection(sel.anchor, currLineStr.range.end)); }
			else { newSelections.push(new vscode.Selection(currLineStr.range.end, currLineStr.range.end)); }
			if (revealRangeMin == null || currLineStr.range.end.isBefore(revealRangeMin)) { revealRangeMin = currLineStr.range.end; }
			if (revealRangeMax == null || currLineStr.range.end.isAfter(revealRangeMax))  { revealRangeMax = currLineStr.range.end; }
		}
		// vscode.window.showInformationMessage("Selections: " + JSON.stringify(newSelections));
		textEditor.selections = newSelections;
		if (revealRangeMin !== null && revealRangeMax !== null)
		{
			textEditor.revealRange(new vscode.Range(revealRangeMin, revealRangeMax));
		}
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
