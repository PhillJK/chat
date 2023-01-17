import { CreateUserDto, UserDto } from "@/dtos/user.dto";
import { OperationalError } from "@/errors/OperationalError";
import { isEmpty } from "@/utils/util";
import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";

class AuthService {
    public users = new PrismaClient().user;

    public async signup(userData: CreateUserDto) {
        if (isEmpty(userData)) throw new OperationalError("user data is empty", 400);

        const isUserExists = await this.users.findUnique({
            where: { email: userData.email },
        });

        if (isUserExists) throw new OperationalError(`User with email ${userData.email} already exists`, 409);

        const hashedPassword = await hash(userData.password, 10);
        const createUserData = await this.users.create({
            data: { ...userData, password: hashedPassword },
        });

        return createUserData;
    }

    public async login(userData: UserDto) {
        if (isEmpty(userData)) throw new OperationalError("user data is empty", 400);

        const user = await this.users.findUnique({
            where: { email: userData.email },
        });
        if (!user) throw new OperationalError(`User with ${userData.email} does not exist`, 409);

        const isPasswordMatch = await compare(userData.password, user.password);
        if (!isPasswordMatch) throw new OperationalError(`Password is incorrect`, 409);

        return user;
    }
}

export default AuthService;
