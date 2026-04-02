"""
predict_api.py
--------------
Flask REST API that loads the trained Decision Tree model
and serves predictions to the Node.js backend.

Runs on: http://localhost:5000
Endpoint: POST /predict

Interview talking point:
  "I built a Flask microservice to serve ML predictions. The Node.js
   backend sends patient data as JSON, Flask loads the pre-trained
   Decision Tree model using joblib, runs inference, and returns the
   urgency classification. This decouples the ML layer from the
   application layer — a standard ML deployment pattern."
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import joblib
import numpy as np
import os

# ── Load Model & Encoders at Startup ─────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("Loading model and encoders...")
model           = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
symptom_encoder = joblib.load(os.path.join(BASE_DIR, "symptom_encoder.pkl"))
label_encoder   = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))
print("Model loaded successfully.")
print(f"  Symptoms supported: {list(symptom_encoder.classes_)}")
print(f"  Urgency classes:    {list(label_encoder.classes_)}")

# Map model output back to backend-compatible urgency strings
URGENCY_MAP = {
    "DoctorRequired": "Doctor Required",
    "Emergency":      "Emergency",
    "Routine":        "Routine"
}

def predict(symptom, duration, breathing, chest_pain):
    """
    Run inference using the trained Decision Tree model.
    Returns urgency string compatible with the Node.js backend.
    """
    # Encode symptom string → integer
    symptom_encoded = symptom_encoder.transform([symptom])[0]

    # Build feature vector: [symptom_encoded, duration, breathing, chestPain]
    import pandas as pd
    features = pd.DataFrame([[symptom_encoded, duration, int(breathing), int(chest_pain)]], 
                         columns=["symptom_encoded", "duration", "breathing", "chestPain"])

    # Predict
    prediction_encoded = model.predict(features)[0]
    prediction_proba   = model.predict_proba(features)[0]

    # Decode label
    raw_label = label_encoder.inverse_transform([prediction_encoded])[0]
    urgency   = URGENCY_MAP.get(raw_label, "Routine")

    # Build confidence scores for all classes
    confidence = {}
    for i, cls in enumerate(label_encoder.classes_):
        friendly = URGENCY_MAP.get(cls, cls)
        confidence[friendly] = round(float(prediction_proba[i]) * 100, 1)

    return urgency, confidence


class TriageHandler(BaseHTTPRequestHandler):
    """Simple HTTP request handler — no Flask needed, pure stdlib."""

    def log_message(self, format, *args):
        print(f"[API] {self.address_string()} - {format % args}")

    def send_json(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_json(200, {
                "status": "ok",
                "model": "DecisionTreeClassifier",
                "accuracy": "92.83%",
                "classes": list(label_encoder.classes_)
            })
        else:
            self.send_json(404, {"error": "Not found"})

    def do_POST(self):
        if self.path != "/predict":
            self.send_json(404, {"error": "Not found"})
            return

        # Read body
        length = int(self.headers.get("Content-Length", 0))
        body   = self.rfile.read(length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON"})
            return

        # Validate fields
        required = ["symptom", "feverDays", "breathing", "chestPain"]
        missing  = [f for f in required if f not in data]
        if missing:
            self.send_json(400, {"error": f"Missing fields: {missing}"})
            return

        symptom    = data["symptom"]
        duration   = int(data["feverDays"])
        breathing  = bool(data["breathing"])
        chest_pain = bool(data["chestPain"])

        # Validate symptom value
        if symptom not in symptom_encoder.classes_:
            self.send_json(400, {
                "error": f"Invalid symptom '{symptom}'. Must be one of: {list(symptom_encoder.classes_)}"
            })
            return

        # Run prediction
        urgency, confidence = predict(symptom, duration, breathing, chest_pain)

        response = {
            "urgency":    urgency,
            "confidence": confidence,
            "model":      "DecisionTreeClassifier",
            "inputs": {
                "symptom":   symptom,
                "duration":  duration,
                "breathing": breathing,
                "chestPain": chest_pain
            }
        }

        print(f"  Prediction: {urgency} | Confidence: {confidence}")
        self.send_json(200, response)


if __name__ == "__main__":
    PORT = 5001
    server = HTTPServer(("0.0.0.0", PORT), TriageHandler)
    print(f"\nML Prediction API running on http://localhost:{PORT}")
    print(f"  POST /predict  — run triage classification")
    print(f"  GET  /health   — model health check")
    print("\nWaiting for requests...\n")
    server.serve_forever()