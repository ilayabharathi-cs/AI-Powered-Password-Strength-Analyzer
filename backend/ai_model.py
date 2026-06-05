import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from analyzer import calculate_entropy

MODEL_PATH = "../model/password_model.pkl"

def extract_features(password: str) -> list:
    length = len(password)
    upper = sum(1 for c in password if c.isupper())
    lower = sum(1 for c in password if c.islower())
    digits = sum(1 for c in password if c.isdigit())
    specials = sum(1 for c in password if c in "!@#$%^&*()_+-=[]{}|;':\",./<>?\\`~")
    entropy = calculate_entropy(password)
    
    return [length, upper, lower, digits, specials, entropy]

def train_dummy_model():
    """
    Trains a dummy model with synthetic data to simulate AI behavior.
    """
    data = [
        # length, upper, lower, digits, specials, entropy, label (0=Weak, 1=Medium, 2=Strong, 3=Very Strong)
        [5, 0, 5, 0, 0, 23.5, 0],
        [6, 1, 5, 0, 0, 28.2, 0],
        [8, 1, 7, 0, 0, 37.6, 1],
        [8, 0, 0, 8, 0, 26.5, 0],
        [10, 2, 6, 2, 0, 59.5, 2],
        [12, 2, 7, 2, 1, 75.1, 2],
        [16, 3, 8, 3, 2, 105.5, 3],
        [20, 4, 10, 4, 2, 125.0, 3],
        [7, 0, 7, 0, 0, 32.9, 0],
        [9, 1, 6, 1, 1, 58.0, 1]
    ]
    
    # Generate some variations
    extended_data = []
    for _ in range(50):
        for row in data:
            noise = [np.random.randint(-1, 2) if i < 5 else np.random.uniform(-5, 5) for i in range(6)]
            new_features = [max(0, row[i] + noise[i]) for i in range(6)]
            # Label depends loosely on entropy and length
            e = new_features[5]
            l = new_features[0]
            if e > 90 and l >= 14:
                label = 3
            elif e > 60 and l >= 10:
                label = 2
            elif e > 35 and l >= 8:
                label = 1
            else:
                label = 0
            extended_data.append(new_features + [label])
            
    df = pd.DataFrame(extended_data, columns=['length', 'upper', 'lower', 'digits', 'specials', 'entropy', 'label'])
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    clf = RandomForestClassifier(n_estimators=50, random_state=42)
    clf.fit(X, y)
    
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(clf, f)
    print("Model trained and saved.")

def load_model():
    if not os.path.exists(MODEL_PATH):
        train_dummy_model()
    with open(MODEL_PATH, 'rb') as f:
        return pickle.load(f)

# Initialize model
try:
    clf = load_model()
except Exception as e:
    print(f"Error loading model: {e}")
    clf = None

def predict_risk(password: str) -> str:
    if not clf:
        return "Unknown"
        
    features = extract_features(password)
    # Reshape for single prediction
    X = np.array(features).reshape(1, -1)
    
    # To avoid warning about feature names, we could use a dataframe, but numpy array is fine for dummy
    prediction = clf.predict(X)[0]
    
    mapping = {
        0: "Weak",
        1: "Medium",
        2: "Strong",
        3: "Very Strong"
    }
    return mapping.get(prediction, "Unknown")
