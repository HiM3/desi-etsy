const ChatHistory = require("../models/ChatHistory");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.getChatHistory = async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ userId: req.user._id });
    res.json({ success: true, data: chat ? chat.messages : [] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: error.message,
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    let userMessage = req.body.text;
    // let userMessage = "hello";
    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }
    userMessage = userMessage.trim();

    let aiMessage = "Sorry, I could not process that.";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage,
      });
      console.log("Gemini result:", response.text);
      aiMessage = response.text || aiMessage;
    } catch (err) {
      console.error("Gemini API error:", err);
    }

    let chat = await ChatHistory.findOne({ userId: req.user._id });
    if (!chat) {
      chat = new ChatHistory({ userId: req.user._id, messages: [] });
    }

    chat.messages.push({
      sender: "user",
      text: userMessage,
      timestamp: new Date(),
    });
    chat.messages.push({
      sender: "ai",
      text: aiMessage,
      timestamp: new Date(),
    });
    await chat.save();

    res.json({ success: true, aiMessage, messages: chat.messages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};
