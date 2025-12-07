# Studify Backend API

Backend API server untuk aplikasi Studify menggunakan Node.js, Express, dan MySQL.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Konfigurasi database:
   - Copy `.env.example` ke `.env`
   - Edit `.env` dan sesuaikan dengan konfigurasi MySQL Anda:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=studify_db
     DB_PORT=3306
     ```

3. Import database:
   - Import file `studify_db.sql` ke MySQL Anda

4. Jalankan server:
```bash
npm start
```

Atau untuk development dengan auto-reload:
```bash
npm run dev
```

## API Endpoints

Server akan berjalan di `http://localhost:3000`

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/login` - Login user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Lecturers
- `GET /api/lecturers` - Get all lecturers
- `GET /api/lecturers/:id` - Get lecturer by ID
- `POST /api/lecturers` - Create new lecturer
- `PUT /api/lecturers/:id` - Update lecturer
- `DELETE /api/lecturers/:id` - Delete lecturer

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID (with lecturers & students)
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `POST /api/classes/assign-lecturer` - Assign lecturer to class
- `DELETE /api/classes/:classID/lecturer/:lecturerID` - Remove lecturer from class

### Enrollments
- `GET /api/enrollments` - Get all enrollments
- `POST /api/enrollments` - Enroll student to class
- `PUT /api/enrollments/:id` - Update enrollment status
- `DELETE /api/enrollments/:id` - Delete enrollment
- `GET /api/enrollments/student/:studentId` - Get classes by student
- `GET /api/enrollments/lecturer/:lecturerId` - Get classes by lecturer

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `GET /api/assignments/class/:classId` - Get assignments by class
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/submit` - Submit assignment
- `PUT /api/assignments/submission/:submissionId/grade` - Grade submission
- `GET /api/assignments/student/:studentId/submissions` - Get submissions by student

### Materials
- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get material by ID
- `GET /api/materials/class/:classId` - Get materials by class
- `POST /api/materials` - Create new material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `GET /api/announcements/class/:classId` - Get announcements by class
- `POST /api/announcements` - Create new announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

## Testing API

Anda bisa test API menggunakan tools seperti:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Browser untuk GET requests

Contoh request:
```bash
# Get all users
curl http://localhost:3000/api/users

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@univ.ac.id","password":"hash123"}'
```
