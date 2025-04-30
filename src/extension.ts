import * as vscode from "vscode";
import { showSuggestions } from "./suggest";

export function activate(context: vscode.ExtensionContext) {
  const openDocs = new Set<vscode.Uri>();
  const currentDocUri = vscode.window.activeTextEditor?.document.uri;
  if (currentDocUri != null) {
    openDocs.add(currentDocUri);
  }

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && !openDocs.has(editor.document.uri)) {
      openDocs.add(editor.document.uri);
    }
  });

  vscode.workspace.onDidCloseTextDocument((doc) => {
    if (openDocs.has(doc.uri)) {
      openDocs.delete(doc.uri);
    }
  });

  let disposable = vscode.commands.registerCommand(
    "yaws.suggestWord",
    async () => {
      const textEditor = vscode.window.activeTextEditor;
      if (textEditor == null) {
        return;
      }

      await showSuggestions(openDocs, textEditor);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
