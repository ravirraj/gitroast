import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import github_api from "./helper/github_api.js";
import llm_call from "./helper/llm_call.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL }));

app.get("/", (req, res) => {
  res.json("Roast Backend is up!");
});

app.post("/api/github/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const data = await github_api(process.env.GITHUB_TOKEN, username);
    if (!data) {
      console.log(data);
      return res
        .status(404)
        .json({ error: "Something went wrong while getting data from github" });
    }

    const roast = await llm_call(data, process.env.GEMINI_API_KEY);

    if (!roast) {
      return res
        .status(500)
        .json({ error: "Something went wrong while generating roast" });
    }

    return res.json({ data, roast });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
