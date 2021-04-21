export interface UserModel {
    
    id?: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    salt?: string;

}