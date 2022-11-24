import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    public email!: string;

    @IsString()
    public password!: string;

    @IsString()
    public name!: string;
}

export class UserDto {
    @IsEmail()
    public email!: string;

    @IsString()
    public password!: string;
}
