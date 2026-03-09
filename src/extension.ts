import * as vscode from 'vscode';

// NOTE: Extension is activated the very first time a command is executed
export function activate(context: vscode.ExtensionContext)
{
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "taylors-tools" is now active!');
	
	// +--------------------------------------------------------------+
	// |                        taylorExt.test                        |
	// +--------------------------------------------------------------+
	context.subscriptions.push(vscode.commands.registerCommand('taylors-tools.test', () => {
		console.log("Wooo hooo taylor");
		console.error("Oh no taylor!");
		vscode.window.showInformationMessage('Hello World from Taylor\'s Tools!!! :D Woo hoo');
		vscode.debug.activeDebugConsole.append("This is a debug console message :O");
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
