import { IsEmail, IsString, IsNumber } from "class-validator";

export class AddChatDto {
    @IsNumber()
    public userId!: number;

    @IsNumber()
    public otherUserId!: number;
}
