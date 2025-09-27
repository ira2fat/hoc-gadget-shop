import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerDialogBoxComponent } from '../customer-dialog-box/customer-dialog-box.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

  private modalService= inject(NgbModal);
  http = inject(HttpClient);
  customersList:any;

  ngOnInit() {


  }
openCustomerDialog() {
this.modalService.open(CustomerDialogBoxComponent);
}

GetCustomers() {
  let apiUrl = "https://localhost:7270/api/CustomerDetails";
  this.http.get(apiUrl).subscribe({
    next: (data) => {
      console.log('GET request successful', data);
      this.customersList = data;
    }
  });
}


}
