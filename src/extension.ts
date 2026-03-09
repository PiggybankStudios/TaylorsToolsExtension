import * as vscode from 'vscode';

//TODO: Do we need to explicitely handle stuff like 0x## or 0b##?
function my_parseNumber(numStr: string, numType: string): number|null
{
	if (numType == "bin")
	{
		return parseInt(numStr, 2);
	}
	else if (numType == "dec")
	{
		return parseInt(numStr, 10);
	}
	else if (numType == "hex")
	{
		return parseInt(numStr, 16);
	}
	else if (numType == "ascii")
	{
		return numStr.codePointAt(0) ?? null;
	}
	else { return null; }
}
function my_encodeNumber(num: number, numType: string) : string|null
{
	if (numType == "bin")
	{
		var result = num.toString(2);
		// Pad to whole byte's worth
		let numZerosToAdd = (8 - (result.length % 8));
		if (numZerosToAdd < 8) { result = "0".repeat(numZerosToAdd) + result; }
		return result;
	}
	else if (numType == "dec")
	{
		return num.toString(10);
	}
	else if (numType == "hex")
	{
		var result = num.toString(16).toUpperCase();
		// Pad to whole byte's worth
		let numZerosToAdd = (2 - (result.length % 2));
		if (numZerosToAdd < 2) { result = "0".repeat(numZerosToAdd) + result; }
		return result;
	}
	else if (numType == "ascii")
	{
		return String.fromCharCode(num);
	}
	else { return null; }
}

