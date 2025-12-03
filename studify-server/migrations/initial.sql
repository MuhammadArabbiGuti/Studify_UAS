-- Create database & tables
CREATE DATABASE IF NOT EXISTS studify_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE studify_db;

--------------------------------------------------------
-- USERS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','teacher','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--------------------------------------------------------
-- COURSES
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  teacher_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------------
-- ENROLLMENTS 
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(64) NOT NULL,
  student_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------------
-- ASSIGNMENTS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(64) PRIMARY KEY,
  course_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  deadline DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------------
-- SUBMISSIONS 
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(64) PRIMARY KEY,
  assignment_id VARCHAR(64) NOT NULL,
  student_id INT NOT NULL,
  file_url VARCHAR(255) NULL,
  grade INT NULL,
  feedback TEXT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

--------------------------------------------------------
-- ANNOUNCEMENTS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(64) PRIMARY KEY,
  course_id VARCHAR(64) NOT NULL,
  teacher_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;
