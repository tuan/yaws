import * as vscode from "vscode";
import path from "path";
import { getCurrentWord, getCurrentWordRange } from "./utils";

export async function showSuggestions(
  openDocs: Set<vscode.Uri>,
  textEditor: vscode.TextEditor
): Promise<string | undefined> {
  const currentWord = getCurrentWord(textEditor);
  if (currentWord.length < 3) {
    return;
  }

  const currentWordRange = getCurrentWordRange(textEditor);
  if (currentWordRange == null) {
    return undefined;
  }

  const regex = new RegExp(`\\b${currentWord}\\w+\\b`, "gi");

  const result = new Set<vscode.QuickPickItem>();
  const seen = new Set<string>();
  for (const docUri of openDocs) {
    const content = await vscode.workspace.openTextDocument(docUri);
    const matches = content.getText().match(regex);
    if (matches == null) {
      continue;
    }

    const fileName = path.basename(docUri.fsPath);
    matches.forEach((match) => {
      if (seen.has(match)) {
        return;
      }
      seen.add(match);

      result.add({
        label: match,
        description: fileName,
      });
    });
  }

  if (result.size === 0) {
    return undefined;
  }

  const picked = await vscode.window.showQuickPick([...result], {
    matchOnDescription: true,
  });
  if (picked == null) {
    return;
  }

  textEditor.edit((builder) =>
    builder.replace(currentWordRange!, picked.label)
  );
}