function getFormatGeneratedNum(format: string, numIndex: number) : string|null
{
	var startStr: string = format;
	var incrementStr: string = "1";
	if (format.includes(":"))
	{
		let formatParts: string[] = format.split(":");
		if (formatParts.length != 2) { return null; }
		startStr = formatParts[0];
		incrementStr = formatParts[1];
	}
	
	var generatingChars: Boolean = false;
	var startNum: number|null = my_parseNumber(startStr, "dec");
	if (startNum === null || isNaN(startNum)) { startNum = my_parseNumber(startStr, "ascii"); generatingChars = true; }
	if (startNum === null || isNaN(startNum)) { return null; }
	
	var incrementNum: number|null = my_parseNumber(incrementStr, "dec");
	if (incrementNum === null || isNaN(startNum)) { incrementNum = my_parseNumber(startStr, "ascii"); }
	if (incrementNum === null || isNaN(startNum)) { return null; }
	
	let resultNum: number = startNum + incrementNum * numIndex;
	if (generatingChars)
	{
		return my_encodeNumber(resultNum, "ascii");
	}
	else
	{
		return my_encodeNumber(resultNum, "dec");
	}
}

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
	// |                  taylors-tools.centerScreen                  |
	// +--------------------------------------------------------------+
	context.subscriptions.push(vscode.commands.registerCommand('taylors-tools.centerScreen', () => {
		vscode.window.activeTextEditor?.revealRange(vscode.window.activeTextEditor.selection, vscode.TextEditorRevealType.InCenter);
	}));
	
	// +--------------------------------------------------------------+
	// |                 taylors-tools.gotoEmptyLine                  |
	// +--------------------------------------------------------------+
	var gotoEmptyLine = (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => {
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
			
			var gotoEndOfLine: Boolean = true;
			if (currLineStr === null) //we reached the beginning/end of the file
			{
				if (currLineNum < 0) { currLineNum = 0; }
				else { currLineNum = textEditor.document.lineCount-1; }
				currLineStr = textEditor.document.lineAt(currLineNum);
				if (!arg_forward) { gotoEndOfLine = false; }
			}
			var newCursorPosition = (gotoEndOfLine ? currLineStr.range.end : currLineStr.range.start);
			
			if (arg_select) { newSelections.push(new vscode.Selection(sel.anchor, newCursorPosition)); }
			else { newSelections.push(new vscode.Selection(newCursorPosition, newCursorPosition)); }
			if (revealRangeMin == null || newCursorPosition.isBefore(revealRangeMin)) { revealRangeMin = newCursorPosition; }
			if (revealRangeMax == null || newCursorPosition.isAfter(revealRangeMax))  { revealRangeMax = newCursorPosition; }
		}
		// vscode.window.showInformationMessage("Selections: " + JSON.stringify(newSelections));
		textEditor.selections = newSelections;
		if (revealRangeMin !== null && revealRangeMax !== null)
		{
			textEditor.revealRange(new vscode.Range(revealRangeMin, revealRangeMax));
		}
	};
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.gotoEmptyLine', gotoEmptyLine));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.gotoNextEmptyLine', (editor, edit, ...args) => {
		args[0] = { "forward": true, "select": false };
		gotoEmptyLine(editor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.gotoPrevEmptyLine', (editor, edit, ...args) => {
		args[0] = { "forward": false, "select": false };
		gotoEmptyLine(editor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.gotoNextEmptyLineExtend', (editor, edit, ...args) => {
		args[0] = { "forward": true, "select": true };
		gotoEmptyLine(editor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.gotoPrevEmptyLineExtend', (editor, edit, ...args) => {
		args[0] = { "forward": false, "select": true };
		gotoEmptyLine(editor, edit, ...args);
	}));
	
	
	// +--------------------------------------------------------------+
	// |                 taylors-tools.convertNumber                  |
	// +--------------------------------------------------------------+
	var convertNumber = (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => {
		var params: any = args[0];
		var arg_from: string     = (params && params["from"]     !== undefined) ? String(params["from"]).toLowerCase() : "dec";
		var arg_to: string       = (params && params["to"]       !== undefined) ? String(params["to"]).toLowerCase() : "hex";
		var arg_splitter: string = (params && params["splitter"] !== undefined) ? String(params["splitter"]) : "";
		var arg_prefix: string   = (params && params["prefix"]   !== undefined) ? String(params["prefix"]) : "";
		var arg_joiner: string   = (params && params["joiner"]   !== undefined) ? String(params["joiner"]) : " ";
		
		// vscode.window.showInformationMessage("Converting " + arg_from + " to " + arg_to + (arg_prefix.length != 0 ? " ( prefix \"" + arg_prefix + "\")" : ""));
		textEditor.selections.forEach(sel =>
		{
			// vscode.window.showInformationMessage("sel: " + JSON.stringify(sel));
			let selectedText: string = textEditor.document.getText(sel);
			var numbers: number[] = [];
			if (arg_from == "ascii")
			{
				for (var cIndex = 0; cIndex < selectedText.length; cIndex++)
				{
					let charValue: number|null = my_parseNumber(selectedText.charAt(cIndex), arg_from);
					if (charValue === null) { vscode.window.showErrorMessage("Invalid \"from\" number type \"" + arg_from + "\""); return; }
					if (isNaN(charValue)) { vscode.window.showErrorMessage("Selection \"" + selectedText.charAt(cIndex) + "\" is not a \"" + arg_from + "\" number"); return; }
					numbers.push(charValue);
				}
			}
			else if (arg_splitter.length == 0)
			{
				let numValue: number|null = my_parseNumber(selectedText, arg_from);
				if (numValue === null) { vscode.window.showErrorMessage("Invalid \"from\" number type \"" + arg_from + "\""); return; }
				if (isNaN(numValue)) { vscode.window.showErrorMessage("Selection \"" + selectedText + "\" is not a \"" + arg_from + "\" number"); return; }
				numbers.push(numValue);
			}
			else
			{
				let selectedParts: string[] = selectedText.split(arg_splitter);
				selectedParts.forEach(selectedPart =>
				{
					let numValue: number|null = my_parseNumber(selectedPart, arg_from);
					if (numValue === null) { vscode.window.showErrorMessage("Invalid \"from\" number type \"" + arg_from + "\""); return; }
					if (isNaN(numValue)) { vscode.window.showErrorMessage("Selection \"" + selectedPart + "\" is not a \"" + arg_from + "\" number"); return; }
					numbers.push(numValue);
				});
			}
			
			if (numbers.length == 0) { vscode.window.showErrorMessage("No numbers found to convert"); return; }
			// if (numbers.length > 1) { vscode.window.showInformationMessage("Joiner: \"" + arg_joiner + "\""); }
			
			//check for valid "to" argument
			let toCheckResult: string|null = my_encodeNumber(0, arg_to);
			if (toCheckResult === "") { vscode.window.showErrorMessage("Invalid \"to\" number type \"" + arg_to + "\""); return; }
			
			var resultStr: string = "";
			numbers.forEach(num =>
			{
				if (resultStr.length > 0) { resultStr += arg_joiner; }
				// vscode.window.showInformationMessage("Encoding " + num + " in \"" + arg_to + "\"");
				resultStr += arg_prefix + my_encodeNumber(num, arg_to);
			});
			// vscode.window.showInformationMessage("Final result: \"" + resultStr + "\"");
			
			edit.replace(sel, resultStr);
		});
	};
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.convertNumber', convertNumber));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.convertHexToDec', (editor, edit, ...args) => {
		args[0] = { "from": "hex", "to": "dec" };
		convertNumber(editor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.convertDecToHex', (editor, edit, ...args) => {
		args[0] = { "from": "dec", "to": "hex", "prefix": "0x" };
		convertNumber(editor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.convertBinToHex', (editor, edit, ...args) => {
		args[0] = { "from": "bin", "to": "hex", "prefix": "0x" };
		convertNumber(editor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.convertHexToBin', (editor, edit, ...args) => {
		args[0] = { "from": "hex", "to": "bin", "prefix": "0b" };
		convertNumber(editor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.convertCharsToHex', (editor, edit, ...args) => {
		args[0] = { "from": "ascii", "to": "hex", "prefix": "0x" };
		convertNumber(editor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.convertHexToChars', (editor, edit, ...args) => {
		args[0] = { "from": "hex", "to": "ascii", "splitter": " ", "joiner": "" };
		convertNumber(editor, edit, ...args);
	}));
	
	// +--------------------------------------------------------------+
	// |                  taylors-tools.generateNums                  |
	// +--------------------------------------------------------------+
	var generateNums = (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => {
		var params: any = args[0];
		//TODO: Maybe we want to always make numbers generate from first (topmost) selection down towards the bottom of the file.
		//      Right now looping over selections seems to respect the order in which the selections were made
		var arg_format: string = (params && params["format"]) ? String(params["format"]).toLowerCase() : "";
		if (vscode.window.activeTextEditor)
		{
			if (arg_format.length > 0)
			{
				var testFormat: string|null = getFormatGeneratedNum(arg_format, 0);
				if (testFormat === null) { vscode.window.showErrorMessage("Invalid generation format \"" + arg_format + "\""); return; }
				
				for (var sIndex = 0; sIndex < vscode.window.activeTextEditor!.selections.length; sIndex++)
				{
					let sel: vscode.Selection = vscode.window.activeTextEditor!.selections[sIndex];
					edit.replace(sel, getFormatGeneratedNum(arg_format, sIndex)!);
				}
			}
			else
			{
				vscode.window.showInputBox({ignoreFocusOut: true, placeHolder: "format (like 0:2 or A:1) [start]:[increment]", prompt: "Format:"})
					.then((formatStr: string|undefined) => {
					if (formatStr)
					{
						vscode.window.showInformationMessage("Generating numbers based off format \"" + formatStr + "\"");
						
						var testFormat: string|null = getFormatGeneratedNum(formatStr, 0);
						if (testFormat === null) { vscode.window.showErrorMessage("Invalid generation format \"" + formatStr + "\""); return; }
						
						vscode.window.activeTextEditor!.edit((editBuilder) => {
							for (var sIndex: number = 0; sIndex < vscode.window.activeTextEditor!.selections.length; sIndex++)
							{
								let sel: vscode.Selection = vscode.window.activeTextEditor!.selections[sIndex];
								editBuilder.replace(sel, getFormatGeneratedNum(formatStr, sIndex)!);
							}
						});
					}
				});
			}
		}
	};
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.generateNums', generateNums));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.generateNumsFrom0', (textEditor, edit, ...args) => {
		args[0] = { "format": "0:1" };
		generateNums(textEditor, edit, ...args);
	}));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('taylors-tools.generateNumsFrom1', (textEditor, edit, ...args) => {
		args[0] = { "format": "1:1" };
		generateNums(textEditor, edit, ...args);
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
