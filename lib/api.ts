// API Configuration
export const API_BASE_URL = 'https://hyperattention-production-1bbb.up.railway.app';

// API Response Types
export interface HealthPredictionInput {
    age: number;
    sex: number; // 0 = female, 1 = male
    cp: number; // chest pain type (0-3)
    trestbps: number; // resting blood pressure
    chol: number; // cholesterol
    fbs: number; // fasting blood sugar > 120 mg/dl (0 or 1)
    restecg: number; // resting ECG results (0-2)
    thalach: number; // maximum heart rate achieved
    exang: number; // exercise induced angina (0 or 1)
    oldpeak: number; // ST depression
    slope: number; // slope of peak exercise ST segment (0-2)
    ca: number; // number of major vessels (0-3)
    thal: number; // thalassemia (0-3)
}

export interface HealthPredictionResponse {
    prediction: number;
    probability: number;
    risk_level: string;
    recommendations: string[];
}

export interface WearableData {
    heart_rate: number;
    steps: number;
    sleep_hours: number;
    blood_pressure_systolic: number;
    blood_pressure_diastolic: number;
    timestamp: string;
}

// API Functions
export const healthAPI = {
    /**
     * Predict heart disease risk
     */
    async predictRisk(data: HealthPredictionInput): Promise<HealthPredictionResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error predicting risk:', error);
            throw error;
        }
    },

    /**
     * Get mock wearable data
     */
    async getWearableData(): Promise<WearableData> {
        try {
            const response = await fetch(`${API_BASE_URL}/wearables/mock`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching wearable data:', error);
            throw error;
        }
    },

    /**
     * Check API health
     */
    async checkHealth(): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking API health:', error);
            throw error;
        }
    },
};

// Helper function to convert user-friendly data to API format
export function convertToHealthInput(userData: {
    age: number;
    sex: 'male' | 'female';
    bloodPressure: number;
    cholesterol: number;
    heartRate: number;
    hasChestPain: boolean;
    exerciseAngina: boolean;
    fastingBloodSugar: number;
}): HealthPredictionInput {
    return {
        age: userData.age,
        sex: userData.sex === 'male' ? 1 : 0,
        cp: userData.hasChestPain ? 2 : 0, // Simplified
        trestbps: userData.bloodPressure,
        chol: userData.cholesterol,
        fbs: userData.fastingBloodSugar > 120 ? 1 : 0,
        restecg: 0, // Normal
        thalach: userData.heartRate,
        exang: userData.exerciseAngina ? 1 : 0,
        oldpeak: 0, // Default
        slope: 1, // Flat
        ca: 0, // Default
        thal: 2, // Normal
    };
}
