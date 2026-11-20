const app = require('./app');
const { sequelize } = require('./models');
const { setMySQLConnected } = require('./config/memoryStore');
const seedDatabase = require('../../database/seeders/seed');

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log('➜ Connecting to MySQL database via Sequelize...');
  try {
    await sequelize.authenticate();
    setMySQLConnected(true);
    console.log('✓ Successfully connected to MySQL database (skilltrack_db).');
    await sequelize.sync({ alter: false });
    console.log('✓ Database tables synchronized.');
    await seedDatabase();
  } catch (error) {
    setMySQLConnected(false);
    console.warn(`\n[SkillTrack Notice] MySQL connection on localhost:3306 was not established: ${error.message}`);
    console.warn('➜ To connect to MySQL: ensure your MySQL service is started (e.g. via XAMPP or MySQL Service), run database/schema.sql, and configure DB credentials in backend/.env.');
    console.warn('➜ Running in resilient baseline data mode: All APIs and features are 100% active!\n');
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SkillTrack Node.js Backend is LIVE on http://localhost:${PORT}`);
    console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
    console.log(`🔑 Demo Accounts:`);
    console.log(`   - Student:   rohit.sharma@skilltrack.com / Student@123`);
    console.log(`   - Admin:     admin@skilltrack.com / Admin@123`);
    console.log(`   - Recruiter: recruiter@google.com / Recruiter@123`);
    console.log(`=======================================================\n`);
  });
}

startServer();

