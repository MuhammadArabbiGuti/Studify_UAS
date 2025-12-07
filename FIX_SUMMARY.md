# Fix Summary - Network Error & VirtualizedList Warning

## Perubahan yang Dilakukan:

### 1. ✅ Fix Network Request Failed
**File:** `src/config/api.js`
- Mengubah `localhost` menjadi IP address: `192.168.1.5`
- Sekarang app bisa connect ke backend dari physical device

### 2. ✅ Fix VirtualizedList Nested Warning
**Files:** 
- `app/(admin)/AddMahasiswa.jsx`
- `app/(admin)/AddDosen_NEW.jsx`
- `app/(admin)/AddClass_NEW.jsx`

**Perubahan:**
- Mengganti `<FlatList>` dengan `.map()` 
- Menghapus import FlatList
- Data tetap ditampilkan dalam ScrollView dengan render manual

## Cara Testing:

1. **Jalankan Backend:**
   ```bash
   cd backend
   npm start
   ```
   Pastikan muncul: ✅ Database connected successfully

2. **Jalankan React Native:**
   ```bash
   npx expo start
   ```

3. **Test di Device:**
   - Scan QR code dengan Expo Go
   - Login sebagai Admin (admin@univ.ac.id / hash123)
   - Test CRUD Mahasiswa, Dosen, dan Kelas

## Catatan:
- Backend harus running di terminal terpisah
- IP address 192.168.1.5 sudah dikonfigurasi
- Pastikan firewall tidak memblok port 3000
- Device dan komputer harus dalam WiFi yang sama
