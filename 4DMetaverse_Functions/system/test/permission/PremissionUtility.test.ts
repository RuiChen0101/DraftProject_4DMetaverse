import 'mocha';
import { expect } from 'chai';
import IQueryJson from '../../src/utility/IQueryJson';
import ESalePlanStatus from '../../src/share/enum/ESalePlanStatus';
import { isWhereContain } from '../../src/permission/PermissionUtility';

describe('isWhereContain', () => {
    it('should check query has the desire condition', () => {
        const query: IQueryJson = {
            query: 'sale_plan',
            where: [{
                left: 'sale_plan.status',
                op: '=',
                right: ESalePlanStatus.Show
            }]
        }

        expect(isWhereContain(query, 'sale_plan.status', '=', ESalePlanStatus.Show)).to.be.true;
        expect(isWhereContain(query, 'sale_plan.status', '=', ESalePlanStatus.Hidden)).to.be.false;
        expect(isWhereContain(query, 'sale_plan.status', '>=', ESalePlanStatus.Show)).to.be.false;
    });

    it('should check query has the desire condition', () => {
        const query: IQueryJson = {
            query: 'sale_plan',
            where: [{
                left: 'sale_plan.status',
                op: 'IN',
                right: [ESalePlanStatus.Show, ESalePlanStatus.Ready]
            }]
        }

        expect(isWhereContain(query, 'sale_plan.status', 'IN', [ESalePlanStatus.Show, ESalePlanStatus.Ready])).to.be.true;
        expect(isWhereContain(query, 'sale_plan.status', 'IN', [ESalePlanStatus.Ready, ESalePlanStatus.Show])).to.be.true;
        expect(isWhereContain(query, 'sale_plan.status', 'IN', [ESalePlanStatus.Hidden, ESalePlanStatus.Show])).to.be.false;
    });
});