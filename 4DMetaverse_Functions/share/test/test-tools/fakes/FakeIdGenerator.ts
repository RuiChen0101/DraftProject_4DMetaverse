
class FakeIdGenerator {
    public uuidv4(): string {
        return '00000000-0000-0000-0000-000000000000';
    }

    public nanoid24(): string {
        return '1234567890abcdefghijklmn';
    }

    public nanoidReadable16(): string {
        return '1234-5678-90ab-cdef';
    }

    public nanoid8(): string {
        return '12345678';
    }

    public nanoidNumber6(): string {
        return '123456';
    }
}

export default FakeIdGenerator;