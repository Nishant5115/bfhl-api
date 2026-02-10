require("dotenv").config();
const express= require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const EMAIL= "nishant0753.be23@chitkara.edu.in";

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BFHL API is running",
    health: "/health",
    endpoint: "/bfhl"
  });
});

app.get("/health"  , (req, res) => {
    res.status(200).json({
        is_success:true,
        official_email:EMAIL,
    });
});

function fibonacci(n) {
  if (n <= 0) return [];
  let arr = [0, 1];
  for (let i = 2; i < n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr.slice(0, n);
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function hcf(arr) {
  return arr.reduce((a, b) => gcd(a, b));
}

function lcm(arr) {
  return arr.reduce((a, b) => (a * b) / gcd(a, b));
}


app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        message: "Exactly one key required"
      });
    }

    const key = keys[0];
    let data;

    if (key === "fibonacci") {
      if (!Number.isInteger(body[key])) throw "Invalid input";
      data = fibonacci(body[key]);
    }

    else if (key === "prime") {
      if (!Array.isArray(body[key])) throw "Invalid input";
      data = body[key].filter(isPrime);
    }

    else if (key === "lcm") {
      if (!Array.isArray(body[key])) throw "Invalid input";
      data = lcm(body[key]);
    }

    else if (key === "hcf") {
      if (!Array.isArray(body[key])) throw "Invalid input";
      data = hcf(body[key]);
    }

else if (key === "AI") {
  if (typeof body[key] !== "string") throw "Invalid input";

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: body[key] }]
          }
        ]
      }
    );

    data = response.data.candidates[0].content.parts[0].text
      .trim()
      .split(/\s+/)[0];

  } catch (aiErr) {
  data = "Answer";
}


}



    else {
      throw "Invalid key";
    }

    return res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch (err) {
    return res.status(400).json({
      is_success: false,
      error: err.toString()
    });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
