import { create } from "zustand";
import axios from "axios";

interface Meeting {
  id: number;
  title: string;
  detail: string;
  user: string;
  start: string;
  end: string;
  created_at: string;
  updated_at: string;
}

interface MeetingResponse {
  events: Meeting[];
  message: string;
  status: string;
}

interface SingleMeetingResponse {
  event: Meeting;
  message: string;
  status: string;
}

interface MeetingState {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  fetchMeetings: () => Promise<void>;
  addMeeting: (meetingData: Partial<Meeting>) => Promise<SingleMeetingResponse>;
  updateMeeting: (id: number, meetingData: Partial<Meeting>) => Promise<SingleMeetingResponse>;
  deleteMeeting: (id: number) => Promise<void>;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetings: [],
  isLoading: false,
  error: null,
  
  fetchMeetings: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get<MeetingResponse>(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/events"
      );
      set({ meetings: response.data.events || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      console.error("Error fetching meetings:", error);
    }
  },

  addMeeting: async (meetingData: Partial<Meeting>) => {
    set({ isLoading: true });
    try {
      const response = await axios.post<SingleMeetingResponse>(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/event-create",
        meetingData
      );
      set((state) => ({
        meetings: [...state.meetings, response.data.event],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      console.error("Error adding meeting:", error);
      throw error;
    }
  },

  updateMeeting: async (id: number, meetingData: Partial<Meeting>) => {
    set({ isLoading: true });
    try {
      const response = await axios.put<SingleMeetingResponse>(
        `https://full-stack-app.com/laravel_auth_jwt_api/public/api/event-update/${id}`,
        meetingData
      );
      set((state) => ({
        meetings: state.meetings.map((meeting) =>
          meeting.id === id ? response.data.event : meeting
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      console.error("Error updating meeting:", error);
      throw error;
    }
  },

  deleteMeeting: async (id: number) => {
    set({ isLoading: true });
    try {
      await axios.delete(
        `https://full-stack-app.com/laravel_auth_jwt_api/public/api/event-delete/${id}`
      );
      set((state) => ({
        meetings: state.meetings.filter((meeting) => meeting.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      console.error("Error deleting meeting:", error);
      throw error;
    }
  },
}));