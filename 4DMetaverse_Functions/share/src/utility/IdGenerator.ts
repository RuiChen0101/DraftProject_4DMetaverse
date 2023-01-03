import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';

class IdGenerator {
    public uuidv4(): string {
        return uuidv4();
    }

    public nanoid24(): string {
        const nano24 = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 24);
        return nano24();
    }

    public nanoidReadable16(): string {
        const nano16 = customAlphabet('23456789abcdefghijklmnopqrstuvwxyz', 16);
        const id = nano16()
        return id.slice(0, 4) + "-" + id.slice(4, 8) + "-" + id.slice(8, 12) + "-" + id.slice(12);
    }

    public nanoid8(): string {
        const nano8 = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);
        return nano8();
    }

    public nanoidNumber6(): string {
        const nano6 = customAlphabet('0123456789', 6);
        return nano6();
    }
}

export default IdGenerator;