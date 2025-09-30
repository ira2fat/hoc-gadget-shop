import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerDialogBoxComponent } from '../customer-dialog-box/customer-dialog-box.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit, OnDestroy {

  private modalService= inject(NgbModal);
  private customerService = inject(CustomerService);
  private destroy$ = new Subject<void>();

  http = inject(HttpClient);
  customersList: Customer[] = [];

  ngOnInit() {

    this.getCustomers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


openCustomerDialog(customer?:Customer) {
const modalRef = this.modalService.open(CustomerDialogBoxComponent);
  if (customer) {   
    modalRef.componentInstance.customer = customer;
  }
  modalRef.result.then((result) => {
  if (result.event === 'added') {
    this.getCustomers();
  }})
}

OpenConfirmDialog(customerId:number) {
  const modalRef = this.modalService.open(DialogBoxComponent);
  modalRef.result.then((result) => {
    if (result.event === 'confirmed') {
      this.DeleteCustomer(customerId);    }
});
}

private getCustomers() {
  this.customerService.getAllCustomers().pipe(takeUntil(this.destroy$)).subscribe({
    next:(customer:Customer[])=> {
      this.customersList = customer;
    },
    error: (error) => {
      console.error('Error loading customers:', error);
    }
  })
}

  DeleteCustomer(customerId: number) {
    this.customerService.deleteCustomer(customerId).pipe(takeUntil(this.destroy$)).subscribe({
      error: (error) => { console.error('There was an error!', error); },
      complete: () => this.getCustomers()
    });
}
}
