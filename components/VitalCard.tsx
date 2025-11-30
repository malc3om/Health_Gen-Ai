'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface VitalCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    unit: string;
    status: 'normal' | 'elevated' | 'alert';
    delay?: number;
}

const statusColors = {
    normal: 'bg-green-600/20 text-green-400 border-green-600/30',
    elevated: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
    alert: 'bg-red-600/20 text-red-400 border-red-600/30',
};

export default function VitalCard({ icon: Icon, label, value, unit, status, delay = 0 }: VitalCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0.4, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
            transition={{ delay, duration: 0.5 }}
            className="glass-card p-6 rounded-xl border border-white/5 cursor-pointer transition-colors"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-lg">
                    <Icon className="text-white" size={24} />
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border capitalize ${statusColors[status]}`}>
                    {status}
                </span>
            </div>

            <h3 className="text-gray-400 text-sm mb-2 italic">{label}</h3>
            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{value}</p>
                <span className="text-gray-500 text-sm">{unit}</span>
            </div>
        </motion.div>
    );
}
