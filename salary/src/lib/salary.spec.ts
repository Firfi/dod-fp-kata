import fc from 'fast-check';
import {
  calculateNetPay,
  defaultTaxStrategyDictionary,
  EmployeeId,
  salary,
} from './salary';

const getStrategy = defaultTaxStrategyDictionary;

describe('salary', () => {
  it('employee 1 is lucky', () => {
    const id = '1' as EmployeeId;
    expect(
      calculateNetPay({
        id,
        permanence: 'contract',
        hourlyRate: 10,
        hoursWorked: 10,
      })(getStrategy)
    ).toEqual(100);
  });
  it('the rest are not as much', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({
            min: 0,
            max: 500,
          }),
          fc.integer({
            min: 0,
            max: 500,
          }),
          fc
            .string({
              minLength: 1,
              maxLength: 100,
            })
            .filter((id) => id !== '1')
        ),
        ([rate, worked, id_]) => {
          const result = calculateNetPay({
            id: id_ as EmployeeId,
            permanence: 'contract',
            hourlyRate: rate,
            hoursWorked: worked,
          })(getStrategy);
          return (
            result < rate * worked || (result === 0 && rate * worked === result)
          );
        }
      )
    );
  });
});
