#!/usr/bin/env python3
"""
Skill: performance-profiling
Script: lighthouse_audit.py
Purpose: Run Lighthouse performance audit on a URL
Usage: python lighthouse_audit.py https://example.com
Output: JSON with performance scores
Note: Uses Lighthouse CLI from PATH when available, otherwise falls back to npx.
"""
import subprocess
import json
import sys
import os
import tempfile
import shutil
import platform
from typing import List, Optional

# Fix Windows console encoding
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass


def resolve_lighthouse_command() -> Optional[List[str]]:
    """Resolve a runnable lighthouse command.

    Preference:
    1) lighthouse binary from PATH
    2) npx fallback (npx --yes lighthouse ...)
    """
    if shutil.which("lighthouse"):
        return ["lighthouse"]

    npx = "npx.cmd" if platform.system() == "Windows" else "npx"
    if shutil.which(npx):
        return [npx, "--yes", "lighthouse"]

    if shutil.which("npx"):
        return ["npx", "--yes", "lighthouse"]

    return None


def run_lighthouse(url: str) -> dict:
    """Run Lighthouse audit on URL."""
    try:
        base_cmd = resolve_lighthouse_command()
        if not base_cmd:
            return {"error": "Lighthouse CLI not found. Install with: npm install -g lighthouse (or ensure npx is available)"}

        with tempfile.NamedTemporaryFile(suffix='.json', delete=False) as f:
            output_path = f.name
        
        result = subprocess.run(
            [
                *base_cmd,
                url,
                "--output=json",
                f"--output-path={output_path}",
                "--chrome-flags=--headless",
                "--only-categories=performance,accessibility,best-practices,seo",
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=300,
        )
        
        if os.path.exists(output_path):
            with open(output_path, 'r') as f:
                report = json.load(f)
            os.unlink(output_path)
            
            categories = report.get("categories", {})
            return {
                "url": url,
                "scores": {
                    "performance": int(categories.get("performance", {}).get("score", 0) * 100),
                    "accessibility": int(categories.get("accessibility", {}).get("score", 0) * 100),
                    "best_practices": int(categories.get("best-practices", {}).get("score", 0) * 100),
                    "seo": int(categories.get("seo", {}).get("score", 0) * 100)
                },
                "summary": get_summary(categories)
            }
        else:
            return {
                "error": "Lighthouse failed to generate report",
                "command": " ".join(base_cmd),
                "exit_code": result.returncode,
                "stdout": (result.stdout or "")[:500],
                "stderr": (result.stderr or "")[:500],
            }
            
    except subprocess.TimeoutExpired:
        return {"error": "Lighthouse audit timed out"}
    except FileNotFoundError:
        return {"error": "Lighthouse command could not be executed"}


def get_summary(categories: dict) -> str:
    """Generate summary based on scores."""
    perf = categories.get("performance", {}).get("score", 0) * 100
    if perf >= 90:
        return "[OK] Excellent performance"
    elif perf >= 50:
        return "[!] Needs improvement"
    else:
        return "[X] Poor performance"


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python lighthouse_audit.py <url>"}))
        sys.exit(1)
    
    result = run_lighthouse(sys.argv[1])
    print(json.dumps(result, indent=2))
