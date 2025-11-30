'use client';

import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useHealthData } from '@/context/HealthDataContext';

export default function HealthAnalytics() {
    const { metrics } = useHealthData();
    const [timeRange, setTimeRange] = useState('7days');

    // Generate sample data based on current metrics
    const generateHeartRateData = () => {
        const baseRate = metrics.heartRate || 72;
        return Array.from({ length: 7 }, (_, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            heartRate: baseRate + Math.floor(Math.random() * 20 - 10),
            target: 75
        }));
    };

    const generateActivityData = () => {
        const baseSteps = metrics.steps || 5000;
        return Array.from({ length: 7 }, (_, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            steps: Math.max(0, baseSteps + Math.floor(Math.random() * 4000 - 2000)),
            goal: 10000
        }));
    };

    const heartRateData = generateHeartRateData();
    const activityData = generateActivityData();

    const hasData = metrics.heartRate > 0 || metrics.steps > 0;

    // Calculate insights
    const avgHeartRate = Math.round(heartRateData.reduce((sum, d) => sum + d.heartRate, 0) / 7);
    const avgSteps = Math.round(activityData.reduce((sum, d) => sum + d.steps, 0) / 7);
    const stepsGoalProgress = Math.round((avgSteps / 10000) * 100);

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in font-mono">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter uppercase">
                    Health Analytics
                </h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest">Track your health trends and AI-powered insights</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex justify-center gap-2 mb-12">
                {['7days', '30days', '90days'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-6 py-2 rounded-none transition-all duration-300 text-sm uppercase tracking-wider ${timeRange === range
                            ? 'bg-white text-black font-bold'
                            : 'bg-transparent border border-white/20 text-gray-400 hover:border-white hover:text-white'
                            }`}
                    >
                        {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : '90 Days'}
                    </button>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {/* Heart Rate Trend */}
                <div className="p-6 border border-white/20 bg-white/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Heart Rate Trend</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={heartRateData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '0px' }}
                                labelStyle={{ color: '#fff', textTransform: 'uppercase', fontSize: '12px' }}
                                itemStyle={{ fontSize: '12px', textTransform: 'uppercase' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', textTransform: 'uppercase', paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="heartRate" stroke="#fff" strokeWidth={2} dot={{ fill: '#fff', r: 3 }} name="Heart Rate (bpm)" />
                            <Line type="monotone" dataKey="target" stroke="#666" strokeDasharray="5 5" name="Target" />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Average: <span className="text-white font-bold">{avgHeartRate} bpm</span></p>
                    </div>
                </div>

                {/* Weekly Activity */}
                <div className="p-6 border border-white/20 bg-white/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Weekly Activity</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '0px' }}
                                labelStyle={{ color: '#fff', textTransform: 'uppercase', fontSize: '12px' }}
                                itemStyle={{ fontSize: '12px', textTransform: 'uppercase' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', textTransform: 'uppercase', paddingTop: '10px' }} />
                            <Bar dataKey="steps" fill="#fff" name="Steps" />
                            <Bar dataKey="goal" fill="#333" name="Goal (10k)" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Daily Average: <span className="text-white font-bold">{avgSteps.toLocaleString()} steps</span>
                            {' '}({stepsGoalProgress}% of goal)
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="p-6 border border-white/20 bg-white/5 mb-6">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">AI-Powered Insights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-transparent border border-white/10 p-4">
                        <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Heart Health</h3>
                        <p className="text-gray-400 text-xs">
                            {avgHeartRate < 60 ? 'Your resting heart rate is excellent! Keep up the cardio fitness.' :
                                avgHeartRate < 80 ? 'Your heart rate is in a healthy range. Maintain your current activity level.' :
                                    'Consider increasing cardiovascular exercise to improve heart health.'}
                        </p>
                    </div>
                    <div className="bg-transparent border border-white/10 p-4">
                        <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Activity Level</h3>
                        <p className="text-gray-400 text-xs">
                            {stepsGoalProgress >= 100 ? 'Excellent! You\'re consistently meeting your daily step goal.' :
                                stepsGoalProgress >= 70 ? 'Good progress! Try adding a 10-minute walk to reach your goal.' :
                                    'Increase daily movement. Start with short walks after meals.'}
                        </p>
                    </div>
                    <div className="bg-transparent border border-white/10 p-4">
                        <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Recommendations</h3>
                        <p className="text-gray-400 text-xs">
                            {hasData ?
                                'Your data shows consistent patterns. Consider adding strength training 2-3x per week.' :
                                'Sync your wearable device to get personalized health recommendations.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Health Score */}
            <div className="mt-12 p-8 border border-white/20 bg-white/5 text-center">
                <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-wider">Overall Health Score</h2>
                <div className="relative inline-block">
                    <svg className="transform -rotate-90" width="200" height="200">
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            stroke="#333"
                            strokeWidth="8"
                            fill="none"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            stroke="#fff"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${stepsGoalProgress * 5.03} 503`}
                            strokeLinecap="square"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div>
                            <p className="text-5xl font-bold text-white tracking-tighter">{Math.min(stepsGoalProgress, 100)}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Score</p>
                        </div>
                    </div>
                </div>
                <p className="text-gray-400 mt-6 max-w-md mx-auto text-xs uppercase tracking-wide">
                    {stepsGoalProgress >= 90 ? 'Outstanding! Your health metrics are excellent.' :
                        stepsGoalProgress >= 70 ? 'Good! Keep maintaining healthy habits.' :
                            'There\'s room for improvement. Follow your personalized health plan.'}
                </p>
            </div>
        </div>
    );
}
