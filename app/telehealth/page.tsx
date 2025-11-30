'use client';

import { useState, useEffect } from 'react';
import { Calendar, X, Clock, User, Trash2, Edit, Send } from 'lucide-react';
import { useHealthData } from '@/context/HealthDataContext';

interface Appointment {
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    type: 'video' | 'in-person';
    notes: string;
    status?: 'scheduled' | 'cancelled';
    cancelReason?: string;
}

export default function Telehealth() {
    const { chatHistory, addMessage, apiConnected } = useHealthData();
    const [input, setInput] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [appointmentForm, setAppointmentForm] = useState({
        doctorName: '',
        specialty: 'General Physician',
        date: '',
        time: '',
        type: 'video' as 'video' | 'in-person',
        notes: ''
    });

    // Load appointments from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('healthai_appointments');
        if (saved) {
            setAppointments(JSON.parse(saved));
        }
    }, []);

    // Save appointments to localStorage
    useEffect(() => {
        if (appointments.length > 0) {
            localStorage.setItem('healthai_appointments', JSON.stringify(appointments));
        }
    }, [appointments]);

    useEffect(() => {
        if (chatHistory.length === 0 && apiConnected) {
            addMessage({
                role: 'assistant',
                content: 'Hello! I\'m your AI Health Assistant. Ask me anything about your health!'
            });
        }
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;

        addMessage({ role: 'user', content: input });

        setTimeout(() => {
            const responses: { [key: string]: string } = {
                'diabetes': 'Based on your activity levels and diet, maintain regular exercise and a balanced diet.',
                'sleep': 'Try: consistent sleep schedule, avoid screens before bed, keep room cool and dark.',
                'stress': 'Techniques: deep breathing, meditation, regular physical activity, social connections.',
                'appointment': 'I can help you schedule an appointment. Click the "Schedule New Appointment" button above!',
            };

            const keyword = Object.keys(responses).find(k => input.toLowerCase().includes(k));
            const response = keyword ? responses[keyword] : 'I understand your concern. Could you provide more details?';

            addMessage({ role: 'assistant', content: response });
        }, 1000);

        setInput('');
    };

    const handleScheduleAppointment = () => {
        if (!appointmentForm.doctorName || !appointmentForm.date || !appointmentForm.time) {
            alert('Please fill in all required fields');
            return;
        }

        if (editingAppointment) {
            // Update existing appointment
            setAppointments(appointments.map(apt =>
                apt.id === editingAppointment.id
                    ? { ...appointmentForm, id: apt.id }
                    : apt
            ));
        } else {
            // Create new appointment
            const newAppointment: Appointment = {
                id: Date.now().toString(),
                ...appointmentForm
            };
            setAppointments([...appointments, newAppointment]);
        }

        // Reset form
        setAppointmentForm({
            doctorName: '',
            specialty: 'General Physician',
            date: '',
            time: '',
            type: 'video',
            notes: ''
        });
        setEditingAppointment(null);
        setShowAppointmentModal(false);
    };

    const handleEditAppointment = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setAppointmentForm({
            doctorName: appointment.doctorName,
            specialty: appointment.specialty,
            date: appointment.date,
            time: appointment.time,
            type: appointment.type,
            notes: appointment.notes
        });
        setShowAppointmentModal(true);
    };

    const handleDeleteAppointment = (id: string) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            setAppointments(appointments.filter(apt => apt.id !== id));
        }
    };

    const handleDeleteAllAppointments = () => {
        if (confirm('Are you sure you want to delete ALL appointments? This action cannot be undone.')) {
            setAppointments([]);
            localStorage.removeItem('healthai_appointments');
        }
    };

    const handleCancelAppointment = () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }

        setAppointments(appointments.map(apt =>
            apt.id === cancellingAppointment?.id
                ? { ...apt, status: 'cancelled' as const, cancelReason }
                : apt
        ));

        setCancelReason('');
        setCancellingAppointment(null);
        setShowCancelModal(false);
    };

    const deletePastAppointments = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= today;
        });

        const deletedCount = appointments.length - updatedAppointments.length;

        if (deletedCount > 0) {
            setAppointments(updatedAppointments);
            alert(`Deleted ${deletedCount} past appointment(s)`);
        } else {
            alert('No past appointments to delete');
        }
    };

    // Filter to show only scheduled (non-cancelled) appointments
    const activeAppointments = appointments.filter(apt => apt.status !== 'cancelled');

    const specialties = [
        'General Physician',
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Orthopedic',
        'Pediatrician',
        'Psychiatrist',
        'Dentist'
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in font-mono">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tighter uppercase">
                    Telehealth & AI Assistant
                </h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest">Connect with virtual doctors or chat with our AI health assistant</p>
            </div>

            {/* Upcoming Appointments */}
            <div className="p-6 border border-white/20 bg-white/5 mb-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">Upcoming Appointments</h2>
                    <div className="flex gap-2">
                        {appointments.length > 0 && (
                            <>
                                <button
                                    onClick={deletePastAppointments}
                                    className="px-3 py-2 bg-transparent border border-white/20 hover:border-white hover:text-white text-gray-400 rounded-none text-xs uppercase tracking-wider transition-all duration-300"
                                >
                                    Delete Past
                                </button>
                                <button
                                    onClick={handleDeleteAllAppointments}
                                    className="px-3 py-2 bg-transparent border border-white/20 hover:border-white hover:text-white text-gray-400 rounded-none text-xs uppercase tracking-wider transition-all duration-300"
                                >
                                    Delete All
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => {
                                setEditingAppointment(null);
                                setShowAppointmentModal(true);
                            }}
                            className="px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-none font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 text-xs"
                        >
                            <Calendar size={14} />
                            Schedule New
                        </button>
                    </div>
                </div>

                {activeAppointments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-xs uppercase tracking-widest">No upcoming appointments scheduled</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeAppointments.map((apt) => (
                            <div key={apt.id} className="p-4 border border-white/10 bg-white/5 hover:border-white/30 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{apt.doctorName}</h3>
                                            <span className="px-2 py-1 border border-white/20 text-white text-[10px] uppercase tracking-wider">
                                                {apt.specialty}
                                            </span>
                                            <span className="px-2 py-1 border border-white/20 text-white text-[10px] uppercase tracking-wider">
                                                {apt.type === 'video' ? 'Video Call' : 'In-Person'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-400 uppercase tracking-wide">
                                            <span className="flex items-center gap-1">
                                                {new Date(apt.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                {apt.time}
                                            </span>
                                        </div>
                                        {apt.notes && (
                                            <p className="text-xs text-gray-500 mt-2 italic">Note: {apt.notes}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setCancellingAppointment(apt);
                                                setShowCancelModal(true);
                                            }}
                                            className="p-2 hover:bg-white/10 transition-colors"
                                            title="Cancel Appointment"
                                        >
                                            <X className="text-gray-400 hover:text-white" size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleEditAppointment(apt)}
                                            className="p-2 hover:bg-white/10 transition-colors"
                                        >
                                            <Edit className="text-gray-400 hover:text-white" size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAppointment(apt.id)}
                                            className="p-2 hover:bg-white/10 transition-colors"
                                        >
                                            <Trash2 className="text-gray-400 hover:text-white" size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Chatbot */}
            <div className="p-6 border border-white/20 bg-white/5">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider">AI Health Assistant</h2>
                        <span className={`text-[10px] uppercase tracking-widest ${apiConnected ? 'text-gray-400' : 'text-red-500'}`}>
                            {apiConnected ? 'Connected to Railway' : 'Offline'}
                        </span>
                    </div>
                </div>

                <div className="h-96 overflow-y-auto mb-4 space-y-3 p-4 border border-white/10 bg-black/20">
                    {chatHistory.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 text-xs uppercase tracking-widest">
                            <p>Start a conversation with the AI assistant</p>
                        </div>
                    ) : (
                        chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 text-sm ${msg.role === 'user'
                                        ? 'bg-white text-black font-medium'
                                        : 'bg-transparent border border-white/20 text-gray-300'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about your health..."
                        className="flex-1 px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-white text-sm font-mono"
                    />
                    <button
                        onClick={sendMessage}
                        className="px-6 py-3 bg-white hover:bg-gray-200 text-black transition-colors flex items-center gap-2"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>

            {/* Appointment Modal */}
            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
                    <div className="p-8 border border-white/20 bg-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                                {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAppointmentModal(false);
                                    setEditingAppointment(null);
                                }}
                                className="p-2 hover:bg-white/10 transition-colors"
                            >
                                <X className="text-gray-400 hover:text-white" size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-gray-500 mb-2 block uppercase tracking-widest">Doctor Name *</label>
                                <input
                                    type="text"
                                    value={appointmentForm.doctorName}
                                    onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorName: e.target.value })}
                                    placeholder="Dr. John Smith"
                                    className="w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-700 focus:outline-none focus:border-white text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-2 block uppercase tracking-widest">Specialty *</label>
                                <select
                                    value={appointmentForm.specialty}
                                    onChange={(e) => setAppointmentForm({ ...appointmentForm, specialty: e.target.value })}
                                    className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-white text-sm"
                                >
                                    {specialties.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block uppercase tracking-widest">Date *</label>
                                    <input
                                        type="date"
                                        value={appointmentForm.date}
                                        onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 bg-transparent border border-white/20 text-white focus:outline-none focus:border-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block uppercase tracking-widest">Time *</label>
                                    <input
                                        type="time"
                                        value={appointmentForm.time}
                                        onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                                        className="w-full px-4 py-3 bg-transparent border border-white/20 text-white focus:outline-none focus:border-white text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-2 block uppercase tracking-widest">Appointment Type *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setAppointmentForm({ ...appointmentForm, type: 'video' })}
                                        className={`px-4 py-3 border transition-all duration-300 text-sm uppercase tracking-wider ${appointmentForm.type === 'video'
                                            ? 'bg-white border-white text-black font-bold'
                                            : 'bg-transparent border-white/20 text-gray-400 hover:border-white hover:text-white'
                                            }`}
                                    >
                                        Video Call
                                    </button>
                                    <button
                                        onClick={() => setAppointmentForm({ ...appointmentForm, type: 'in-person' })}
                                        className={`px-4 py-3 border transition-all duration-300 text-sm uppercase tracking-wider ${appointmentForm.type === 'in-person'
                                            ? 'bg-white border-white text-black font-bold'
                                            : 'bg-transparent border-white/20 text-gray-400 hover:border-white hover:text-white'
                                            }`}
                                    >
                                        In-Person
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-2 block uppercase tracking-widest">Notes (Optional)</label>
                                <textarea
                                    value={appointmentForm.notes}
                                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                                    placeholder="Any specific concerns or symptoms to discuss..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-700 resize-none focus:outline-none focus:border-white text-sm"
                                />
                            </div>

                            <button
                                onClick={handleScheduleAppointment}
                                className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-widest transition-all duration-300 text-sm"
                            >
                                {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Appointment Modal */}
            {showCancelModal && cancellingAppointment && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
                    <div className="p-8 border border-white/20 bg-black max-w-md w-full">
                        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Cancel Appointment</h2>
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancellingAppointment(null);
                                    setCancelReason('');
                                }}
                                className="p-2 hover:bg-white/10 transition-colors"
                            >
                                <X className="text-gray-400 hover:text-white" size={20} />
                            </button>
                        </div>

                        <div className="mb-6 p-4 border border-white/10 bg-white/5">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Appointment with:</p>
                            <p className="text-sm font-bold text-white uppercase tracking-wider">{cancellingAppointment.doctorName}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(cancellingAppointment.date).toLocaleDateString()} at {cancellingAppointment.time}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-gray-500 mb-2 block uppercase tracking-widest">Reason for Cancellation *</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Please provide a reason..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-gray-700 resize-none focus:outline-none focus:border-white text-sm"
                                />
                            </div>

                            <div className="p-3 border border-white/10 bg-white/5">
                                <p className="text-xs text-gray-400 uppercase tracking-wide">
                                    ⚠️ This will mark the appointment as cancelled.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancellingAppointment(null);
                                        setCancelReason('');
                                    }}
                                    className="flex-1 py-3 bg-transparent border border-white/20 hover:border-white hover:text-white text-gray-400 font-bold uppercase tracking-widest transition-all duration-300 text-xs"
                                >
                                    Keep
                                </button>
                                <button
                                    onClick={handleCancelAppointment}
                                    className="flex-1 py-3 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-widest transition-all duration-300 text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
