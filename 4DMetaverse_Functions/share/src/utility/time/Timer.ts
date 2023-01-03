class Timer {
    // get UNIX time of now in sec
    public now(): number {
        return Math.floor(new Date().getTime() / 1000)
    }

    public nowMilliseconds(): number {
        return new Date().getTime();
    }
}

export default Timer;