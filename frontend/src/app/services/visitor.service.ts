import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {Visitor} from '../models/visitor.model';
import {Visit} from '../models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  constructor(private api: ApiService) { }

  /**
   * Adds a new booking for a visitor
   * @param date datestring in format yyyy-mm-dd
   * @param visitor full visitor object
   * @param additionalInfo more information attached to the booking
   * @param needsParkingSpace boolean
   */
  addBooking(date: string, visitor: Visitor, additionalInfo: string, needsParkingSpace: boolean): Observable<Visit> {
    return this.api.post('/visits', {
      date, visitor, additional_info: additionalInfo, needs_parking_space: needsParkingSpace
    });
  }

  /**
   * Delete a visitor from the database
   * @param id visitor id
   */
  deleteVisitor(id: string): Observable<any> {
    return this.api.delete(`/visitor/${id}`);
  }

  /**
   * Delete a single visit
   * @param id of the booking
   */
  deleteVisit(id: string): Observable<any> {
    return this.api.delete(`/visits/${id}`);
  }
  /**
   * Fetch all visitors added by current logged in user
   */
  getAllVisitors(): Observable<Visitor[]> {
    return this.api.get('/visitors');
  }

  /**
   * Fetch a single user
   */
  getSingleVisitor(visitorId: string): Observable<Visitor>{
    return this.api.get(`/visitors/${visitorId}`);
  }

  /**
   * Fetch all bookings for a given date added by current user
   */
  getBookingsForDate(date: string) {
    return null;
  }

  /**
   * Fetch all bookings added by current user
   */
  getAllBookings(): Observable<Visit[]> {
    return this.api.get('/visits');
  }
}
