
import { auth } from './firebase';
import { SUBMIT_TRADER_ENDPOINT } from '../constants';

interface SubmissionData {
  fullName: string;
  email: string;
  city: string;
  mobile: string;
  category: string;
  broker: string;
  strategy: string;
  apiKey?: string;
  file: File;
}

export const submitTraderSecurely = async (data: SubmissionData): Promise<{ success: boolean; message?: string }> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Get fresh ID token
    const idToken = await user.getIdToken(true);

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("city", data.city);
    formData.append("mobile", data.mobile);
    formData.append("category", data.category);
    formData.append("broker", data.broker);
    formData.append("strategy", data.strategy);
    
    if (data.apiKey) {
      formData.append("apiKey", data.apiKey);
    }
    
    formData.append("proofFile", data.file);

    console.log(`Submitting to: ${SUBMIT_TRADER_ENDPOINT}`);

    const response = await fetch(SUBMIT_TRADER_ENDPOINT, {
      method: "POST",
      headers: {
        // Authorization Header with Bearer Token
        "Authorization": `Bearer ${idToken}`
        // Do NOT set Content-Type manually for FormData; browser handles it (multipart/form-data)
      },
      body: formData
    });

    // Parse JSON Response
    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON Response from Server:", text);
      throw new Error(`Server Error (${response.status}): Unexpected response format.`);
    }

    if (!response.ok) {
      throw new Error(result.error || `Submission failed with status: ${response.status}`);
    }

    return { success: true, message: result.message || "Submission successful" };

  } catch (error: any) {
    console.error("Secure Submission Error:", error);
    
    // Provide a helpful message for common network errors
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      throw new Error(`Unable to connect to the server (${SUBMIT_TRADER_ENDPOINT}). Please check your internet connection or try again later.`);
    }
    
    throw error;
  }
};
