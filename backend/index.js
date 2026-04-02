const express = require("express");
const cors    = require("cors");
const http    = require("http");
const generateSummary = require("./summaryGenerator");
const logCase         = require("./dataLogger");

const app = express();
app.use(cors());
app.use(express.json());

const ML_API_HOST = "localhost";
const ML_API_PORT = 5001;

// Calls Python ML microservice for prediction
function callMLApi(patientData) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(patientData);
    const options = {
      hostname: ML_API_HOST,
      port:     ML_API_PORT,
      path:     "/predict",
      method:   "POST",
      headers: {
        "Content-Type":   "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("Invalid JSON from ML API")); }
      });
    });
    req.on("error", (err) => reject(new Error(`ML API unreachable: ${err.message}`)));
    req.setTimeout(5000, () => { req.destroy(); reject(new Error("ML API timed out")); });
    req.write(body);
    req.end();
  });
}

// Rule-based fallback if ML API is down
function fallbackClassify(data) {
  if (data.breathing || data.chestPain) return "Emergency";
  if (data.symptom === "Fever" && data.feverDays > 2) return "Doctor Required";
  if (data.symptom === "Cold"  && data.feverDays > 3) return "Doctor Required";
  if (data.symptom === "Cough" && data.feverDays > 5) return "Doctor Required";
  return "Routine";
}

app.get("/", (req, res) => {
  res.json({ status: "Backend running", mlApi: `http://${ML_API_HOST}:${ML_API_PORT}` });
});

app.post("/triage", async (req, res) => {
  try {
    console.log("Received triage request:", req.body);

    // Call Python ML prediction API
    const mlResult = await callMLApi(req.body);
    const urgency  = mlResult.urgency;
    const summary  = generateSummary(req.body, urgency);
    logCase(req.body, urgency);

    console.log(`ML Prediction: ${urgency} | Confidence: ${JSON.stringify(mlResult.confidence)}`);

    res.json({
      urgency,
      summary,
      ml: { model: mlResult.model, confidence: mlResult.confidence }
    });

  } catch (err) {
    // Graceful fallback to rule-based if ML API unavailable
    console.error("ML API Error:", err.message);
    console.warn("Falling back to rule-based classification...");

    const urgency = fallbackClassify(req.body);
    const summary = generateSummary(req.body, urgency);
    logCase(req.body, urgency);

    res.json({
      urgency,
      summary,
      ml: { model: "rule-based-fallback", confidence: null }
    });
  }
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
  console.log(`ML API expected at http://${ML_API_HOST}:${ML_API_PORT}`);
});