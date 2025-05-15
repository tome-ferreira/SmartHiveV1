export interface User{
    created_at: string;
    email: string;
    last_login: string;
    name_email: string | null;
    name_google: string | null;
    provider: string;
    role_name: string;
}