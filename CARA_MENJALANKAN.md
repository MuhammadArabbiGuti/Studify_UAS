# 🚀 Cara Menjalankan Aplikasi Studify

## Langkah 1: Setup Database

1. **Jalankan MySQL Server**
   - Buka XAMPP Control Panel
   - Start Apache dan MySQL

2. **Import Database**
   - Buka browser, akses http://localhost/phpmyadmin
   - Klik "New" untuk membuat database baru
   - Nama database: `studify_db`
   - Klik tab "Import"
   - Pilih file `studify_db (1).sql` dari folder Downloads
   - Klik "Go"

3. **Verifikasi**
   - Pastikan database `studify_db` muncul di sidebar kiri
   - Lihat tabel-tabel: users, students, lecturers, class, dll

## Langkah 2: Setup & Jalankan Backend

1. **Konfigurasi Database Connection**
   ```bash
   cd backend
   ```
   
   Edit file `.env`:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=studify_db
   DB_PORT=3306
   ```

2. **Install Dependencies** (sudah dilakukan)
   ```bash
   npm install
   ```

3. **Jalankan Server**
   ```bash
   npm start
   ```
   
   Jika berhasil, akan muncul:
   ```
   ✅ Database connected successfully
   🚀 Server is running on http://localhost:3000
   ```

4. **Test API (Opsional)**
   - Buka browser
   - Akses: http://localhost:3000
   - Harus muncul list API endpoints

## Langkah 3: Setup React Native App

1. **Konfigurasi API Endpoint**
   
   Buka file `src/config/api.js`:
   
   **Untuk emulator:**
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api';
   // atau untuk Android emulator
   const API_BASE_URL = 'http://10.0.2.2:3000/api';
   ```
   
   **Untuk physical device:**
   ```javascript
   // Ganti dengan IP komputer Anda
   const API_BASE_URL = 'http://192.168.1.100:3000/api';
   ```
   
   Cara mendapatkan IP:
   - Buka CMD/Terminal
   - Ketik: `ipconfig` (Windows) atau `ifconfig` (Mac/Linux)
   - Cari IPv4 Address (contoh: 192.168.1.100)

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install package tambahan untuk Picker**
   ```bash
   npx expo install @react-native-picker/picker
   ```

4. **Jalankan Aplikasi**
   ```bash
   npx expo start
   ```

5. **Pilih Platform**
   - Tekan `a` untuk Android emulator
   - Tekan `i` untuk iOS simulator (Mac only)
   - Scan QR code dengan Expo Go app di smartphone

## Langkah 4: Testing Aplikasi

### Login sebagai Admin
1. Pilih role "Admin"
2. Email: `admin@univ.ac.id`
3. Password: `hash123`

### Fitur yang bisa ditest:
- ✅ Tambah Mahasiswa baru
- ✅ Edit data Mahasiswa
- ✅ Hapus Mahasiswa
- ✅ Tambah Dosen baru
- ✅ Edit data Dosen
- ✅ Hapus Dosen
- ✅ Tambah Kelas baru
- ✅ Edit Kelas
- ✅ Hapus Kelas
- ✅ Lihat detail Kelas

## Troubleshooting

### ❌ "Database connection failed"
**Solusi:**
- Pastikan MySQL di XAMPP sudah running (indikator hijau)
- Check file `.env` di folder backend
- Pastikan nama database: `studify_db`

### ❌ "Network request failed" di app
**Solusi:**
- Pastikan backend server sudah running (npm start di folder backend)
- Check IP address di `src/config/api.js`
- Untuk physical device: ganti `localhost` dengan IP komputer
- Pastikan smartphone dan komputer dalam WiFi yang sama

### ❌ Backend error "Cannot find module"
**Solusi:**
```bash
cd backend
npm install
```

### ❌ React Native error "Invariant Violation"
**Solusi:**
```bash
npx expo start -c
# Tekan c untuk clear cache
```

### ❌ "Port 3000 already in use"
**Solusi:**
- Stop proses lain yang menggunakan port 3000
- Atau edit `.env` ganti PORT=3001

## Tips Development

1. **Auto-reload Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend akan restart otomatis saat ada perubahan code

2. **Clear Cache React Native**
   ```bash
   npx expo start -c
   ```

3. **Check Backend Logs**
   Lihat terminal/console backend untuk error messages

4. **Test API dengan Postman/Thunder Client**
   - GET http://localhost:3000/api/students
   - GET http://localhost:3000/api/lecturers
   - GET http://localhost:3000/api/classes

## File Penting yang Telah Dibuat

### Backend:
- ✅ `/backend/server.js` - Main server
- ✅ `/backend/config/database.js` - DB connection
- ✅ `/backend/controllers/` - Business logic untuk setiap tabel
- ✅ `/backend/routes/` - API endpoints
- ✅ `/backend/.env` - Configuration

### Frontend:
- ✅ `/src/services/api.js` - API client
- ✅ `/src/config/api.js` - API base URL
- ✅ `/app/(admin)/AddMahasiswa.jsx` - CRUD Mahasiswa
- ✅ `/app/(admin)/AddDosen.jsx` - CRUD Dosen  
- ✅ `/app/(admin)/AddClass.jsx` - CRUD Kelas

## Catatan Penting

⚠️ **Password di database sample masih plain text!**
Untuk production, password sudah di-hash dengan bcrypt.

⚠️ **Untuk testing di physical device:**
Pastikan edit IP address di `src/config/api.js` dan smartphone & komputer dalam WiFi yang sama.

✅ **Backend & Frontend harus running bersamaan!**
- Terminal 1: `cd backend && npm start`
- Terminal 2: `npx expo start`

## Selamat Mencoba! 🎉

Jika ada pertanyaan atau error, check:
1. Console terminal backend
2. Console terminal React Native  
3. React Native debugger (Shake device > "Debug")
