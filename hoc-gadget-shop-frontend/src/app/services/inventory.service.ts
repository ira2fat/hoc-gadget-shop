import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { InventoryItem, InventoryRequest } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly apiUrl = `https://localhost:7270/api/Inventory`;
  private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);


  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.getAuthToken()
      })
    };
  }

  private getAuthToken(): string {
    // TODO: Replace with actual token
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
    
    console.error('InventoryService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllInventory():Observable<InventoryItem[]> {

    return this.http.get<InventoryItem[]>(this.apiUrl).pipe(
      tap(inventory => this.inventorySubject.next(inventory)),
      catchError(this.handleError)
    );
  }

  createInventory(inventory: InventoryRequest): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, inventory, this.getHttpOptions()).pipe(
      tap(()=>this.refreshInventory()),
      catchError(this.handleError)
    )
  }
  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      tap(()=>this.refreshInventory()),
      catchError(this.handleError)
    )
  }
  updateInventory(inventory: InventoryRequest):Observable<InventoryItem> {
    return this.http.put<InventoryItem>(this.apiUrl, inventory, this.getHttpOptions()).pipe(
      tap(()=>this.refreshInventory()),
      catchError(this.handleError)
    )
  }

  private refreshInventory(){
    this.getAllInventory().subscribe();
  }

  //TODO: Add getInventoryById 
}
