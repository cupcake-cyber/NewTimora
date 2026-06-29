export interface Configuration {
  notifyAppointments: boolean;
  notifyReservations: boolean;
  notifyCancellations: boolean;
  notifyReminders: boolean;

  appChannelEnabled: boolean;
  emailChannelEnabled: boolean;

  darkMode: boolean;

  reminderMinutesBefore: number;

  startTimeSilence?: string; // LocalTime -> string "HH:mm:ss"
  endTimeSilence?: string;
}

export interface ConfigurationPatch {
  notifyAppointments?: boolean;
  notifyReservations?: boolean;
  notifyCancellations?: boolean;
  notifyReminders?: boolean;

  appChannelEnabled?: boolean;
  emailChannelEnabled?: boolean;

  darkMode?: boolean;

  reminderMinutesBefore?: number;

  startTimeSilence?: string;
  endTimeSilence?: string;
}