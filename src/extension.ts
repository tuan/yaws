import * as vscode from "vscode";
import { showSuggestions } from "./suggest";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "yaws.suggestWord",
    async () => {
      const textEditor = vscode.window.activeTextEditor;
      if (textEditor == null) {
        return;
      }

      await showSuggestions(textEditor);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
