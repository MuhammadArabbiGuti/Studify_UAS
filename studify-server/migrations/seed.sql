USE studify_db;

--------------------------------------------------------
-- USERS
--------------------------------------------------------
INSERT IGNORE INTO users (name, email, password, role)
VALUES
('Admin memantau', 'admin@studify.com', '12345678', 'admin'),
('Aslam', 'aslam.teacher@studify.com', 'aslamteacher', 'teacher'),
('Darin', 'darin.student@studify.com', 'darinstudent', 'student'),
('Guti', 'guti.student@studify.com', 'gutistudent', 'student');

--------------------------------------------------------
-- COURSES
--------------------------------------------------------
INSERT IGNORE INTO courses (id, title, description, teacher_id)
VALUES
('COURSE-1111', 'Pemrograman Perangkat Bergerak', 'Fundamentals of mobile app development.', 2),
('COURSE-2222', 'Pemrograman Web', 'Website dinamis', 2);

--------------------------------------------------------
-- ENROLLMENTS
--------------------------------------------------------
INSERT IGNORE INTO enrollments (course_id, student_id)
VALUES
('COURSE-1111', 3),
('COURSE-1111', 4),
('COURSE-2222', 3);

--------------------------------------------------------
-- ASSIGNMENTS
--------------------------------------------------------
INSERT IGNORE INTO assignments (id, course_id, title, description, deadline)
VALUES
('ASSIGN-1111', 'COURSE-1111',
 'React Native Components',
 'Submit a demo project using SectionList and routing.',
 '2025-10-05'),

('ASSIGN-2222', 'COURSE-2222',
 'RPL: Project Planning',
 'Write initial system design & requirement analysis.',
 '2025-10-12');

--------------------------------------------------------
-- SUBMISSIONS
--------------------------------------------------------
INSERT IGNORE INTO submissions (id, assignment_id, student_id, file_url, grade, feedback)
VALUES
('SUB-1111', 'ASSIGN-1111', 3, 'https://files.com/jane_submission1.pdf', 90, 'Great job'),
('SUB-2222', 'ASSIGN-1111', 4, 'https://files.com/alex_submission1.pdf', NULL, NULL);

--------------------------------------------------------
-- ANNOUNCEMENTS
--------------------------------------------------------
INSERT IGNORE INTO announcements (id, course_id, teacher_id, content)
VALUES
('ANN-1111', 'COURSE-1111', 2, 'Welcome to Mobile Programming! Please check the first assignment.'),
('ANN-2222', 'COURSE-2222', 2, 'RPL course updates will be posted weekly.');
