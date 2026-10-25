import numpy
import string
from functools import wraps
from collections import Counter
from jinja2.sandbox import SandboxedEnvironment

env = SandboxedEnvironment()
env.globals["numpy"] = numpy

def waf(content):
    allowlist = set(string.ascii_lowercase + string.ascii_uppercase + string.punctuation + string.digits + ' ')
    blocklist = ['fromfile', 'savetxt', 'load', 'array', 'packbits', 'ctypes', 'eval', 'exec', 'breakpoint', 'input', '+', '-', '/', '\\', '|', '"', "'"]
    char_limits = {
        '(': 3,
        ')': 3,
        '[': 3,
        ']': 3,
        '{': 3,
        '}': 3,
        ',': 10
    }

    if len(content) > 275:
        raise ValueError("halah ngober")

    for ch in content:
        if ch not in allowlist:
            raise ValueError("halah ngober")

    lower_value = content.lower()
    for blocked in blocklist:
        if blocked.lower() in lower_value:
            raise ValueError("halah ngober")

    counter = Counter(ch for ch in content if ch in char_limits)
    for ch, count in counter.items():
        if count > char_limits[ch]:
            raise ValueError("halah ngober")

BANNER = """
██████╗ ███████╗███╗   ██╗     ██╗ █████╗ ██████╗ ██╗   ██╗██╗   ██╗
██╔══██╗██╔════╝████╗  ██║     ██║██╔══██╗██╔══██╗██║   ██║╚██╗ ██╔╝
██████╔╝█████╗  ██╔██╗ ██║     ██║███████║██████╔╝██║   ██║ ╚████╔╝
██╔═══╝ ██╔══╝  ██║╚██╗██║██   ██║██╔══██║██╔══██╗██║   ██║  ╚██╔╝
██║     ███████╗██║ ╚████║╚█████╔╝██║  ██║██║  ██║╚██████╔╝   ██║
╚═╝     ╚══════╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝
"""

def main():
    print(BANNER)
    print("bantu bigmo bebas dari penjaruy biar bisa streaming lg\n")
    content = input("bigmo> ")

    try:
        waf(content)
        result = env.from_string(content).render()
        print(result)
    except ValueError as e:
        print(e.args[0])
    except Exception:
        print("halah ngober")

if __name__ == "__main__":
    main()
