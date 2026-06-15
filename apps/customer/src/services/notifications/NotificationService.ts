export const NotificationService = {
  registerForPushNotifications: async (): Promise<string | null> => {
    return 'mock_expo_push_token_abc123';
  },
  triggerLocalNotification: async (title: string, body: string, data?: Record<string, any>) => {
    console.log(`Notification Triggered: [${title}] - ${body}`, data);
    // In production:
    // await Notifications.scheduleNotificationAsync({
    //   content: { title, body, data },
    //   trigger: null, // immediate
    // });
  },
};
export default NotificationService;
