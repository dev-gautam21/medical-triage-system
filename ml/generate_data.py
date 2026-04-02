import random
import csv

symptoms = ["Fever", "Cold", "Cough"]

def classify(symptom, duration, breathing, chestPain):
    if breathing or chestPain:
        return "Emergency"
    if symptom == "Fever" and duration > 2:
        return "DoctorRequired"
    if symptom == "Cold" and duration > 3:
        return "DoctorRequired"
    if symptom == "Cough" and duration > 5:
        return "DoctorRequired"
    return "Routine"

rows = []

for _ in range(3000):
    symptom = random.choice(symptoms)
    duration = random.randint(1, 7)

    breathing = 1 if random.random() < 0.08 else 0
    chestPain = 1 if random.random() < 0.06 else 0

    urgency = classify(symptom, duration, breathing, chestPain)
    rows.append([symptom, duration, breathing, chestPain, urgency])

with open("triage_dataset.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["symptom","duration","breathing","chestPain","urgency"])
    writer.writerows(rows)

print("Balanced dataset generated")
