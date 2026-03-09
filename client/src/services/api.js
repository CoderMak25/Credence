// Use environment variable for production, fallback to relative path for local dev
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch all students with risk assessments
 */
export async function getStudentRiskData() {
    const response = await fetch(`${API_BASE}/students/risk`);
    if (!response.ok) {
        throw new Error('Failed to fetch student risk data');
    }
    return response.json();
}

/**
 * Fetch a single student by ID
 */
export async function getStudentById(studentId) {
    const response = await fetch(`${API_BASE}/students/${studentId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch student');
    }
    return response.json();
}
/**
 * Fetch aggregated analytics data
 */
export async function getAnalyticsData() {
    const response = await fetch(`${API_BASE}/students/analytics`);
    if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
    }
    return response.json();
}
