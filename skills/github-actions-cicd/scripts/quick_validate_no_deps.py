#!/usr/bin/env python3
"""Dependency-free validator for a skill's SKILL.md frontmatter."""

from __future__ import annotations

import re
import sys
from pathlib import Path

MAX_NAME_LENGTH = 64


def parse_frontmatter(text: str) -> dict[str, str]:
    match = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not match:
        raise ValueError("No valid YAML-style frontmatter block found")

    data: dict[str, str] = {}
    for raw_line in match.group(1).splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            raise ValueError(f"Invalid frontmatter line: {raw_line}")
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip()
    return data


def validate_skill(skill_dir: Path) -> tuple[bool, str]:
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        return False, "SKILL.md not found"

    try:
        frontmatter = parse_frontmatter(skill_md.read_text(encoding="utf-8"))
    except ValueError as exc:
        return False, str(exc)

    for required in ("name", "description"):
        if required not in frontmatter:
            return False, f"Missing '{required}' in frontmatter"

    name = frontmatter["name"]
    if not re.match(r"^[a-z0-9-]+$", name):
        return False, "name must be lowercase hyphen-case"
    if name.startswith("-") or name.endswith("-") or "--" in name:
        return False, "name cannot start/end with '-' or contain '--'"
    if len(name) > MAX_NAME_LENGTH:
        return False, f"name is too long ({len(name)} > {MAX_NAME_LENGTH})"

    description = frontmatter["description"]
    if len(description) > 1024:
        return False, "description exceeds 1024 characters"
    if "<" in description or ">" in description:
        return False, "description contains unsupported angle brackets"

    return True, "Skill frontmatter is valid"


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: quick_validate_no_deps.py <skill_directory>")
        return 1

    ok, message = validate_skill(Path(sys.argv[1]))
    print(message)
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
