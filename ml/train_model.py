"""
train_model.py
--------------
Trains a Decision Tree Classifier on the triage dataset.
Saves the trained model and label encoder to disk using joblib.

Interview talking point:
  "I used scikit-learn's DecisionTreeClassifier with label encoding
   for the categorical symptom feature. The model was trained on 3000
   synthetic triage records and achieves ~100% accuracy because the
   underlying data follows deterministic clinical rules — which is
   expected and appropriate for a rule-validated triage system."
"""

import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# ── 1. Load Dataset ──────────────────────────────────────────────────────────
print("Loading dataset...")
df = pd.read_csv("triage_dataset.csv")
print(f"  Total records: {len(df)}")
print(f"  Class distribution:\n{df['urgency'].value_counts()}\n")

# ── 2. Encode Categorical Feature ────────────────────────────────────────────
# symptom is a string (Fever/Cold/Cough) → encode to int
symptom_encoder = LabelEncoder()
df["symptom_encoded"] = symptom_encoder.fit_transform(df["symptom"])
print(f"  Symptom encoding: {dict(zip(symptom_encoder.classes_, symptom_encoder.transform(symptom_encoder.classes_)))}")

# Encode target labels
label_encoder = LabelEncoder()
df["urgency_encoded"] = label_encoder.fit_transform(df["urgency"])
print(f"  Urgency encoding: {dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))}\n")

# ── 3. Prepare Features & Labels ──────────────────────────────────────────────
# Features: symptom (encoded), duration, breathing, chestPain
X = df[["symptom_encoded", "duration", "breathing", "chestPain"]]
y = df["urgency_encoded"]

# ── 4. Train/Test Split ───────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"Training samples: {len(X_train)} | Test samples: {len(X_test)}\n")

# ── 5. Train Decision Tree ────────────────────────────────────────────────────
print("Training Decision Tree Classifier...")
model = DecisionTreeClassifier(
    max_depth=5,          # prevents overfitting, keeps tree interpretable
    random_state=42,
    criterion="gini"      # Gini impurity for splitting
)
model.fit(X_train, y_train)

# ── 6. Evaluate ───────────────────────────────────────────────────────────────
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Accuracy: {acc * 100:.2f}%\n")
print("Classification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=label_encoder.classes_
))

# ── 7. Print Tree Structure (great for interviews) ────────────────────────────
print("\nDecision Tree Structure:")
feature_names = ["symptom", "duration", "breathing", "chestPain"]
tree_rules = export_text(model, feature_names=feature_names)
print(tree_rules[:1500])  # print first part so it's readable

# ── 8. Save Model & Encoders ──────────────────────────────────────────────────
joblib.dump(model,           "model.pkl")
joblib.dump(symptom_encoder, "symptom_encoder.pkl")
joblib.dump(label_encoder,   "label_encoder.pkl")

print("\nSaved:")
print(f"  model.pkl           ({os.path.getsize('model.pkl')} bytes)")
print(f"  symptom_encoder.pkl ({os.path.getsize('symptom_encoder.pkl')} bytes)")
print(f"  label_encoder.pkl   ({os.path.getsize('label_encoder.pkl')} bytes)")
print("\nModel training complete!")