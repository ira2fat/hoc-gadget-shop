import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {

  private http = inject(HttpClient);
  private ngModalService = inject(NgbModal);
  disableProductIDInput: boolean = false;
  inventoryList: any;
  productIDToDelete: number = 0;
  inventoryData = {
    productID: "",
    productName: "",
    avaliableStock: 0,
    reorderPoint: 0,
  }


  ngOnInit() {
    this.getInventoryList();
  }

  onSubmit() {
    
    const apiUrl = "https://localhost:7270/api/Inventory";
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      })
    };

    if (this.disableProductIDInput) {
      this.http.put(apiUrl, this.inventoryData, httpOptions).subscribe({
        next: (data) => {
          console.log('PUT request successful', data);
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
        complete: () => {
          this.getInventoryList();
        }
      });
      this.disableProductIDInput = false;
    }
    else {
      this.http.post(apiUrl, this.inventoryData, httpOptions).subscribe({
        next: (data) => {
          console.log('POST request successful', data);
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
        complete: () => {
          this.getInventoryList();
        }
      });
    }




  }

  getInventoryList() {
    const apiUrl = "https://localhost:7270/api/Inventory";

    this.http.get(apiUrl).subscribe(data => {
      this.inventoryList = data;
    });
    this.inventoryData = {
      productID: "",
      productName: "",
      avaliableStock: 0,
      reorderPoint: 0,
    }
    this.disableProductIDInput = false;
  }
  OpenConfirmDialog(productID: number) {
    this.productIDToDelete = productID;


    this.ngModalService.open(DialogBoxComponent).result.then((result) => {

      if (result.event === "confirmed") {
        this.DeleteItem();
      }
    });
  }
  DeleteItem() {
    const apiUrl = `https://localhost:7270/api/Inventory/${this.productIDToDelete}`;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      })
    };
    this.http.delete(apiUrl).subscribe(data => {
      this.getInventoryList();
    })
  }
  populateFormForEdit(item: any) {
    this.inventoryData.productID = item.productId;
    this.inventoryData.productName = item.productName;
    this.inventoryData.avaliableStock = item.avaliableStock;
    this.inventoryData.reorderPoint = item.reorderPoint;

    this.disableProductIDInput = true;
  }
}
