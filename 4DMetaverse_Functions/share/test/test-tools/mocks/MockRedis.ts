
class MockRedis {
    private data: { [key: string]: string } = {};
    private expireData: { [key: string]: number } = {};

    public flushdb() {
        this.data = {};
        this.expireData = {};
    }

    public keys(key: string = '*'): Promise<string[]> {
        return new Promise((resolve, reject) => {
            resolve(Object.keys(this.data));
        });
    }

    public get(key: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            if (this.data[key] === undefined) {
                resolve(null);
            }
            resolve(this.data[key]);
        });
    }

    public set(key: string, val: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.data[key] = val;
            resolve(true);
        });
    }

    public exist(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(this.data[key] !== undefined);
        });
    }

    public expire(key: string, time: number): Promise<number> {
        return new Promise((resolve, reject) => {
            this.expireData[key] = time;
            resolve(1);
        });
    }

    public ttl(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            resolve(this.expireData[key]);
        });
    }

    public del(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            delete this.data[key];
            resolve(1);
        });
    }

    public increase(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.data[key] === undefined) this.data[key] = '0';
            this.data[key] = `${parseInt(this.data[key]) + 1}`;
            resolve();
        });
    }
}

export default MockRedis;