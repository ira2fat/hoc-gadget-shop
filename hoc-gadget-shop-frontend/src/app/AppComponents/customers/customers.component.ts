import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerDialogBoxComponent } from '../customer-dialog-box/customer-dialog-box.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

  private modalService= inject(NgbModal);
  http = inject(HttpClient);
  customersList:any;

  ngOnInit() {

    this.GetCustomers();
  }
openCustomerDialog(customer?:any) {
const modalRef = this.modalService.open(CustomerDialogBoxComponent);
  if (customer) {
    
    modalRef.componentInstance.customer = customer;
    modalRef.result.then((result) => {
      if (result.event === 'added') {
        this.GetCustomers();
      }
    });
  }
  modalRef.result.then((result) => {
  if (result.event === 'added') {
    this.GetCustomers();
  }})
}

GetCustomers() {
  let apiUrl = "https://localhost:7270/api/CustomerDetails";
  this.http.get(apiUrl).subscribe({
    next: (data) => {
      this.customersList = data;
    }
  });
}
OpenConfirmDialog(customerId:number) {
  const modalRef = this.modalService.open(DialogBoxComponent);
  modalRef.result.then((result) => {
    if (result.event === 'confirmed') {
      this.DeleteCustomer(customerId);    }
});
}
  DeleteCustomer(customerId: number) {
    let apiUrl = `https://localhost:7270/api/CustomerDetails/${customerId}`;
    this.http.delete(apiUrl).subscribe({
      next: (data) => {

      },
      error: (error) => {
        console.error('There was an error!', error);
      },
      complete: () => {
        this.GetCustomers();
      }
  })
}
}
