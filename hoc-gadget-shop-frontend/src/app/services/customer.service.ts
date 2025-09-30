import { Injectable } from '@angular/core';
import { Customer, CustomerRequest } from '../models/customer.model';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly apiUrl = "https://localhost:7270/api/CustomerDetails";
  private customersSubject = new BehaviorSubject<Customer[]>([]);

  constructor(private http: HttpClient) { }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.getAuthToken()
      })
    };
  }
  private getAuthToken(): string {
    // TODO:Replace with actual token
    return 'my-auth-token';
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('CustomerService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      tap(customers => this.customersSubject.next(customers)),
      catchError(this.handleError)
    )
  }

  createCustomer(customer:CustomerRequest):Observable<Customer>{
    return this.http.post<Customer>(this.apiUrl,customer,this.getHttpOptions()).pipe(
      tap(()=>this.refreshCustomers(),
      catchError(this.handleError)
    ))
  }
  deleteCustomer(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`,this.getHttpOptions()).pipe(
      tap(()=>this.refreshCustomers()),
      catchError(this.handleError)
    )
  }
  updateCustomer(customer:CustomerRequest):Observable<void>{
    return this.http.put<void>(this.apiUrl,customer,this.getHttpOptions()).pipe(
      tap(()=>this.refreshCustomers()),
      catchError(this.handleError)
    )
  }
  private refreshCustomers(): void {
    this.getAllCustomers().subscribe();
  }
}
