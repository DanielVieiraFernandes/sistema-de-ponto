import { FetchPointsResponse } from '@/repositories/punch-clocks-repository';

export class HistoryPunchClockMapper {
  private _date: string;
  private _checkIn: Date;
  private _checkOut: Date;
  private _hoursWorked: number;

  constructor(date: string, checkIn: Date, checkOut: Date, hoursWorked: number) {
    this._date = date;
    this._checkIn = checkIn;
    this._checkOut = checkOut;
    this._hoursWorked = hoursWorked;
  }

  static toHttp(point: FetchPointsResponse, hoursWorked: number) {
    return new HistoryPunchClockMapper(
      point.date,
      point.check_in,
      point.check_out,
      hoursWorked,
    );
  }

  get date() {
    return this._date;
  }

  get checkIn() {
    return this._checkIn;
  }

  get checkOut() {
    return this._checkOut;
  }

  get hoursWorked() {
    return this._hoursWorked;
  }
}
