let time: number = 0;

const setTime = (newTime: number): void => {
    time = newTime;
}

const clearTime = (): void => {
    time = 0;
}

class FakeTimer {
    // get UNIX time of now in sec
    public now(): number {
        return time;
    }

    public nowMilliseconds(): number {
        return time;
    }
}


export { setTime, clearTime };
export default FakeTimer;