'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useHealthData } from '@/context/HealthDataContext';

export default function Wearables() {
    const { metrics, syncWearableData, isLoading, apiConnected } = useHealthData();
    const [connected, setConnected] = useState(false);

    const handleConnect = async () => {
        if (!connected) {
            await syncWearableData();
        }
        setConnected(!connected);
    };

    const handleSync = async () => {
        await syncWearableData();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in font-mono">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter uppercase">
                    Activity Tracker
                </h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest">Sync your device or manually log your daily activity</p>
                {apiConnected && (
                    <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">✓ Connected to Railway Backend</p>
                )}
            </div>

            {/* Device Status */}
            <div className="p-6 border border-white/20 bg-white/5 mb-6">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-white' : 'bg-gray-600'}`}></div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                            {connected ? 'Device Connected' : 'No Device Connected'}
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        {connected && (
                            <button
                                onClick={handleSync}
                                disabled={isLoading}
                                className="px-4 py-2 bg-transparent border border-white/20 hover:border-white hover:text-white text-gray-400 rounded-none font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCw className={isLoading ? 'animate-spin' : ''} size={14} />
                                Sync Now
                            </button>
                        )}
                        <button
                            onClick={handleConnect}
                            disabled={isLoading}
                            className="px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-none font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                        >
                            {connected ? 'Disconnect' : 'Connect Device'}
                        </button>
                    </div>
                </div>

                {!connected && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">Track Your Activity</h3>
                        <p className="text-gray-500 mb-8 text-xs uppercase tracking-wide">Connect to Railway API to fetch real-time wearable data.</p>
                        <button
                            onClick={handleConnect}
                            className="px-6 py-3 bg-transparent border border-white/20 hover:border-white hover:text-white text-gray-400 rounded-none font-bold uppercase tracking-widest transition-all duration-300"
                        >
                            Connect & Sync Data
                        </button>
                    </div>
                )}

                {connected && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-6 border border-white/10 bg-white/5 text-center">
                                <p className="text-3xl font-bold text-white tracking-tighter">{metrics.steps}</p>
                                <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Steps</p>
                            </div>
                            <div className="p-6 border border-white/10 bg-white/5 text-center">
                                <p className="text-3xl font-bold text-white tracking-tighter">{metrics.heartRate}</p>
                                <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Heart Rate (bpm)</p>
                            </div>
                            <div className="p-6 border border-white/10 bg-white/5 text-center">
                                <p className="text-3xl font-bold text-white tracking-tighter">{metrics.sleep}</p>
                                <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Hours Sleep</p>
                            </div>
                            <div className="p-6 border border-white/10 bg-white/5 text-center">
                                <p className="text-3xl font-bold text-white tracking-tighter">{metrics.bloodPressure}</p>
                                <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Blood Pressure</p>
                            </div>
                        </div>

                        <div className="p-4 border border-white/10 bg-white/5">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                <span className="font-bold text-white">Live Sync:</span> Data is fetched from Railway backend API in real-time!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
