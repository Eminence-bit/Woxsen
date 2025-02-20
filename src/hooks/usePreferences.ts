import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Preferences {
  pushNotifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  reduceMotion: boolean;
  useDeviceLanguage: boolean;
  regionalFormat: boolean;
}

const defaultPreferences: Preferences = {
  pushNotifications: false,
  soundEffects: true,
  darkMode: false,
  reduceMotion: false,
  useDeviceLanguage: true,
  regionalFormat: true,
};

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  useEffect(() => {
    // Apply dark mode on mount and when it changes
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  const handleToggle = async (key: keyof Preferences) => {
    console.log('Handling toggle for:', key);
    
    try {
      const newPreferences = { ...preferences, [key]: !preferences[key] };
      
      // Handle specific toggles
      switch (key) {
        case 'darkMode':
          document.documentElement.classList.toggle('dark', newPreferences[key]);
          break;
          
        case 'pushNotifications':
          if (newPreferences[key]) {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
              toast.error('Notification permission denied');
              return;
            }
          }
          break;
          
        case 'soundEffects':
          if (newPreferences[key]) {
            const audio = new Audio('/notification-sound.mp3');
            audio.volume = 0.5;
            try {
              await audio.play();
            } catch (error) {
              console.error('Audio playback failed:', error);
              toast.error('Failed to play sound');
            }
          }
          break;
      }

      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      
      // Update state
      setPreferences(newPreferences);
      
      // Show success toast
      toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newPreferences[key] ? 'enabled' : 'disabled'}`);
      
    } catch (error) {
      console.error('Error toggling preference:', error);
      toast.error('Failed to update preference');
    }
  };

  return { preferences, handleToggle };
};