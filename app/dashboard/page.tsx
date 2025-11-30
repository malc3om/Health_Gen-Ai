'use client';

import { useState } from 'react';
import { Heart, Activity, Footprints, Moon, Bell, X, Loader2 } from 'lucide-react';
import VitalCard from '@/components/VitalCard';
import { useHealthData } from '@/context/HealthDataContext';
import { healthAPI, convertToHealthInput } from '@/lib/api';

export default function Dashboard() {
    const { metrics, apiConnected, updateMetrics } = useHealthData();
    const [showPredictorModal, setShowPredictorModal] = useState(false);
    const [showDataModal, setShowDataModal] = useState(false);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [predictionResult, setPredictionResult] = useState<any>(null);
    const [formData, setFormData] = useState({
        age: 25,
        sex: 'male' as 'male' | 'female',
        bloodPressure: 120,
        cholesterol: 200,
        heartRate: 150,
        hasChestPain: false,
        exerciseAngina: false,
        fastingBloodSugar: 110,
    });
    const [manualData, setManualData] = useState({
        heartRate: metrics.heartRate || 72,
        systolic: 120,
        diastolic: 80,
        steps: metrics.steps || 0,
        sleep: metrics.sleep || 7,
    });

    const handlePredict = async () => {
        setPredictionLoading(true);
        setPredictionResult(null);

        try {
            const input = convertToHealthInput(formData);
            const result = await healthAPI.predictRisk(input);
            setPredictionResult(result);
        } catch (error) {
            console.error('Prediction failed:', error);
            setPredictionResult({
                error: true,
                message: 'Failed to get prediction. Please try again.',
            });
        } finally {
            setPredictionLoading(false);
        }
    };

    return (
        <div className="p-8 pl-20 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Health Dashboard</h1>
                    <p className="text-gray-400">Track your daily vitals and monitor your progress</p>
                    {apiConnected && (
                        <p className="text-xs text-green-400 mt-1">✓ Connected to Railway Backend</p>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowPredictorModal(true)}
                        className="px-6 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Activity size={20} />
                        AI Heart Predictor
                    </button>
                    <button
                        onClick={() => setShowDataModal(true)}
                        className="px-6 py-3 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-lg transition-colors"
                    >
                        Log Today's Data
                    </button>
                    <button className="p-3 bg-transparent border border-white/20 hover:bg-white/5 rounded-lg transition-colors relative">
                        <Bell size={20} className="text-gray-400" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <VitalCard
                    icon={Heart}
                    label="Heart Rate"
                    value={metrics.heartRate}
                    unit="bpm"
                    status="normal"
                    delay={0}
                />
                <VitalCard
                    icon={Activity}
                    label="Blood Pressure"
                    value={metrics.bloodPressure}
                    unit="mmHg"
                    status="normal"
                    delay={0.1}
                />
                <VitalCard
                    icon={Footprints}
                    label="Steps Today"
                    value={metrics.steps}
                    unit="steps"
                    status="normal"
                    delay={0.2}
                />
                <VitalCard
                    icon={Moon}
                    label="Sleep"
                    value={metrics.sleep}
                    unit="hours"
                    status="normal"
                    delay={0.3}
                />
            </div>

            {/* Disclaimer */}
            <div className="glass-card p-4 rounded-lg border-l-4 border-yellow-600">
                <p className="text-sm text-yellow-400 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    This system provides AI-assisted health insights and is not a substitute for professional medical advice.
                </p>
            </div>

            {/* AI Predictor Modal */}
            {showPredictorModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-cyan-600/20 rounded-lg">
                                    <Heart className="text-cyan-400" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">AI Heart Disease Predictor</h2>
                                    <p className="text-sm text-gray-400">Powered by Machine Learning on Railway</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPredictorModal(false);
                                    setPredictionResult(null);
                                }}
                                className="p-2 hover:bg-dark-cardHover rounded-lg transition-colors"
                            >
                                <X className="text-gray-400" size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        {!predictionResult && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Age</label>
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Sex</label>
                                        <select
                                            value={formData.sex}
                                            onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'male' | 'female' })}
                                            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Resting Blood Pressure</label>
                                        <input
                                            type="number"
                                            value={formData.bloodPressure}
                                            onChange={(e) => setFormData({ ...formData, bloodPressure: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Cholesterol (mg/dl)</label>
                                        <input
                                            type="number"
                                            value={formData.cholesterol}
                                            onChange={(e) => setFormData({ ...formData, cholesterol: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Max Heart Rate</label>
                                        <input
                                            type="number"
                                            value={formData.heartRate}
                                            onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Fasting Blood Sugar (mg/dl)</label>
                                        <input
                                            type="number"
                                            value={formData.fastingBloodSugar}
                                            onChange={(e) => setFormData({ ...formData, fastingBloodSugar: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.hasChestPain}
                                            onChange={(e) => setFormData({ ...formData, hasChestPain: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        Chest Pain
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.exerciseAngina}
                                            onChange={(e) => setFormData({ ...formData, exerciseAngina: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        Exercise Induced Angina
                                    </label>
                                </div>

                                <button
                                    onClick={handlePredict}
                                    disabled={predictionLoading}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {predictionLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Activity size={20} />
                                            Predict Heart Disease Risk
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Results */}
                        {predictionResult && !predictionResult.error && (
                            <div className="space-y-4">
                                <div className={`p-6 rounded-lg border-l-4 ${predictionResult.risk_level === 'High' ? 'border-red-600 bg-red-600/10' :
                                    predictionResult.risk_level === 'Medium' ? 'border-yellow-600 bg-yellow-600/10' :
                                        'border-green-600 bg-green-600/10'
                                    }`}>
                                    <h3 className="text-xl font-bold text-white mb-2">Prediction Result</h3>
                                    <p className={`text-3xl font-bold mb-4 ${predictionResult.risk_level === 'High' ? 'text-red-400' :
                                        predictionResult.risk_level === 'Medium' ? 'text-yellow-400' :
                                            'text-green-400'
                                        }`}>
                                        {predictionResult.risk_level}
                                    </p>
                                    <p className="text-gray-300 mb-2">
                                        Probability: <span className="font-semibold">{(predictionResult.probability * 100).toFixed(1)}%</span>
                                    </p>
                                    <p className="text-gray-300">
                                        Prediction: <span className="font-semibold">{predictionResult.prediction === 1 ? 'Heart Disease Detected' : 'No Heart Disease Detected'}</span>
                                    </p>
                                </div>

                                {predictionResult.recommendations && (
                                    <div className="glass-card p-4 rounded-lg">
                                        <h4 className="font-semibold text-white mb-3">Recommendations:</h4>
                                        <ul className="space-y-2">
                                            {predictionResult.recommendations.map((rec: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2 text-gray-300">
                                                    <span className="text-cyan-400 mt-1">•</span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button
                                    onClick={() => setPredictionResult(null)}
                                    className="w-full py-3 bg-dark-card hover:bg-dark-cardHover border border-cyan-600/50 text-cyan-400 rounded-lg transition-colors"
                                >
                                    New Prediction
                                </button>
                            </div>
                        )}

                        {predictionResult && predictionResult.error && (
                            <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-lg">
                                <p className="text-red-400">{predictionResult.message}</p>
                                <button
                                    onClick={() => setPredictionResult(null)}
                                    className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Manual Data Logging Modal */}
            {showDataModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 rounded-xl max-w-lg w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Log Today's Health Data</h2>
                            <button
                                onClick={() => setShowDataModal(false)}
                                className="p-2 hover:bg-dark-cardHover rounded-lg transition-colors"
                            >
                                <X className="text-gray-400" size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Heart Rate (bpm)</label>
                                <input
                                    type="number"
                                    value={manualData.heartRate}
                                    onChange={(e) => setManualData({ ...manualData, heartRate: Number(e.target.value) })}
                                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Systolic BP</label>
                                    <input
                                        type="number"
                                        value={manualData.systolic}
                                        onChange={(e) => setManualData({ ...manualData, systolic: Number(e.target.value) })}
                                        className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Diastolic BP</label>
                                    <input
                                        type="number"
                                        value={manualData.diastolic}
                                        onChange={(e) => setManualData({ ...manualData, diastolic: Number(e.target.value) })}
                                        className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Steps Today</label>
                                <input
                                    type="number"
                                    value={manualData.steps}
                                    onChange={(e) => setManualData({ ...manualData, steps: Number(e.target.value) })}
                                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Sleep (hours)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={manualData.sleep}
                                    onChange={(e) => setManualData({ ...manualData, sleep: Number(e.target.value) })}
                                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    updateMetrics({
                                        heartRate: manualData.heartRate,
                                        bloodPressure: `${manualData.systolic}/${manualData.diastolic}`,
                                        steps: manualData.steps,
                                        sleep: manualData.sleep,
                                    });
                                    setShowDataModal(false);
                                }}
                                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300"
                            >
                                Save Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
