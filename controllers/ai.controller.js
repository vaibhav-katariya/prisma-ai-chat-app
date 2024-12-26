import { GoogleGenerativeAI } from "@google/generative-ai";
import { ErrorResponse, Responce } from "../utils/apiResponce.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
  systemInstruction:
    "You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.",
});

export const genAiContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      ErrorResponse({
        res,
        message: "Prompt is required",
      });
    }

    const result = await model.generateContent(prompt);
    if (!result) {
      ErrorResponse({
        res,
        message: "Error while genrating the content",
      });
    }
    Responce({
      res,
      message: "Content generated successfully",
      data: result.response.text(),
    });
  } catch (error) {
    ErrorResponse({
      res,
      error: error.message,
      message: "Error while genrating the content",
    });
  }
};
