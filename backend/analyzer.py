import math

def calculate_pool_size(password: str) -> int:
    pool = 0
    if any(c.islower() for c in password):
        pool += 26
    if any(c.isupper() for c in password):
        pool += 26
    if any(c.isdigit() for c in password):
        pool += 10
    if any(c in "!@#$%^&*()_+-=[]{}|;':\",./<>?\\`~" for c in password):
        pool += 32
    
    # Fallback to prevent math domain error
    if pool == 0:
        pool = 1
    return pool

def calculate_entropy(password: str) -> float:
    length = len(password)
    pool_size = calculate_pool_size(password)
    if length == 0:
        return 0.0
    entropy = length * math.log2(pool_size)
    return round(entropy, 2)

def estimate_crack_time(entropy: float) -> str:
    # Assuming standard fast offline attack guessing 100 billion passwords per second (10^11)
    guesses_per_second = 100 * 10**9
    combinations = 2 ** entropy
    seconds = combinations / guesses_per_second

    if seconds < 60:
        return f"{max(1, int(seconds))} seconds"
    minutes = seconds / 60
    if minutes < 60:
        return f"{int(minutes)} minutes"
    hours = minutes / 60
    if hours < 24:
        return f"{int(hours)} hours"
    days = hours / 24
    if days < 365:
        return f"{int(days)} days"
    years = days / 365
    
    # Large times
    if years > 1_000_000:
        return f"{int(years / 1_000_000)} million years"
    
    return f"{int(years)} years"

def calculate_rule_score(password: str) -> int:
    score = 0
    length = len(password)
    
    if length >= 8:
        score += 10
    if length >= 12:
        score += 10
        
    if any(c.isupper() for c in password):
        score += 10
    if any(c.islower() for c in password):
        score += 10
    if any(c.isdigit() for c in password):
        score += 10
    if any(c in "!@#$%^&*()_+-=[]{}|;':\",./<>?\\`~" for c in password):
        score += 10
        
    # Extra bonus for a very long password
    if length > 16:
        score += 20
        
    return min(100, score)

def analyze_password(password: str) -> dict:
    entropy = calculate_entropy(password)
    crack_time = estimate_crack_time(entropy)
    rule_score = calculate_rule_score(password)
    
    # Map score to a base string risk before AI analysis
    base_risk = "Weak"
    if rule_score > 80:
        base_risk = "Very Strong"
    elif rule_score > 60:
        base_risk = "Strong"
    elif rule_score >= 40:
        base_risk = "Medium"
        
    return {
        "entropy": entropy,
        "crack_time": crack_time,
        "rule_score": rule_score,
        "base_risk": base_risk,
        "length": len(password)
    }
