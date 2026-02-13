import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useHaptic } from './use-haptic';

export const useTaskReminder = () => {
  const { protocols, customSettings } = useAppStore();
  const { success, warning } = useHaptic();

  // Play notification sound
  const playNotificationSound = useCallback((type: 'reminder' | 'complete' = 'reminder') => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = context.currentTime;
      
      if (type === 'reminder') {
        // Two gentle beeps for reminder
        for (let i = 0; i < 2; i++) {
          const osc = context.createOscillator();
          const gain = context.createGain();
          
          osc.connect(gain);
          gain.connect(context.destination);
          
          osc.frequency.value = 800; // Middle C
          gain.gain.setValueAtTime(0.3, now + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.1);
          
          osc.start(now + i * 0.2);
          osc.stop(now + i * 0.2 + 0.1);
        }
      } else {
        // Success sound - three ascending tones
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G
        frequencies.forEach((freq, idx) => {
          const osc = context.createOscillator();
          const gain = context.createGain();
          
          osc.connect(gain);
          gain.connect(context.destination);
          
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, now + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.15);
          
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 0.15);
        });
      }
    } catch (e) {
      console.error('Audio context error:', e);
    }
  }, []);

  // Show web notification
  const showNotification = useCallback((
    title: string,
    options?: NotificationOptions
  ) => {
    if (!customSettings.enableNotifications) return;

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/manifest.json',
          badge: '/robots.txt',
          ...options,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, options);
          }
        });
      }
    }
  }, [customSettings.enableNotifications]);

  // Check for task reminders
  const checkTaskReminders = useCallback(() => {
    if (!customSettings.enableNotifications) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    protocols.forEach((protocol) => {
      if (
        protocol.remind &&
        protocol.scheduledTime &&
        !protocol.completed &&
        protocol.notificationSettings
      ) {
        const { scheduledTime, notificationSettings } = protocol;
        const { reminderMinutes, enableVibration, enableSound, notifyIfTasksLeft } =
          notificationSettings;

        // Calculate reminder time
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        let reminderHours = hours;
        let reminderMins = minutes - reminderMinutes;

        if (reminderMins < 0) {
          reminderHours -= 1;
          reminderMins += 60;
        }

        const reminderTime = `${String(reminderHours).padStart(2, '0')}:${String(
          reminderMins
        ).padStart(2, '0')}`;

        // Check if it's time for reminder
        if (currentTime === reminderTime) {
          // Trigger vibration if enabled
          if (enableVibration) {
            success();
          }

          // Play sound if enabled
          if (enableSound) {
            playNotificationSound('reminder');
          }

          // Show notification
          let notificationTitle = `📌 Reminder: ${protocol.name}`;
          if (notifyIfTasksLeft) {
            const incompleteTasks = protocols.filter((p) => !p.completed).length;
            notificationTitle += ` (${incompleteTasks} task${incompleteTasks !== 1 ? 's' : ''} left)`;
          }

          showNotification(notificationTitle, {
            body: `Scheduled for ${scheduledTime}`,
            tag: `task-${protocol.id}`,
            requireInteraction: true,
          });
        }

        // Check if it's time for the actual task
        if (currentTime === scheduledTime) {
          if (enableVibration) {
            warning();
          }

          if (enableSound) {
            playNotificationSound('complete');
          }

          const incompleteTasks = protocols.filter((p) => !p.completed).length;
          showNotification(`⏰ Time for: ${protocol.name}`, {
            body: `You have ${incompleteTasks} task${incompleteTasks !== 1 ? 's' : ''} to complete`,
            tag: `task-now-${protocol.id}`,
            requireInteraction: true,
          });
        }
      }
    });
  }, [protocols, customSettings.enableNotifications, playNotificationSound, showNotification]);

  // Set up interval to check reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkTaskReminders();
    }, 60000); // Check every minute

    // Also check immediately
    checkTaskReminders();

    return () => clearInterval(interval);
  }, [checkTaskReminders]);

  return {
    playNotificationSound,
    showNotification,
    checkTaskReminders,
  };
};
