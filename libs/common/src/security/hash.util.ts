import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';


export const hash = async (text: string, saltRound: number = new ConfigService().get('SALT_ROUND')!) => {
    return bcrypt.hash(text, Number(saltRound));
};

export const compareHash = async (text: string, hash: string) => {
    return bcrypt.compare(text, hash);
};