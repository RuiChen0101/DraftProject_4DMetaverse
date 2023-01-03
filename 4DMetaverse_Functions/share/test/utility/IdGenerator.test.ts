import 'mocha';
import { expect } from 'chai';

import IdGenerator from '../../src/utility/IdGenerator';

describe("IdGenerator", () => {
    it("should generator readable random id in 4/4 pair", () => {
        const generator = new IdGenerator();
        const id = generator.nanoidReadable16();
        const allowChar = "23456789abcdefghijklmnopqrstuvwxyz"
        const check = RegExp(`[${allowChar}]{4}-[${allowChar}]{4}-[${allowChar}]{4}-[${allowChar}]{4}`)
        expect(check.test(id)).to.be.true;
    })
});