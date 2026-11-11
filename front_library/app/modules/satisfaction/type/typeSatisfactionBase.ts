export interface SatisfactionFeedback {
  id: number;
  user_id: number;
  loan_id?: number;
  faculty_id?: number;
  service_type?: string;
  is_anonymous: boolean;
  overall_rating: number;
  staff_attention_rating?: number;
  book_condition_rating?: number;
  facility_rating?: number;
  speed_rating?: number;
  comments?: string;
  book_suggestions?: string;
  created_at: string;
  user?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  loan?: {
    id: number;
    code: string;
    loan_type: string;
  };
}

export interface SatisfactionCreate {
  loan_id?: number;
  service_type?: string;
  is_anonymous: boolean;
  overall_rating: number;
  staff_attention_rating?: number;
  book_condition_rating?: number;
  facility_rating?: number;
  speed_rating?: number;
  comments?: string;
  book_suggestions?: string;
}

export interface FacultyCSATSummary {
  faculty_id: number;
  faculty_name: string;
  faculty_abbreviation?: string;
  total_surveys: number;
  average_rating: number;
  csat_percentage?: number;
}

export interface SatisfactionMetrics {
  total_surveys: number;
  average_overall_rating: number;
  csat_percentage: number;
  average_staff_attention?: number | null;
  average_book_condition?: number | null;
  average_facility?: number | null;
  average_speed?: number | null;
  distribution: {
    star_1: number;
    star_2: number;
    star_3: number;
    star_4: number;
    star_5: number;
  };
  by_faculty: FacultyCSATSummary[];
}

export interface PendingLoanSurvey {
  id: number;
  code: string;
  loan_type: string;
}

export interface SatisfactionListParams {
  faculty_id?: number;
  service_type?: string;
  min_rating?: number;
  skip?: number;
  limit?: number;
}
