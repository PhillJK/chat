import { IsNumber } from "class-validator";

export class AddChatToUserDto {
    @IsNumber()
    public userId!: number;
}
