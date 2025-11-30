'use client';

import { useState } from 'react';
import { useHealthData } from '@/context/HealthDataContext';

export default function HealthPlan() {
    const { metrics } = useHealthData();
    const [plan, setPlan] = useState<any>(null);
    const [generating, setGenerating] = useState(false);

    const generatePlan = () => {
        setGenerating(true);

        // Simulate AI plan generation
        setTimeout(() => {
            const hasData = metrics.heartRate > 0 || metrics.steps > 0;

            setPlan({
                diet: hasData ? [
                    'Increase protein intake to 1.6g per kg body weight for muscle recovery',
                    'Consume 5 servings of colorful vegetables daily for antioxidants',
                    'Stay hydrated with 8-10 glasses of water throughout the day',
                    'Include omega-3 rich foods like salmon, walnuts, and flaxseeds',
                    'Limit processed foods and added sugars to less than 10% of daily calories'
                ] : [
                    'Focus on whole, unprocessed foods',
                    'Eat a balanced diet with fruits, vegetables, lean proteins',
                    'Stay hydrated throughout the day',
                    'Limit sugar and processed foods'
                ],
                exercise: hasData ? [
                    `Aim for ${metrics.steps > 5000 ? '12,000' : '10,000'} steps daily to improve cardiovascular health`,
                    '30 minutes of moderate cardio 5 days per week (brisk walking, cycling)',
                    'Strength training 3 times per week targeting major muscle groups',
                    '10 minutes of stretching daily to improve flexibility',
                    'Include 1-2 rest days for recovery and muscle repair'
                ] : [
                    'Start with 30 minutes of walking daily',
                    'Add strength training 2-3 times per week',
                    'Include stretching and flexibility exercises',
                    'Gradually increase intensity over time'
                ],
                lifestyle: hasData ? [
                    `Maintain ${metrics.sleep > 6 ? '7-9' : '8-9'} hours of quality sleep each night`,
                    'Practice stress management: 10 minutes of meditation or deep breathing daily',
                    'Limit screen time 1 hour before bedtime for better sleep quality',
                    'Take short breaks every hour if working at a desk',
                    'Spend 15-20 minutes outdoors daily for vitamin D and mental health'
                ] : [
                    'Aim for 7-9 hours of sleep nightly',
                    'Practice stress management techniques',
                    'Limit screen time before bed',
                    'Take regular breaks during work'
                ],
                goals: hasData ? [
                    `Increase daily steps from ${metrics.steps} to ${metrics.steps + 2000} within 2 weeks`,
                    `Maintain heart rate in healthy zone (60-100 bpm) - Current: ${metrics.heartRate} bpm`,
                    'Achieve 7+ hours of sleep consistently for 30 days',
                    'Reduce stress levels through daily mindfulness practice',
                    'Complete health check-up and track progress monthly'
                ] : [
                    'Establish a consistent exercise routine',
                    'Improve sleep quality and duration',
                    'Maintain a balanced, nutritious diet',
                    'Schedule regular health check-ups'
                ]
            });

            setGenerating(false);
        }, 2000);
    };

    const handleConnectWearable = () => {
        // Navigate to wearables page
        window.location.href = '/wearables';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in font-mono">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter uppercase">
                    Personalized Health Plan
                </h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest">AI-generated recommendations tailored to your health goals</p>
            </div>

            {/* No Plan State */}
            {!plan && (
                <div className="p-12 border border-white/20 bg-white/5 text-center">
                    <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">No Health Plan Generated</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-sm">
                        Generate a personalized AI health plan based on your current health data and goals.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={generatePlan}
                            disabled={generating}
                            className="px-8 py-3 bg-white hover:bg-gray-200 text-black rounded-none font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                    Generating...
                                </>
                            ) : (
                                'Generate Health Plan'
                            )}
                        </button>
                        <button
                            onClick={handleConnectWearable}
                            className="px-8 py-3 bg-transparent border border-white/20 hover:border-white hover:text-white text-gray-400 rounded-none font-bold uppercase tracking-widest transition-all duration-300"
                        >
                            Connect Wearable
                        </button>
                    </div>
                </div>
            )}

            {/* Generated Plan */}
            {plan && (
                <div className="space-y-6">
                    {/* Success Message */}
                    <div className="p-6 border border-white/20 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Health Plan Generated Successfully!</h3>
                                <p className="text-xs text-gray-500 mt-1">Your personalized plan is ready based on your health data</p>
                            </div>
                        </div>
                    </div>

                    {/* Diet Recommendations */}
                    <div className="p-6 border border-white/20 bg-white/5">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Diet Recommendations</h2>
                        </div>
                        <ul className="space-y-3">
                            {plan.diet.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                    <span className="text-white mt-1 font-bold">›</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Exercise Routine */}
                    <div className="p-6 border border-white/20 bg-white/5">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Exercise Routine</h2>
                        </div>
                        <ul className="space-y-3">
                            {plan.exercise.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                    <span className="text-white mt-1 font-bold">›</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Lifestyle Tips */}
                    <div className="p-6 border border-white/20 bg-white/5">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Lifestyle & Wellness</h2>
                        </div>
                        <ul className="space-y-3">
                            {plan.lifestyle.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                    <span className="text-white mt-1 font-bold">›</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weekly Goals */}
                    <div className="p-6 border border-white/20 bg-white/5">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Weekly Goals</h2>
                        </div>
                        <ul className="space-y-3">
                            {plan.goals.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                    <span className="text-white mt-1 font-bold">›</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center mt-8">
                        <button
                            onClick={() => setPlan(null)}
                            className="px-8 py-3 bg-transparent border border-white/20 hover:border-white hover:text-white text-gray-400 rounded-none font-bold uppercase tracking-widest transition-all duration-300"
                        >
                            Generate New Plan
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-8 py-3 bg-white hover:bg-gray-200 text-black rounded-none font-bold uppercase tracking-widest transition-all duration-300"
                        >
                            Print Plan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
