export interface BacktracingResult {
  for?: string;
  created_at?: string;
  not_before?: string;
  not_after?: string;
  data?: BacktracingItem[];
}

export interface BacktracingItem {
  date?: string;
  email?: string;
  area_name?: string;
}
