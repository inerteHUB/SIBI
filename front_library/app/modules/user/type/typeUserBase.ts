export interface UserBase {
    faculty_id: number;
    dependency_id?: number | null; 
    username: string;
    name: string;
    last_name: string | null;
    paternal_surname: string;
    maternal_surname: string;
    dni: string;
    email: string;
    phone: string;
    gender: string;
    birthdate: string | null;
    address: string | null;
    role_ids: number[];
    specialization_ids: number[];
}