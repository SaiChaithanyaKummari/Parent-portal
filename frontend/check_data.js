/*const db = require('./src/db.json');

console.log('Top-level keys:', Object.keys(db));
console.log('attendanceRecords exists:', 'attendanceRecords' in db);
console.log('paymentRecords exists:', 'paymentRecords' in db);
console.log('academicRecords exists:', 'academicRecords' in db);
console.log();

for (let i = 0; i < db.students.length; i++) {
  const s = db.students[i];
  const acad = db.academicRecords.find(r => r.studentId === s.id);
  const att = db.attendanceRecords.find(r => r.studentId === s.id);
  const pay = db.paymentRecords.find(r => r.studentId === s.id);
  console.log(`Student ${s.id} (${s.name}): acad=${!!acad}, att=${!!att}, pay=${!!pay}`);
  if (att) {
    console.log(`  - summaryStats: ${att.summaryStats?.length || 0}, monthlyData: ${att.monthlyData?.length || 0}, subjects: ${att.subjects?.length || 0}, attendanceMap keys: ${Object.keys(att.attendanceMap || {}).length}`);
  }
  if (pay) {
    console.log(`  - transactions: ${pay.transactions?.length || 0}`);
  }
}

// Simulate what Login.jsx does
console.log('\n=== Simulating Login Flow ===');
const parent = db.parents.find(p => p.email === 'parent@example.com' && p.password === 'password123');
console.log('Parent found:', !!parent, 'parentId:', parent?.id, 'studentId:', parent?.studentId);

const student = db.students.find(s => s.id === parent.studentId);
console.log('Student found:', !!student, 'id:', student?.id, 'name:', student?.name);

const userObj = { type: 'parent', ...parent, student };
const serialized = JSON.stringify(userObj);
const deserialized = JSON.parse(serialized);
console.log('After JSON round-trip, student.id type:', typeof deserialized.student.id, 'value:', deserialized.student.id);

// Check what Result.jsx would find
const acadFind = db.academicRecords.find(r => r.studentId === deserialized.student.id);
console.log('Result page academic data found:', !!acadFind);
*/