import * as vscode from "vscode";
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

  const regex = new RegExp(`\\b${currentWord}\\w*\\b`, "gi");

  const result = new Set<string>();
  for (const doc of vscode.workspace.textDocuments) {
    const text = doc.getText();
    const matches = text.match(regex);
    if (matches == null) {
      continue;
    }
    matches.forEach((match) => result.add(match));
  }

  if (result.size === 0) {
    return undefined;
  }

  const picked = await vscode.window.showQuickPick([...result]);
  if (picked == null) {
    return;
  }

  textEditor.edit((builder) => builder.replace(currentWordRange!, picked));
}
