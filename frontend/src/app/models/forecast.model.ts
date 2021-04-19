import {CronosArea} from './cronos-area.model';

export interface Forecast {
  created_at: string;
  bookings: ForecastItem[];
  area: CronosArea;
}

export interface ForecastItem {
  date: string;
  booked_seats: number;
  booked_by_myself?: boolean;
}
