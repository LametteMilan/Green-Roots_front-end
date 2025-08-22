export default interface IUser {
    id_user: number;
    password?: string;
    email: string;
    first_name: string;
    last_name: string;
    user_role: string;
    street: string;
    zip_code: string;
    country: string;
    city: string;
}