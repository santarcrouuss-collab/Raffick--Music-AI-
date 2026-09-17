const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Raffick Music AI Backend is running 🎵🔥");
});

app.post("/api/create", async (req, res) => {
  try {
    const { prompt, genre, lyrics } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      "https://api.musicapi.ai/api/v1/sonic/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MUSICAPI_KEY}`
        },
        body: JSON.stringify({
          task_type: "create_music",
          custom_mode: false,
          mv: "sonic-v4-5",
          gpt_description_prompt: prompt,
          title: "Raffick Music AI",
          tags: genre || "Afrobeat"
        })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Music generation failed" });
  }
});

app.get("/api/task/:taskId", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.musicapi.ai/api/v1/sonic/task/${req.params.taskId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MUSICAPI_KEY}`
        }
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not check task" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Raffick Music AI running on port ${PORT}`);
});
