function generateSummary(data, urgency) {
  return {
    primarySymptom: data.symptom,
    duration: data.feverDays + " days",
    breathingDifficulty: data.breathing ? "Yes" : "No",
    chestPain: data.chestPain ? "Yes" : "No",
    urgencyLevel: urgency
  };
}

module.exports = generateSummary;
