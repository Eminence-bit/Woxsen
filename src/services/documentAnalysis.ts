
import { database } from "@/lib/firebase";
import { ref as dbRef, set } from "firebase/database";

interface AnalysisResult {
  id: string;
  recordId: string;
  extractedText: string;
  timestamp: number;
}

export const analyzeDocument = async (
  fileUrl: string,
  userId: string
): Promise<AnalysisResult> => {
  try {
    console.log('Starting document analysis for URL:', fileUrl);

    // Call Azure Computer Vision API
    const endpoint = 'https://medtrack.cognitiveservices.azure.com/vision/v3.2/read/analyze';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'demo-api-key',
      },
      body: JSON.stringify({ url: fileUrl }),
    });

    // Log the response for debugging
    console.log('Response:', response);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      throw new Error('Failed to analyze document');
    }

    const operationLocation = response.headers.get('Operation-Location');
    if (!operationLocation) {
      throw new Error('No operation location returned');
    }

    const result = await pollForResult(operationLocation, '##');
    const extractedText = extractTextFromResult(result);

    const analysisResult: AnalysisResult = {
      id: Date.now().toString(),
      recordId: userId,
      extractedText,
      timestamp: Date.now(),
    };

    console.log('Storing analysis at:', `analysis/${userId}/${analysisResult.id}`);

    // Store the analysis result
    const analysisRef = dbRef(database, `analysis/${userId}/${analysisResult.id}`);
    await set(analysisRef, analysisResult);

    return analysisResult;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
};

const pollForResult = async (operationLocation: string, apiKey: string, maxAttempts = 10): Promise<any> => {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const response = await fetch(operationLocation, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get analysis result');
    }

    const result = await response.json();
    if (result.status === 'succeeded') {
      return result;
    }

    if (result.status === 'failed') {
      throw new Error('Analysis failed');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error('Operation timed out');
};

const extractTextFromResult = (result: any): string => {
  let text = '';
  if (result.analyzeResult && result.analyzeResult.readResults) {
    for (const page of result.analyzeResult.readResults) {
      for (const line of page.lines) {
        text += line.text + '\n';
      }
    }
  }
  return text.trim();
};
