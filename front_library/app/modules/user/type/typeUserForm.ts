export interface FormItem {
    id: number;
    name: string;
}

export interface FormDependencyItem {
    id: number;
    name: string;
    faculty_id: number;
}

export interface UserForm {
    faculties: FormItem[];
    roles: FormItem[];
    specializations: FormItem[];
    dependencies: FormDependencyItem[];
    jurado_role_names: string[];
    autor_role_names: string[];
}