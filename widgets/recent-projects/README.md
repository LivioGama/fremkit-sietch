# Recent projects

Shows up to 50 working folders reported by Herdr panes. The core stores canonical folder paths and last-seen timestamps only; it never reads pane output, shell history, Claude/Codex transcripts or session contents. History begins when this widget first subscribes to the Herdr CWD provider and covers Herdr panes only.

Opening a folder creates a new Herdr pane without focusing it. The optional Claude Code, Codex and custom executable targets run only in that new pane. The custom target is a single executable name, not a shell command or argument string.

This widget requires FremKit core's `recent-projects` subscription and command provider. The provider is a companion core change and must be released before this widget can collect or open folders. On an older core, the list may stay empty; if a command is unavailable, the widget reports the failure and keeps the action usable. The `sdk` field checks the bridge generation, not provider availability.
