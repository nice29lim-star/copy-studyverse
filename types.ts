
export type TabId = 'home' | 'diagnosis' | 'planner' | 'roadmap' | 'records' | 'literacy';

export interface User {
    nickname: string;
    aiCredits: number;
}

export interface HollandScores {
    [key:string]: number;
}

export interface SrlScores {
    [key: string]: number;
}

export interface HollandResult {
    scores: HollandScores;
    top1: string;
    top2: string;
    code: string;
}

export interface SrlResult {
    scores: SrlScores;
    strength: string;
    bottleneck: string;
}

export interface DiagnosisState {
    holland: HollandResult | null;
    srl: SrlResult | null;
    lastTest?: string;
}

export interface TodoItem {
    id: number;
    priority: '상' | '중' | '하';
    time: string;
    text: string;
    goal: string;
    done: boolean;
}

export interface PlannerState {
    date: string;
    goal: string;
    todos: TodoItem[];
    dday?: string;
    rating?: number;
}

export interface VisionResult {
    title: string;
    body: string;
    slogan: string;
}

export interface LiteracyRecord {
    date: string;
    level: string;
    score: number;
}

export interface Reflection {
    date: string;
    mode: '3min' | '10min';
    template: 'basic' | 'emotion' | 'study';
    oneLine: string;
    mood: number;
    win: string;
    lesson: string;
    tomorrow: string;
    hard: string;
    good: string;
    regret: string;
    gratitude: string[];
}

export interface RoadmapStep {
    month: string;
    content: string;
}

export interface RoadmapPeriod {
    headline: string;
    steps: RoadmapStep[];
}

export interface RoadmapResult {
    m3: RoadmapPeriod;
    m6: RoadmapPeriod;
    m12: RoadmapPeriod;
}

export interface AppState {
    user: User;
    diagnosis: DiagnosisState;
    planner: PlannerState;
    vision: VisionResult | null;
    roadmap: RoadmapResult | null;
    records: Reflection[];
    literacy: LiteracyRecord[]; 
}

export interface DiagnosisQuestion {
    id: string;
    domain: 'HOLLAND' | 'SRL';
    scale: string;
    text: string;
}

export interface HollandTypeInfo {
    name: string;
    traits: string[];
    strength: string;
    challenge: string;
    careers: string[];
    actions: string[];
    tip: string;
}

export interface SrlChallengeInfo {
    name: string;
    problem: string;
    goal: string;
    challenges: { day: number; title: string; mission: string; why: string; status: string; }[];
}
