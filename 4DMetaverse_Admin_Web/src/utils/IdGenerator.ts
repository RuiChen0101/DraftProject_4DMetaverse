import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';


class IdGenerator {
    public uuidv4(): string {
        return uuidv4();
    }

    public nanoid8(): string {
        const nano8 = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);
        return nano8();
    }

    public nanoid16(): string {
        const nano16 = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16);
        return nano16();
    }

    public nanoidNumber6(): string {
        const nano6 = customAlphabet('0123456789', 6);
        return nano6();
    }
}

export default IdGenerator;