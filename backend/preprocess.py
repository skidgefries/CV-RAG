# preprocess.py
import os
import argparse
import json
import uuid
from pathlib import Path
from tqdm import tqdm
from utils import extract_text_from_file, chunk_text

def process_folder(input_dir, out_file, chunk_size=300, overlap=50):
    records = []
    for path in Path(input_dir).glob("*"):
        if not path.is_file():
            continue
        text = extract_text_from_file(str(path))
        if not text or len(text.strip()) == 0:
            continue
        chunks = chunk_text(text, max_tokens=chunk_size, overlap=overlap)
        for i, c in enumerate(chunks):
            records.append({
                "id": f"{path.stem}_{i}_{uuid.uuid4().hex[:8]}",
                "source_file": path.name,
                "text": c
            })
    with open(out_file, "w", encoding="utf-8") as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Saved {len(records)} chunks to {out_file}")
