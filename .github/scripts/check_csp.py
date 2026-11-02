#!/usr/bin/env python3
"""페이지의 인라인 스크립트가 CSP 해시와 맞는지 본다.

2026-10-02 문구 수정(cd9bc6a)에서 신청 폼 스크립트만 바뀌고 해시가 그대로여서,
한국어 랜딩의 신청 폼이 한 달 동안 조용히 막혀 있었다(2026-11-02 발견).
"""
import base64
import glob
import hashlib
import re
import sys

failed = False
for path in sorted(glob.glob("**/index.html", recursive=True)):
    if path.startswith("sns/"):
        continue
    html = open(path, encoding="utf8").read()
    csp = re.search(r"script-src ([^;]+);", html)
    if not csp:
        continue
    allowed = set(re.findall(r"'sha256-([^']+)'", csp.group(1)))
    for body in re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, flags=re.S):
        digest = base64.b64encode(hashlib.sha256(body.encode("utf8")).digest()).decode()
        if digest not in allowed:
            failed = True
            print(f"{path}: CSP에 없는 인라인 스크립트 sha256-{digest} ({body.strip()[:40]!r})")
sys.exit(1 if failed else 0)
