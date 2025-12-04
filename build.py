import os
import re
import yaml
import json
import markdown

BASE_DIR = "stubs"
TEMPLATE_PATH = "components/blog-template.html"


### --- LOAD TEMPLATE FILE --- ###

with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
    HTML_TEMPLATE = f.read()


### --- REGEXES --- ###

META_PATTERN = re.compile(
    r"<!--META\s*(.*?)\s*-->",
    re.DOTALL | re.IGNORECASE
)


### --- PARSERS --- ###

def parse_markdown(file_text):
    metadata = {}
    content = file_text

    if file_text.startswith("---"):
        parts = file_text.split("---", 2)
        if len(parts) >= 3:
            yaml_block, _, body = parts[1], parts[0], parts[2]
            try:
                metadata = yaml.safe_load(yaml_block)
            except Exception as e:
                print("YAML error:", e)
            content = body.strip()

    html = markdown.markdown(content)
    return metadata, html


def parse_html(file_text):
    metadata = {}
    meta_match = META_PATTERN.search(file_text)
    if meta_match:
        meta_text = meta_match.group(1).strip()
        # Each line is key: value
        for line in meta_text.splitlines():
            if ":" in line:
                key, val = line.split(":", 1)
                metadata[key.strip()] = val.strip()
        # Remove the comment from content
        content = file_text[:meta_match.start()] + file_text[meta_match.end():]
    return metadata, content.strip()


### --- MAIN BUILDER --- ###

def build_all():
    metadata_index = {}

    for filename in os.listdir(BASE_DIR):
        if not (filename.endswith(".md") or filename.endswith(".html")):
            continue

        path = os.path.join(BASE_DIR, filename)

        with open(path, "r", encoding="utf-8") as f:
            text = f.read()

        if filename.endswith(".md"):
            metadata, content_html = parse_markdown(text)
        else:
            metadata, content_html = parse_html(text)

        name_without_ext = filename.rsplit(".", 1)[0]
        if 'test-' not in filename and 'draft-' not in filename:
            metadata_index[name_without_ext] = metadata

        # Build metadata HTML
        metadata_html = "\n    ".join(
            f'<meta name="{k}" content="{v}">' for k, v in metadata.items()
        )

        # Insert into template
        final_html = HTML_TEMPLATE.replace("{{meta}}", metadata_html).replace("{{content}}", content_html)

        output_filename = name_without_ext + ".html"
        output_path = os.path.join("blog", output_filename)
        os.makedirs("blog", exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(final_html)

        print(f"Built: {output_filename}")

    # Write metadata JSON file
    with open("metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata_index, f, indent=4, default=serialize_metadata)

    print("Wrote metadata.json")

def serialize_metadata(obj):
    if hasattr(obj, "isoformat"):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

if __name__ == "__main__":
    build_all()
