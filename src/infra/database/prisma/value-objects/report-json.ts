interface Employee {
  name: string;
  hours_worked: number;
}

export interface ReportJsonResponse {
  total_hours: number;
  employees: Employee[];
}

export class ReportJson implements ReportJsonResponse {
  readonly total_hours: number;
  readonly employees: Employee[];

  constructor(totalHours: number, employess: Employee[]) {
    this.total_hours = totalHours;
    this.employees = employess;
  }

  static create(totalHours: number, employees: Employee[]) {
    return new ReportJson(totalHours, employees);
  }
}