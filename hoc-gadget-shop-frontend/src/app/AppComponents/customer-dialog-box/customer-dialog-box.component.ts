import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
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

  @Input() customer?:any;

  modal = inject(NgbActiveModal);
  http = inject(HttpClient);
  disableProductIDInput: boolean = false;

  customerDetails = {
    firstName: "",
    lastName: "",
    email: "",
    registrationDate: "",
    customerId: "",
    phoneNumber: ""
  } 

  ngOnInit() {
    if (this.customer) {
      this.disableProductIDInput = true;
      this.customerDetails.firstName = this.customer.FirstName;
      this.customerDetails.lastName = this.customer.LastName;
      this.customerDetails.email = this.customer.Email;
      this.customerDetails.registrationDate = this.customer.RegistrationDate;
      this.customerDetails.customerId = this.customer.CustomerId;
      this.customerDetails.phoneNumber = this.customer.PhoneNumber;
    
    }}

  onSubmit() {
    if (this.customer) {
      this.editCustomer();
    } else {

      this.addCustomer();
    }
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
      },
      error: (error) => {
        console.error('There was an error!', error);},
      complete: () => {
        this.modal.close({event:"added"});
      }
    });
  }

  editCustomer() {
    console.log('Editing customer:', this.customerDetails);
    let apiUrl = "https://localhost:7270/api/CustomerDetails";
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      })
    };
  this.http.put(apiUrl, this.customerDetails, httpOptions).subscribe({
    next: (data) => {
      console.log('PUT request successful', data);   
    },
    error: (error) => {
      console.error('There was an error!', error);},
    complete: () => {
      this.modal.close({event:"added"});
      this.disableProductIDInput = false;
      this.customerDetails = {
        firstName: "",
        lastName: "",
        email: "",
        registrationDate: "",
        customerId: "",
        phoneNumber: ""
      };
    }
  })
  }
    
}
