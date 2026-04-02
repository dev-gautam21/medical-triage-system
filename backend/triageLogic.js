function classifyUrgency(data) {
  // Emergency for all symptoms
  if (data.breathing === true || data.chestPain === true) {
    return "Emergency";
  }

  // Fever rules
  if (data.symptom === "Fever") {
    if (data.feverDays > 2) {
      return "Doctor Required";
    }
    return "Routine";
  }

  // Cold rules
  if (data.symptom === "Cold") {
    if (data.feverDays > 3) {
      return "Doctor Required";
    }
    return "Routine";
  }

  // Cough rules
  if (data.symptom === "Cough") {
    if (data.feverDays > 5) {
      return "Doctor Required";
    }
    return "Routine";
  }

  return "Routine";
}

module.exports = classifyUrgency;
