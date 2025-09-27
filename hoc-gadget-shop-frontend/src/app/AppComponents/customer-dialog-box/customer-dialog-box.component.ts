import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-dialog-box',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './customer-dialog-box.component.html',
  styleUrl: './customer-dialog-box.component.css'
})
export class CustomerDialogBoxComponent {

  modal = inject(NgbActiveModal);
  http = inject(HttpClient);

  customerDetails = {
    firstName: "",
    lastName: "",
    email: "",
    registrationDate: "",
    customerId: "",
    phoneNumber: ""
  } 

  addCustomer() {
    console.log('Adding customer:', this.customerDetails);


    let apiUrl = "https://localhost:7270/api/CustomerDetails";
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      })
    };

    this.http.post(apiUrl, this.customerDetails, httpOptions).subscribe({
      next: (data) => {
        console.log('POST request successful', data);   
        this.modal.close('added');
      },
      error: (error) => {
        console.error('There was an error!', error);},
      complete: () => {
        alert('Request completed'+JSON.stringify(this.customerDetails));
        this.modal.close('added');
      }
    });
  }
}
