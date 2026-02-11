#!/bin/bash
# Sync the local dialogue log to a secret GitHub gist.
# ChatGPT can read the gist URL to stay current with the dialogue.
#
# Usage:
#   ./scripts/sync-dialogue.sh           # update existing gist
#   ./scripts/sync-dialogue.sh --create  # create a new gist (first time only)
#   ./scripts/sync-dialogue.sh --delete  # delete the gist (cleanup)
#
# The gist ID is stored in .gist-id (gitignored).

DIALOGUE="dialogues/001-site-rebuild.md"
GIST_ID_FILE=".gist-id"

if [ ! -f "$DIALOGUE" ]; then
  echo "Error: $DIALOGUE not found."
  exit 1
fi

case "${1:-}" in
  --create)
    if [ -f "$GIST_ID_FILE" ]; then
      echo "Gist already exists: $(cat $GIST_ID_FILE)"
      echo "Use --delete first, or run without flags to update."
      exit 1
    fi
    url=$(gh gist create "$DIALOGUE" 2>&1 | grep "https://")
    gist_id=$(echo "$url" | grep -o '[^/]*$')
    echo "$gist_id" > "$GIST_ID_FILE"
    echo "Created secret gist: $url"
    echo "Gist ID saved to $GIST_ID_FILE"
    ;;
  --delete)
    if [ ! -f "$GIST_ID_FILE" ]; then
      echo "No gist ID found. Nothing to delete."
      exit 1
    fi
    gh gist delete "$(cat $GIST_ID_FILE)" --yes
    rm "$GIST_ID_FILE"
    echo "Gist deleted and ID file removed."
    ;;
  *)
    if [ ! -f "$GIST_ID_FILE" ]; then
      echo "No gist ID found. Run with --create first."
      exit 1
    fi
    gh gist edit "$(cat $GIST_ID_FILE)" "$DIALOGUE"
    echo "Gist updated: https://gist.github.com/adambalm/$(cat $GIST_ID_FILE)"
    ;;
esac
