import { Tabs } from 'expo-router';
import { ThemeProvider } from '../../src/context/ThemeContext';

export default function Layout() { 
return ( 
  <ThemeProvider>
    <Tabs screenOptions={{ headerTitleAlign: 'center' }}> 
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="kelas" options={{ title: 'Kelas' }} />
      <Tabs.Screen name="notif" options={{ title: 'Notifikasi' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  </ThemeProvider>
); 
} 