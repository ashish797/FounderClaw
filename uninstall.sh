#!/bin/bash
# founderclaw uninstaller
# Usage: bash uninstall.sh

set -e

SKILLS_DIR="${HOME}/.agents/skills"
FOUNDERCLAW_DIR="${SKILLS_DIR}/founderclaw"

echo "=== founderclaw uninstaller ==="
echo ""

if [ ! -d "$FOUNDERCLAW_DIR" ]; then
    echo "founderclaw is not installed."
    exit 0
fi

# Remove symlinks pointing to founderclaw
REMOVED=0
for link in "$SKILLS_DIR"/*; do
    [ -L "$link" ] || continue
    target=$(readlink "$link")
    case "$target" in
        "$FOUNDERCLAW_DIR"*)
            skill_name=$(basename "$link")
            rm "$link"
            echo "  ✗ $skill_name"
            REMOVED=$((REMOVED + 1))
            ;;
    esac
done

# Remove the repo
rm -rf "$FOUNDERCLAW_DIR"

echo ""
echo "=== Done ==="
echo "  Removed: $REMOVED skills"
echo "  Deleted: $FOUNDERCLAW_DIR"
