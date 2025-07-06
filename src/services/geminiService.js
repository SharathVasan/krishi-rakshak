// src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.error("❌ Gemini API key not found! Check your .env file");
      return;
    }
    this.genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    console.log("✅ Gemini service initialized");
  }

  async testConnection() {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(
        "Say hello in a creative way!"
      );
      console.log("✅ Gemini API working:", result.response.text());
      return result.response.text();
    } catch (error) {
      console.error("❌ Gemini API error:", error);
      return null;
    }
  }

  async diagnoseCrop(imageBase64, farmerQuery = "", language = "en") {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      
      const languageInstructions = {
        'kn': 'Respond in simple Kannada language',
        'hi': 'Respond in simple Hindi language',
        'en': 'Respond in simple English'
      };
      
      const langInstruction = languageInstructions[language] || languageInstructions['en'];
      
      const prompt = `
      You are an expert agronomist and plant pathologist helping farmers in Karnataka, India. 
      Analyze this crop image and provide comprehensive diagnosis.
      
      ${langInstruction}
      
      Please provide:
      1. **Crop Identification**: What crop is this?
      2. **Disease/Pest Identification**: What disease, pest, or issue do you see?
      3. **Severity Level**: Rate from 1-10 (1=mild, 10=severe)
      4. **Symptoms**: Describe the visible symptoms
      5. **Probable Causes**: What likely caused this issue?
      6. **Treatment Recommendations**: 
         - Immediate organic/natural remedies available locally
         - Chemical treatments if necessary
         - Preventive measures
      7. **Market Impact**: How might this affect crop yield and market value?
      8. **Timeline**: When to expect improvement with treatment
      
      Farmer's specific question: "${farmerQuery}"
      
      Focus on practical, actionable advice using locally available materials.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
            mimeType: "image/jpeg"
          }
        }
      ]);

      return result.response.text();
    } catch (error) {
      console.error("❌ Crop diagnosis error:", error);
      return "Sorry, I couldn't analyze the image. Please try again with a clearer photo.";
    }
  }

  async getMarketAdvice(location, crop, currentPrice = null, language = "en") {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const languageInstructions = {
        'kn': 'Respond in simple Kannada language',
        'hi': 'Respond in simple Hindi language', 
        'en': 'Respond in simple English'
      };
      
      const langInstruction = languageInstructions[language] || languageInstructions['en'];
      
      const prompt = `
      You are a market analyst specializing in ${crop} farming in ${location}, Karnataka, India.
      
      ${langInstruction}
      
      Current price information: ${currentPrice ? `Current price: ₹${currentPrice}` : 'No current price data'}
      
      Please provide:
      1. **Market Analysis**: Current market trends for ${crop}
      2. **Price Prediction**: Expected price movement in next 2-4 weeks
      3. **Optimal Selling Time**: When should farmer sell for best price?
      4. **Market Locations**: Suggest nearby markets with better prices
      5. **Quality Factors**: What affects ${crop} pricing?
      6. **Storage Advice**: How to store crop to maintain quality
      7. **Negotiation Tips**: How to get better prices
      8. **Risk Assessment**: Market risks to be aware of
      
      Focus on practical, actionable market intelligence for small-scale farmers.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("❌ Market advice error:", error);
      return "Sorry, I couldn't get market information right now. Please try again.";
    }
  }

  async getSchemeRecommendations(farmerProfile, language = "en") {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const languageInstructions = {
        'kn': 'Respond in simple Kannada language',
        'hi': 'Respond in simple Hindi language',
        'en': 'Respond in simple English'
      };
      
      const langInstruction = languageInstructions[language] || languageInstructions['en'];
      
      const prompt = `
      You are a government scheme advisor helping farmers in Karnataka, India.
      
      ${langInstruction}
      
      Farmer Profile:
      - Location: ${farmerProfile.location || 'Karnataka'}
      - Farm Size: ${farmerProfile.farmSize || 'Small scale'}
      - Crops: ${farmerProfile.crops || 'Mixed crops'}
      - Category: ${farmerProfile.category || 'General'}
      - Annual Income: ${farmerProfile.income || 'Not specified'}
      
      Please recommend:
      1. **Eligible Schemes**: Government schemes farmer can apply for
      2. **Priority Schemes**: Most beneficial schemes for this farmer
      3. **Application Process**: Step-by-step application guidance
      4. **Required Documents**: What documents are needed
      5. **Deadlines**: Important dates and timelines
      6. **Contact Information**: Where to apply or get help
      7. **Success Tips**: How to increase chances of approval
      8. **Additional Benefits**: Other support programs available
      
      Focus on Karnataka state schemes, central schemes, and district-specific programs.
      Provide practical, actionable guidance for scheme applications.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("❌ Scheme recommendations error:", error);
      return "Sorry, I couldn't get scheme information right now. Please try again.";
    }
  }

  async processVoiceQuery(transcript, context = {}, language = "en") {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const languageInstructions = {
        'kn': 'Respond in simple Kannada language',
        'hi': 'Respond in simple Hindi language',
        'en': 'Respond in simple English'
      };
      
      const langInstruction = languageInstructions[language] || languageInstructions['en'];
      
      const prompt = `
      You are Krishi Rakshak, an AI farming assistant for Karnataka farmers.
      
      ${langInstruction}
      
      Farmer's question: "${transcript}"
      
      Context: ${JSON.stringify(context)}
      
      Analyze the query and provide:
      1. **Query Type**: Is this about crop diagnosis, market prices, or government schemes?
      2. **Response**: Detailed answer to farmer's question
      3. **Action Needed**: What should the farmer do next?
      4. **Additional Help**: Other relevant information or questions to ask
      
      Keep responses conversational and practical for voice interaction.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("❌ Voice query processing error:", error);
      return "Sorry, I couldn't understand your query. Please try again.";
    }
  }
}

export default new GeminiService();
