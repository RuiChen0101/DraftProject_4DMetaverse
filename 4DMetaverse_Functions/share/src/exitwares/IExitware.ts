import express from 'express';

export default interface IExitware {
    exitware(req: express.Request, res: express.Response): Promise<void>;
}