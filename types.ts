export interface TranscriptSegment {
  speaker: string;
  text: string;
  timestamp: string;
}

export interface SentimentPoint {
  time: string;
  score: number; // 0 to 100
}

export interface CoachingData {
  strengths: string[];
  opportunities: string[];
}

export interface AnalysisResult {
  transcript: TranscriptSegment[];
  sentiment: SentimentPoint[];
  coaching: CoachingData;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}