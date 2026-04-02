const fs = require("fs");

function logCase(data, urgency) {
  const row = `${data.symptom},${data.feverDays},${data.breathing ? 1 : 0},${data.chestPain ? 1 : 0},${urgency}\n`;

  fs.appendFileSync("triage_data.csv", row);
}

module.exports = logCase;
