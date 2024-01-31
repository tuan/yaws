import * as vscode from "vscode";
import path from "path";
import { getCurrentWord, getCurrentWordRange } from "./utils";

export async function showSuggestions(
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
  for (const doc of vscode.workspace.textDocuments) {
    const text = doc.getText();
    const matches = text.match(regex);
    if (matches == null) {
      continue;
    }

    const fileName = path.basename(doc.fileName);
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
