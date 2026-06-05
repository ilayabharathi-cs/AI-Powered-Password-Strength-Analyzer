from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import secrets
import string

from analyzer import analyze_password
from breach_checker import check_pwned_password
from ai_model import predict_risk

app = FastAPI(title="AI Password Strength Analyzer")

# Allow CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordRequest(BaseModel):
    password: str

class PasswordResponse(BaseModel):
    password: str # Can omit in production, but helpful for debugging
    length: int
    rule_score: int
    entropy: float
    crack_time: str
    ai_risk: str
    breached: bool
    breach_count: int
    recommendations: list[str]

@app.post("/api/analyze", response_model=PasswordResponse)
def analyze_endpoint(req: PasswordRequest):
    pwd = req.password
    
    # 1. Rule-based analysis and entropy
    analysis = analyze_password(pwd)
    
    # 2. AI Risk Prediction
    ai_risk = predict_risk(pwd)
    
    # 3. Breach Check
    breach_info = check_pwned_password(pwd)
    
    # Generate recommendations
    recs = []
    if analysis["length"] < 12:
        recs.append("Increase length to at least 12 characters.")
    if not any(c.isupper() for c in pwd):
        recs.append("Add uppercase letters.")
    if not any(c.isdigit() for c in pwd):
        recs.append("Add numbers.")
    if not any(c in "!@#$%^&*()_+-=[]{}|;':\",./<>?\\`~" for c in pwd):
        recs.append("Add special characters.")
    if breach_info.get("breached"):
        recs.append("CRITICAL: Password found in data breaches. DO NOT USE.")
        
    return PasswordResponse(
        password=pwd,
        length=analysis["length"],
        rule_score=analysis["rule_score"],
        entropy=analysis["entropy"],
        crack_time=analysis["crack_time"],
        ai_risk=ai_risk,
        breached=breach_info.get("breached", False),
        breach_count=breach_info.get("count", 0),
        recommendations=recs
    )

@app.get("/api/generate")
def generate_password(length: int = 16):
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    while True:
        pwd = ''.join(secrets.choice(alphabet) for i in range(length))
        if (any(c.islower() for c in pwd)
                and any(c.isupper() for c in pwd)
                and any(c.isdigit() for c in pwd)
                and any(c in "!@#$%^&*" for c in pwd)):
            break
    return {"generated_password": pwd}
