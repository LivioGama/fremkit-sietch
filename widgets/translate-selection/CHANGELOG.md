# Changelog

## 1.2.0 — 2026-10-19

### Changed
- Reads the current selection from the foreground app through macOS Accessibility after the user clicks Translate.
- Refuses secure fields and reports missing Accessibility permission without prompting or reading the clipboard.
- Leaves the clipboard unchanged.

## 1.1.0 — 2026-10-19

### Changed
- Reuses the OpenAI-compatible AI connection; Groq and OpenAI are supported without a DeepL-specific key.
- Sends one bounded translation request after the user presses the button.
- After upgrading from 1.0.0, select an OpenAI-compatible connection in widget settings; the old DeepL connection cannot be reused.

## 1.0.0 — 2026-10-18

### Added
- Requires two user-selected favorite languages; it does not choose a pair for you.
- Translates copied text into the other favorite using DeepL language detection.
- Uses the core DeepL connection for the API key and requires an explicit Free or Pro endpoint choice.
- Reads the clipboard only after the local translate button is pressed; concealed clipboard content is refused.
