import re
from typing import List
from pdfminer.high_level import extract_text
import docx

def extract_text_from_file(path: str) -> str:
    path = path.lower()
    if path.endswith(".pdf"):
        try:
            return extract_text(path)
        except Exception as e:
            print("PDF parse error", e)
            return ""
    elif path.endswith(".docx"):
        try:
            doc = docx.Document(path)
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception as e:
            print("DOCX parse error", e)
            return ""
    else:
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception as e:
            print("TXT parse error", e)
            return ""

def chunk_text(text: str, max_tokens: int = 300, overlap: int = 50) -> List[str]:
    # Naive chunking by sentences approximated by splitting on punctuation.
    sentences = re.split(r'(?<=[\.\?\!])\s+', text)
    chunks = []
    current = []
    current_len = 0
    for s in sentences:
        tokens = s.split()
        if len(tokens) == 0:
            continue
        if current_len + len(tokens) <= max_tokens:
            current.append(s)
            current_len += len(tokens)
        else:
            if current:
                chunks.append(" ".join(current))
            # start new chunk (allow overlap)
            if overlap > 0 and len(chunks) > 0:
                # create overlap from last chunk's tail sentences
                tail = chunks[-1].split()
                # simply reuse part of the last chunk
                overlap_tokens = tail[-min(len(tail), overlap):]
                current = [" ".join(overlap_tokens), s]
                current_len = len(overlap_tokens) + len(tokens)
            else:
                current = [s]
                current_len = len(tokens)
    if current:
        chunks.append(" ".join(current))
    return chunks

