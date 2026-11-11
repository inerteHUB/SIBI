export interface UserPublic {
    id: number;
    name: string;
    last_name?: string;
    paternal_surname: string;
    maternal_surname?: string;
    dni: string;
}

export interface ExaminerPublic {
    id: number;
    role: string;
    examiner?: UserPublic;
}

export interface ResolutionPublic {
    id: number;
    resolution_number: string;
    resolution_date: string;
    resolution_type: string;
    office: string;
    file_path?: string;
}

export interface FilePublic {
    id: number;
    original_name: string;
    file_path: string;
    category: string;
    process: string;
    is_active: string;
    created_at: string;
}

export interface SearchResultItem {
    id: number;
    title: string;
    state: string;
    process: string;
    author_one: UserPublic;
    author_two?: UserPublic;
    created_at: string;
}

export interface SearchResponse {
    total: number;
    results: SearchResultItem[];
}

export interface ThesisPreDetailPublic {
    id: number;
    title: string;
    research_line?: string;
    state: string;
    process: string;
    created_at: string;
    author_one: UserPublic;
    author_two?: UserPublic;
    advisor: UserPublic;
    co_advisor?: UserPublic;
    examiners: ExaminerPublic[];
    resolutions: ResolutionPublic[];
    files: FilePublic[];
}
