import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the GoogleGenerativeAI class

interface AiResponse {
  text: string;
  mealPlan?: string[];
  recommendations?: string[];
}

export const analyzeHealthRecord = async (analysisId: string, userId: string): Promise<AiResponse> => {
  try {
    console.log('Fetching analysis from:', `analysis/${userId}/${analysisId}`);
    console.log('Analyzing analysis result:', analysisId);

    // Get the analysis result with the extracted text
    const analysisRef = ref(database, `analysis/${userId}/${analysisId}`);
    const snapshot = await get(analysisRef);
    
    if (!snapshot.exists()) {
      throw new Error('No analysis record found');
    }

    const analysisResult = snapshot.val();
    if (!analysisResult.extractedText) {
      throw new Error('No extracted text available for this analysis');
    }

    // Initialize the GoogleGenerativeAI instance
    const genAI = new GoogleGenerativeAI('demo-api-key'); // Replace with your actual API key

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Define the prompt
    const prompt = `Analyze this medical record and provide: 
    1. A summary of the key health findings
    2. Recommended meal plan based on the health condition
    3. Any relevant health recommendations
    
    Medical Record Text:
    ${analysisResult.extractedText}`;

    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Extract the response
    const response = await result.response;
    const text = await response.text();

    // Parse the response
    const data = JSON.parse(text);
    return {
      text: data.candidates[0].content.parts[0].text,
      mealPlan: [], // Parse meal plan from response
      recommendations: [] // Parse recommendations from response
    };
  } catch (error) {
    console.error('Error in AI analysis:', error);
    throw error;
  }
};
