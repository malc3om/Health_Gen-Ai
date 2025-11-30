'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { healthAPI } from '@/lib/api';

interface HealthMetrics {
    heartRate: number;
    bloodPressure: string;
    steps: number;
    sleep: number;
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface HealthDataContextType {
    metrics: HealthMetrics;
    updateMetrics: (newMetrics: Partial<HealthMetrics>) => void;
    chatHistory: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    syncWearableData: () => Promise<void>;
    isLoading: boolean;
    apiConnected: boolean;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export function HealthDataProvider({ children }: { children: ReactNode }) {
    const [metrics, setMetrics] = useState<HealthMetrics>({
        heartRate: 0,
        bloodPressure: '--/--',
        steps: 0,
        sleep: 0,
    });

    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiConnected, setApiConnected] = useState(false);

    // Check API connection on mount
    useEffect(() => {
        checkAPIConnection();
    }, []);

    const checkAPIConnection = async () => {
        try {
            const response = await healthAPI.checkHealth();
            setApiConnected(response.status === 'Live & Active');
        } catch (error) {
            console.error('API connection failed:', error);
            setApiConnected(false);
        }
    };

    const syncWearableData = async () => {
        setIsLoading(true);
        try {
            const data = await healthAPI.getWearableData();

            setMetrics({
                heartRate: data.heart_rate,
                bloodPressure: `${data.blood_pressure_systolic}/${data.blood_pressure_diastolic}`,
                steps: data.steps,
                sleep: data.sleep_hours,
            });
        } catch (error) {
            console.error('Failed to sync wearable data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateMetrics = (newMetrics: Partial<HealthMetrics>) => {
        setMetrics(prev => ({ ...prev, ...newMetrics }));
    };

    const addMessage = (message: ChatMessage) => {
        setChatHistory(prev => [...prev, message]);
    };

    return (
        <HealthDataContext.Provider value={{
            metrics,
            updateMetrics,
            chatHistory,
            addMessage,
            syncWearableData,
            isLoading,
            apiConnected,
        }}>
            {children}
        </HealthDataContext.Provider>
    );
}

export function useHealthData() {
    const context = useContext(HealthDataContext);
    if (context === undefined) {
        throw new Error('useHealthData must be used within HealthDataProvider');
    }
    return context;
}
