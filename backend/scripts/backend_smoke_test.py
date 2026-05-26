import urllib.request
import json
import sys

def check_health(url):
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print(f"[OK] {url} - {data.get('status')}")
                return True
            else:
                print(f"[ERROR] {url} returned {response.status}")
                return False
    except Exception as e:
        print(f"[ERROR] Failed to reach {url}: {e}")
        return False

def verify_nim(api_url):
    url = f"{api_url}/api/v1/admin/nim/verify"
    try:
        req = urllib.request.Request(url, method="POST")
        req.add_header("Authorization", "Bearer demo-token-admin-1")
        with urllib.request.urlopen(req, timeout=15) as response:
            if response.status == 200:
                print(f"[OK] NIM Verification passed")
                return True
            else:
                print(f"[ERROR] NIM Verification returned {response.status}")
                return False
    except Exception as e:
        print(f"[ERROR] Failed NIM Verification: {e}")
        return False

if __name__ == "__main__":
    base_url = "http://localhost:8000"
    if len(sys.argv) > 1:
        base_url = sys.argv[1].rstrip("/")
        
    print(f"Running smoke tests against {base_url} ...")
    
    success = True
    if not check_health(f"{base_url}/health"):
        success = False
    if not check_health(f"{base_url}/health/ready"):
        success = False
    if not verify_nim(base_url):
        success = False
        
    if success:
        print("\n✅ Smoke tests passed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Smoke tests failed!")
        sys.exit(1)
