"""
Fetch categories from your own Instagram account using the Instagram Basic Display API.
Requires: requests

Setup:
1) Create an app in Meta for Developers and add the Instagram Basic Display product.
2) Generate a User Access Token for the kadambaricreations account.
3) Save the token in an env var: IG_ACCESS_TOKEN=XXXX

This script **does not scrape** the website and respects Instagram's Terms.
"""
import os, requests, json, re

ACCESS_TOKEN = os.environ.get("IG_ACCESS_TOKEN")
if not ACCESS_TOKEN:
    raise SystemExit("Set IG_ACCESS_TOKEN env var")

# Fetch media (basic fields)
fields = "id,caption,media_type,permalink,thumbnail_url,media_url"
url = f"https://graph.instagram.com/me/media?fields={fields}&access_token={ACCESS_TOKEN}"
items = []
while url:
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    data = r.json()
    items.extend(data.get("data", []))
    url = data.get("paging", {}).get("next")

# Extract naive categories from hashtags in captions (e.g., #saree, #lehenga, #kids)
cats = set()
for it in items:
    cap = it.get("caption") or ""
    for tag in re.findall(r"#(\w+)", cap):
        tag_low = tag.lower()
        # Map common tags to normalized categories
        if tag_low in {"saree","sari","lehenga","kurti","salwar","anarkali","gown"}:
            cats.add("ethnic")
        elif tag_low in {"mens","men","shirt","tshirt","kurta"}:
            cats.add("men")
        elif tag_low in {"kids","kid","children"}:
            cats.add("kids")
        elif tag_low in {"accessories","jewelry","jewellery","bangle","earring"}:
            cats.add("accessories")
        elif tag_low in {"women","ladies","fashion"}:
            cats.add("women")

# Save to backend data file (merge unique)
data_path = os.path.join(os.path.dirname(__file__), "..", "app", "data", "categories.json")
with open(data_path, "r", encoding="utf-8") as f:
    existing = json.load(f)

existing_ids = {c["id"] for c in existing.get("categories", [])}
for c in sorted(cats):
    if c not in existing_ids:
        existing["categories"].append({"id": c, "name": c.capitalize()})

with open(data_path, "w", encoding="utf-8") as f:
    json.dump(existing, f, indent=2, ensure_ascii=False)

print("Updated categories:", [c["id"] for c in existing["categories"]])
