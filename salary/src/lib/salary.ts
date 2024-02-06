import type * as B from 'effect/Brand';

export function salary(): string {
  return 'salary';
}

export type EmployeeId = string & B.Brand<'EmployeId'>;
export type FullName = string & B.Brand<'FullName'>;
export type Email = string & B.Brand<'Email'>;

type EmployeeCore = {
  id: EmployeeId;
  name: FullName;
  email: Email;
};

type EmployeeSalaryConcern = (
  | {
      permanence: 'permanent';
      annualSalary: number; // TODO NonNegativeInteger
    }
  | {
      permanence: 'contract';
      hourlyRate: number; // TODO NonNegativeInteger
      hoursWorked: number; // TODO NonNegativeInteger
    }
);

type Employee = EmployeeCore & EmployeeSalaryConcern;

const calculatePay = (
  employee: EmployeeSalaryConcern
): number /*TODO NonNegativeInteger*/ => {
  switch (employee.permanence) {
    case 'permanent':
      // annualSalary field becomes visible
      return employee.annualSalary / 12; // TODO leftover strategy
    case 'contract':
      // hourlyRate and hoursWorked fields become visible
      return employee.hourlyRate * employee.hoursWorked;
    // forgetting to handle wouldn't compile
  }
};

type TaxStrategy = {
  taxRate: number; // TODO Percentage
};

const noTax: TaxStrategy = {
  taxRate: 0,
};

const basicTax: TaxStrategy = {
  taxRate: 20,
};

const calculateTax =
  (pay: number) =>
  (strategy: TaxStrategy): number =>
    (pay * strategy.taxRate) / 100;

type TaxStrategyDictionary = (employeeId: EmployeeId) => TaxStrategy;

export const defaultTaxStrategyDictionary: TaxStrategyDictionary = (
  employeeId: EmployeeId
) => {
  // some dictionary here, logic etc
  if (employeeId === '1') {
    return noTax;
  }
  return basicTax;
};

export const calculateNetPay =
  (employee: EmployeeSalaryConcern & Pick<EmployeeCore, 'id'>) =>
  (taxStrategyDictionary: TaxStrategyDictionary): number => {
    const pay = calculatePay(employee);
    const tax = calculateTax(pay)(taxStrategyDictionary(employee.id));
    return pay - tax;
  };

const processPayment = (employee: Employee): void => {
  const _pay = calculatePay(employee);
  // TODO implement
};

const _processPayments = (employees: Employee[]): void => {
  employees.forEach(processPayment);
};
