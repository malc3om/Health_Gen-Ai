'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const symptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue',
    'Nausea', 'Dizziness', 'Chest Pain', 'Shortness of Breath',
    'Body Aches', 'Sore Throat', 'Runny Nose', 'Loss of Appetite'
];

const severityLevels = ['Mild', 'Moderate', 'Severe'];

export default function SymptomChecker() {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [severity, setSeverity] = useState('Moderate');
    const [analysis, setAnalysis] = useState<any>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const toggleSymptom = (symptom: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const analyzeSymptoms = () => {
        if (selectedSymptoms.length === 0) return;

        setAnalyzing(true);
        setTimeout(() => {
            setAnalysis({
                selectedSymptoms: selectedSymptoms,
                severity: severity,
                message: 'Please consult with a healthcare professional for proper diagnosis and treatment.',
                riskLevel: severity === 'Severe' ? 'High' : severity === 'Moderate' ? 'Medium' : 'Low'
            });

            setAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in font-mono">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter uppercase">
                    AI Symptom Checker
                </h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest">Select your symptoms to get AI-powered health insights</p>
            </div>

            {/* Symptom Selection */}
            <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Select Your Symptoms</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {symptoms.map((symptom, index) => (
                        <motion.button
                            key={symptom}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => toggleSymptom(symptom)}
                            className={`px-4 py-3 rounded-none border transition-all duration-300 text-sm ${selectedSymptoms.includes(symptom)
                                ? 'bg-white border-white text-black font-bold'
                                : 'bg-transparent border-white/20 text-gray-400 hover:border-white hover:text-white'
                                }`}
                        >
                            {symptom}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Severity Level */}
            <div className="mb-12">
                <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Severity Level</h2>
                <div className="grid grid-cols-3 gap-4">
                    {severityLevels.map((level) => (
                        <button
                            key={level}
                            onClick={() => setSeverity(level)}
                            className={`px-8 py-4 rounded-none border transition-all duration-300 text-sm uppercase tracking-wider ${severity === level
                                ? 'bg-white border-white text-black font-bold'
                                : 'bg-transparent border-white/20 text-gray-400 hover:border-white hover:text-white'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Analyze Button */}
            <button
                onClick={analyzeSymptoms}
                disabled={selectedSymptoms.length === 0 || analyzing}
                className="w-full py-4 bg-white hover:bg-gray-200 text-black rounded-none font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {analyzing ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        Analyzing...
                    </>
                ) : (
                    'Analyze Symptoms'
                )}
            </button>

            {/* Analysis Results */}
            {analysis && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 p-6 border border-white/20 bg-white/5"
                >
                    <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-4">
                        Symptom Summary
                    </h2>

                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Selected Symptoms</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.selectedSymptoms.map((symptom: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 border border-white/20 text-white text-xs uppercase tracking-wider">
                                    {symptom}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Severity Level</h3>
                        <span className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border ${analysis.riskLevel === 'High' ? 'border-red-500 text-red-500' :
                            analysis.riskLevel === 'Medium' ? 'border-yellow-500 text-yellow-500' :
                                'border-green-500 text-green-500'
                            }`}>
                            {analysis.severity} ({analysis.riskLevel} Risk)
                        </span>
                    </div>

                    <div className="p-4 border border-white/10 bg-white/5">
                        <p className="text-gray-300 text-xs uppercase tracking-wide">
                            ⚠️ {analysis.message}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
