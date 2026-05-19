import re


def replace_link(match):

    return match.group(1)


def replace_inline_code(match):

    return match.group(1)


def clean_markdown(md: str) -> str:

    # md = re.sub(r"```[\s\S]*?```", "", md)
    md = re.sub(r"`([^`]*)`", lambda match: match.group(1), md)
    md = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", md)
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.strip()
