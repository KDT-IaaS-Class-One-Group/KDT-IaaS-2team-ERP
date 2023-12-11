import { pool } from "./db-config.mjs";

// 테이블 쿼리
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    signupId VARCHAR(255) NOT NULL,
    signupPassword VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY unique_signupId (signupId)
  );
`

async function initializeDatabase() {
  try {
    const [result1] = await pool.query(createUsersTableQuery);

    console.log("table created successfully");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

export { initializeDatabase };

// ! DB 초기화 시 명령어 : node -e "import('./data/database-init.mjs').then(module => module.initializeDatabase())"