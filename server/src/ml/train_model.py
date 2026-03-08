import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
import json

# 1. Generate Synthetic Data
def generate_data():
    np.random.seed(42)
    data_size = 10000
    
    # Features: N, P, K, temperature, humidity, ph, rainfall
    n = np.random.randint(0, 140, data_size)
    p = np.random.randint(5, 145, data_size)
    k = np.random.randint(5, 205, data_size)
    temp = np.random.uniform(10, 40, data_size)
    hum = np.random.uniform(15, 100, data_size)
    ph = np.random.uniform(4.5, 9, data_size)
    rain = np.random.uniform(20, 300, data_size)
    
    crops = []
    for i in range(data_size):
        if rain[i] > 200:
            crops.append("Rice")
        elif rain[i] < 50 and n[i] < 50:
            crops.append("Millet")
        elif temp[i] < 15:
            crops.append("Wheat")
        elif temp[i] > 35 and hum[i] < 30:
            crops.append("Cactus") # Hypothetical for variety
        elif n[i] > 100 and p[i] > 50:
            crops.append("Cotton")
        elif k[i] > 120:
            crops.append("Banana")
        elif k[i] > 80 and n[i] < 60:
            crops.append("Potato")
        elif 6.0 <= ph[i] <= 7.0 and rain[i] > 80:
            crops.append("Maize")
        elif ph[i] < 5.5:
            crops.append("Tea")
        elif hum[i] > 80:
            crops.append("Jute")
        elif n[i] > 60 and temp[i] > 20:
            crops.append("Tomato")
        else:
            crops.append("Pulses")
            
    df = pd.DataFrame({
        'N': n, 'P': p, 'K': k, 
        'temperature': temp, 'humidity': hum, 
        'ph': ph, 'rainfall': rain,
        'label': crops
    })
    
    print("\nCrop Distribution in Training Data:")
    counts = df['label'].value_counts().to_dict()
    print(counts)
    print("-" * 30)
    
    with open('train_dist.json', 'w') as f:
        json.dump(counts, f)
    
    return df

# 2. Train and Save Model
def train_model():
    print("Generating synthetic data (10,000 samples)...")
    df = generate_data()
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Create directory if doesn't exist
    os.makedirs(os.path.join(os.path.dirname(__file__), 'models'), exist_ok=True)
    
    model_path = os.path.join(os.path.dirname(__file__), 'models', 'crop_recommendation_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"Model trained and saved to {model_path}")
    print("Accuracy on training data:", model.score(X, y))

if __name__ == "__main__":
    train_model()
