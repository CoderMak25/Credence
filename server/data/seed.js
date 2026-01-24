const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');

// Read fresh data from JSON file (not cached like require())
const studentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8'));

const MONGODB_URI = process.env.MONGODB_URI;

async function seedData() {
    // Drop the existing collection
    try {
        await mongoose.connection.db.dropCollection('students');
        console.log('🗑️  Dropped students collection');
    } catch (err) {
        console.log('📝 No existing collection to drop');
    }

    // Transform the provided data to match our schema
    const students = studentsData.map(s => ({
        studentId: s.studentId,
        name: s.name,
        department: s.branch, // Map 'branch' to 'department'
        year: Math.ceil(s.semester / 2), // Convert semester to year
        weeklyData: s.weeklyData,
        lastUpdated: new Date()
    }));

    await Student.insertMany(students);
    console.log(`✨ Seeded ${students.length} students with weekly data`);

    // Log summary by risk profile
    const { aggregateMonthlyData } = require('../services/aggregationService');
    const { calculateRisk } = require('../services/riskService');

    let highRisk = 0, medRisk = 0, lowRisk = 0;

    students.forEach(s => {
        const { aggregated, dataAvailability } = aggregateMonthlyData(s.weeklyData);
        const snapshot = { ...s, ...aggregated };
        const risk = calculateRisk(snapshot, dataAvailability);

        if (risk.riskLevel === 'high') highRisk++;
        else if (risk.riskLevel === 'medium') medRisk++;
        else lowRisk++;
    });

    console.log(`📊 Summary: ${highRisk} high-risk, ${medRisk} medium-risk, ${lowRisk} low-risk`);
}

async function runSeed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await seedData();

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    runSeed();
}

module.exports = { seedData };
