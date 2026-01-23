const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');

const MONGODB_URI = process.env.MONGODB_URI;

// Realistic names for demo
const firstNames = [
    'Alex', 'Sarah', 'Marcus', 'Priya', 'Jordan', 'Emily', 'David', 'Sophia',
    'James', 'Olivia', 'Ethan', 'Ava', 'Michael', 'Isabella', 'Daniel', 'Mia',
    'Benjamin', 'Charlotte', 'William', 'Amelia', 'Lucas', 'Harper', 'Mason', 'Evelyn',
    'Alexander', 'Abigail', 'Henry', 'Ella', 'Sebastian', 'Scarlett', 'Noah', 'Emma',
    'Liam', 'Chloe', 'Oliver', 'Grace', 'Elijah', 'Lily', 'Leo', 'Zoe',
    'Jack', 'Hannah', 'Aiden', 'Nora', 'Ryan', 'Aria', 'Nathan', 'Luna',
    'Isaac', 'Stella'
];

const lastNames = [
    'Chen', 'Williams', 'Johnson', 'Patel', 'Lee', 'Garcia', 'Kim', 'Martinez',
    'Rodriguez', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
    'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Robinson',
    'Clark', 'Lewis', 'Walker', 'Hall', 'Young', 'King', 'Wright', 'Scott',
    'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell',
    'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker', 'Collins',
    'Edwards', 'Stewart'
];

const departments = [
    'Computer Science', 'Data Science', 'Information Technology',
    'Software Engineering', 'Electrical Engineering', 'Mathematics',
    'Mechanical Engineering', 'Physics', 'Chemistry', 'Biology'
];

// Generate random value with possibility of null
function randomOrNull(min, max, nullProbability = 0.2) {
    if (Math.random() < nullProbability) return null;
    return min + Math.random() * (max - min);
}

// Generate random integer
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random date within the last 30 days
function randomRecentDate() {
    const now = new Date();
    const daysAgo = randomInt(0, 30);
    return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

// Generate student profiles with varied risk levels
function generateStudents(count) {
    const students = [];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[randomInt(0, firstNames.length - 1)];
        const lastName = lastNames[randomInt(0, lastNames.length - 1)];

        // Determine student profile type for realistic distribution
        const profileType = Math.random();
        let student;

        if (profileType < 0.2) {
            // High risk student (20%)
            student = {
                studentId: `STU${String(1000 + i).padStart(5, '0')}`,
                name: `${firstName} ${lastName}`,
                department: departments[randomInt(0, departments.length - 1)],
                year: randomInt(1, 4),
                attendanceRate: randomOrNull(0.4, 0.7, 0.15),
                assignmentCompletionRate: randomOrNull(0.2, 0.5, 0.2),
                quizAverage: randomOrNull(30, 55, 0.15),
                lmsLoginsPerWeek: randomOrNull(0, 3, 0.3),
                lateSubmissionsCount: randomInt(4, 10),
                lastUpdated: randomRecentDate()
            };
        } else if (profileType < 0.5) {
            // Medium risk student (30%)
            student = {
                studentId: `STU${String(1000 + i).padStart(5, '0')}`,
                name: `${firstName} ${lastName}`,
                department: departments[randomInt(0, departments.length - 1)],
                year: randomInt(1, 4),
                attendanceRate: randomOrNull(0.7, 0.85, 0.1),
                assignmentCompletionRate: randomOrNull(0.55, 0.75, 0.15),
                quizAverage: randomOrNull(55, 75, 0.1),
                lmsLoginsPerWeek: randomOrNull(3, 6, 0.2),
                lateSubmissionsCount: randomInt(2, 5),
                lastUpdated: randomRecentDate()
            };
        } else {
            // Low risk student (50%)
            student = {
                studentId: `STU${String(1000 + i).padStart(5, '0')}`,
                name: `${firstName} ${lastName}`,
                department: departments[randomInt(0, departments.length - 1)],
                year: randomInt(1, 4),
                attendanceRate: randomOrNull(0.85, 0.98, 0.05),
                assignmentCompletionRate: randomOrNull(0.8, 0.98, 0.1),
                quizAverage: randomOrNull(75, 95, 0.05),
                lmsLoginsPerWeek: randomOrNull(6, 15, 0.1),
                lateSubmissionsCount: randomInt(0, 2),
                lastUpdated: randomRecentDate()
            };
        }

        students.push(student);
    }

    return students;
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Drop the entire collection to remove old indexes
        try {
            await mongoose.connection.db.dropCollection('students');
            console.log('🗑️  Dropped students collection');
        } catch (err) {
            // Collection might not exist, that's okay
            console.log('📝 No existing collection to drop');
        }

        // Generate and insert 100 students
        const students = generateStudents(100);
        await Student.insertMany(students);
        console.log(`✨ Seeded ${students.length} students`);

        // Log summary
        const highRisk = students.filter(s =>
            (s.attendanceRate && s.attendanceRate < 0.7) ||
            (s.assignmentCompletionRate && s.assignmentCompletionRate < 0.5)
        ).length;
        const medRisk = students.filter(s =>
            (s.attendanceRate && s.attendanceRate >= 0.7 && s.attendanceRate < 0.85) ||
            (s.quizAverage && s.quizAverage >= 55 && s.quizAverage < 75)
        ).length;
        console.log(`📊 Summary: ~${highRisk} high-risk, ~${medRisk} medium-risk, ~${100 - highRisk - medRisk} low-risk`);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
