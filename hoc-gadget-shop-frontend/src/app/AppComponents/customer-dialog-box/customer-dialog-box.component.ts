import { CommonModule } from '@angular/common';

import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-customer-dialog-box',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './customer-dialog-box.component.html',
  styleUrl: './customer-dialog-box.component.css'
})
export class CustomerDialogBoxComponent implements OnInit, OnDestroy {

  @Input() customer?: Customer;

  modal = inject(NgbActiveModal);
  customerService = inject(CustomerService);
  private destroy$ = new Subject<void>();

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
      this.customerDetails.firstName = this.customer.firstName;
      this.customerDetails.lastName = this.customer.lastName;
      this.customerDetails.email = this.customer.email;
      this.customerDetails.registrationDate = this.customer.registrationDate;
      this.customerDetails.customerId = String(this.customer.customerId);
      this.customerDetails.phoneNumber = this.customer.phoneNumber;
    
    }}

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onSubmit() {
    if (this.customer) {
      this.editCustomer();
    } else {

      this.addCustomer();
    }
  }

  addCustomer() {
    this.customerService.createCustomer(this.customerDetails).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (data) => {
          console.log('POST request successful', data);   
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
        complete: () => { this.modal.close({event:"added"}); }
      }
    );
  }

  editCustomer() {

    this.customerService.updateCustomer(this.customerDetails).pipe(takeUntil(this.destroy$)).subscribe({
      error: (error) => { console.error('There was an error!', error); },
      complete: () =>{
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
