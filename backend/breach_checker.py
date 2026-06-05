import hashlib
import requests

def check_pwned_password(password: str) -> dict:
    """
    Checks the Have I Been Pwned API using k-anonymity to see if a password
    has been involved in a data breach.
    """
    # Hash the password with SHA-1
    sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix = sha1_password[:5]
    suffix = sha1_password[5:]

    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        
        # The API returns a list of suffixes that match the prefix, along with the count
        hashes = (line.split(':') for line in response.text.splitlines())
        
        for h, count in hashes:
            if h == suffix:
                return {"breached": True, "count": int(count)}
                
        return {"breached": False, "count": 0}
        
    except requests.RequestException as e:
        print(f"Error checking Pwned Passwords API: {e}")
        # Fail open securely
        return {"breached": False, "count": 0, "error": str(e)}
