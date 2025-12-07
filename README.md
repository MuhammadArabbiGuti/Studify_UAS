# Studify - Sistem Manajemen Pembelajaran

Aplikasi mobile untuk manajemen kelas, tugas, dan pembelajaran menggunakan React Native (Expo) dengan backend Node.js dan MySQL.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:
- Node.js (v14 atau lebih baru)
- npm atau yarn
- MySQL Server (XAMPP/WAMP/standalone)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app di smartphone (opsional, untuk testing di device)

## 🚀 Setup Instruksi

### 1. Setup Database

1. Jalankan MySQL server (melalui XAMPP/WAMP atau standalone)
2. Buka phpMyAdmin atau MySQL client
3. Import file `studify_db (1).sql` yang ada di folder downloads
4. Database `studify_db` akan otomatis terbuat dengan semua tabel dan data sample

### 2. Setup Backend API

```bash
# Masuk ke folder backend
cd backend

# Install dependencies (sudah dilakukan)
npm install

# Edit file .env dan sesuaikan dengan konfigurasi MySQL Anda
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=studify_db
# DB_PORT=3306

# Jalankan server
npm start

# Atau untuk development dengan auto-reload
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 3. Setup React Native App

```bash
# Kembali ke folder root project
cd ..

# Install dependencies
npm install

# Jalankan aplikasi
npx expo start
```

### 4. Konfigurasi API Endpoint

Jika testing di physical device, edit file `src/config/api.js`:

```javascript
// Ganti dengan IP address komputer Anda (Misal kek di contoh saya adalah 192.168.1.5)
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

Cara mendapatkan IP address komputer:
- Windows: Buka CMD, ketik `ipconfig`, cari IPv4 Address
- Mac/Linux: Terminal, ketik `ifconfig` atau `ip addr`

## 🔑 Login Credentials (Data Sample)

### Admin
- Email: `admin@univ.ac.id`
- Password: `hash123`

### Dosen
- Email: `budi.santoso@univ.ac.id` atau `siti.aminah@univ.ac.id`
- Password: `hash123`

### Mahasiswa
- Email: `andi.pratama@mhs.univ.ac.id`, `maya.sari@mhs.univ.ac.id`, atau `joko.widodo@mhs.univ.ac.id`
- Password: `hash123`

**Note:** Password hash belum diimplementasikan dengan benar di sample data. Untuk production, gunakan bcrypt yang sudah ada di backend.

## 📱 Fitur yang Sudah Diimplementasikan

### Admin
- ✅ CRUD Mahasiswa (Create, Read, Update, Delete)
- ✅ CRUD Dosen
- ✅ CRUD Kelas
- ✅ Management Users

### Dosen
- View kelas yang diajar
- Lihat mahasiswa di kelas
- Create assignments
- Grade submissions

### Mahasiswa
- View kelas yang diikuti
- Submit assignments
- View grades
- View materials

## 📁 Struktur Project

```
Studify_UAS/
├── backend/                    # Backend API Server
│   ├── config/                 # Database configuration
│   ├── controllers/            # API Controllers
│   ├── routes/                 # API Routes
│   ├── server.js              # Main server file
│   └── package.json
│
├── app/                        # React Native Screens
│   ├── (admin)/               # Admin screens
│   ├── (dosen)/               # Lecturer screens
│   ├── (mahasiswa)/           # Student screens
│   └── role/                  # Role selection
│
├── src/
│   ├── services/              # API service layer
│   ├── config/                # App configuration
│   ├── components/            # Reusable components
│   ├── constants/             # Constants & dummy data
│   └── storage/               # Local storage (old)
│
└── package.json
```

## 🔧 Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan MySQL server sudah berjalan
- Cek konfigurasi di file `.env`
- Pastikan nama database sudah benar

### React Native app tidak bisa connect ke API
- Pastikan backend server sudah berjalan (`npm start` di folder backend)
- Jika testing di physical device, pastikan IP address di `src/config/api.js` sudah benar
- Pastikan device dan komputer dalam jaringan WiFi yang sama

### Error "Network request failed"
- Ganti `localhost` dengan IP address komputer di `src/config/api.js`
- Disable firewall sementara atau allow port 3000

## 📝 API Endpoints

Backend menyediakan REST API untuk:
- `/api/users` - User management & authentication
- `/api/students` - Student CRUD
- `/api/lecturers` - Lecturer CRUD
- `/api/classes` - Class management
- `/api/enrollments` - Enrollment management
- `/api/assignments` - Assignment & submission management
- `/api/materials` - Learning materials
- `/api/announcements` - Class announcements

Lihat `backend/README.md` untuk detail lengkap API documentation.

## 🎯 Next Steps

1. Implement authentication dengan JWT tokens
2. Implement file upload untuk assignments
3. Add real-time notifications
4. Implement attendance feature
5. Add grade calculation

## 👥 Kontributor

Developed untuk UAS (Ujian Akhir Semester)

## 📄 License

Educational purpose only.
