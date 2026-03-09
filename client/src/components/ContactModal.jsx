import { useState } from 'react';

/**
 * ContactModal - Human-in-the-loop outreach interface
 * Ensures advisors review context before contacting students
 */
export default function ContactModal({ student, urgency, onClose }) {
    const [message, setMessage] = useState(getDefaultMessage(student, urgency));
    const [copied, setCopied] = useState(false);

    // Get suggested tone based on urgency
    const getTone = () => {
        switch (urgency) {
            case 'immediate': return { label: 'Urgent', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
            case 'proactive': return { label: 'Proactive', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' };
            default: return { label: 'Gentle', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' };
        }
    };

    const tone = getTone();

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-lg shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact Student</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{student.name}</p>
                        </div>
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon>
                        </button>
                    </div>
                </div>

                {/* Context Section */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 space-y-3">
                    {/* Reason for outreach */}
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Reason for Suggested Outreach</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {student.riskLevel === 'high'
                                ? `Multiple academic concerns detected: ${student.factors?.filter(f => f.impact === 'high').map(f => f.label.toLowerCase()).join(', ') || 'declining performance'}.`
                                : student.riskLevel === 'medium'
                                    ? 'Some academic signals warrant a check-in to ensure student is on track.'
                                    : 'Routine engagement to maintain connection with student.'
                            }
                        </p>
                    </div>

                    {/* Risk and Confidence context */}
                    <div className="flex gap-4">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Risk Level</p>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${student.riskLevel === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                    student.riskLevel === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                }`}>
                                {student.riskLevel?.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Confidence</p>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {student.confidence}%
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Suggested Tone</p>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${tone.bg} ${tone.color}`}>
                                {tone.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message Draft */}
                <div className="p-4">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                        Draft Message (editable)
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-40 p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 italic">
                        📌 This outreach is supportive, not disciplinary. No message is sent automatically.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <iconify-icon icon="solar:check-circle-bold" width="16"></iconify-icon>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <iconify-icon icon="solar:copy-linear" width="16"></iconify-icon>
                                    Copy Message
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Generate default message based on student context
 */
function getDefaultMessage(student, urgency) {
    const name = student.name?.split(' ')[0] || 'there';

    if (urgency === 'immediate') {
        return `Hi ${name},

I noticed you might be facing some challenges this semester. I wanted to reach out personally to check in and see how things are going.

If there's anything affecting your studies—whether academic, personal, or otherwise—I'm here to help connect you with the right resources.

Would you have time for a brief chat this week? No pressure, just a conversation.

Best regards`;
    }

    if (urgency === 'proactive') {
        return `Hi ${name},

I hope your semester is going well. I wanted to check in briefly to see how your classes are going.

If you have any questions about coursework or need any support, please don't hesitate to reach out. I'm happy to help.

Take care`;
    }

    return `Hi ${name},

Just dropping a quick note to say hello and check in. How's everything going?

Feel free to reach out if you need anything.

Best wishes`;
}
