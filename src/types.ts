export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  bestTime: string;
  budgetLevel: 'Low' | 'Medium' | 'High';
  rating: number;
  tags: string[];
  mustSee: string[];
  suggestedItinerary: {
    day: number;
    title: string;
    details: string;
  }[];
}

export interface ItineraryActivity {
  id: string;
  time: string;
  activity: string;
  completed: boolean;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: ItineraryActivity[];
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Essentials' | 'Clothing' | 'Electronics' | 'Toiletries' | 'Other';
  checked: boolean;
  isCustom?: boolean;
}

export interface BudgetCategory {
  id: 'flights' | 'lodging' | 'food' | 'activities' | 'insurance' | 'shopping';
  label: string;
  amount: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}
