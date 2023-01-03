class InjectionHandler {
    private _instancesPool: { [key: string]: any };
    private _instancesFactory: { [key: string]: () => any };

    constructor(instancesPool: { [key: string]: any }, instancesFactory: { [key: string]: () => any }) {
        this._instancesPool = instancesPool;
        this._instancesFactory = instancesFactory;
    }

    public get<T>(name: string): T {
        if (name in this._instancesPool) {
            return this._instancesPool[name];
        }
        if (!(name in this._instancesFactory)) {
            throw new Error('Instance not set');
        }
        const instance: T = this._instancesFactory[name]();
        this._instancesPool[name] = instance;
        return instance;
    }

    public set<T>(name: string, instance: any): T {
        this._instancesPool[name] = instance;
        return instance;
    }

    public setFactory(name: string, factory: () => any): void {
        this._instancesFactory[name] = factory;
    }
}


export default InjectionHandler;