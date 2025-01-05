export interface iUserLogin {
    email: string;
    password: string;
}

export interface iUserRegister extends iUserLogin {
    name: string;
    username: string;
}
