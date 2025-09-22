import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  private http = inject(HttpClient);

  inventoryData = {
    productID:"",
    productName: "",
    avaliableStock:0,
    reorderPoint:0,
  }

  inventoryList:any;

  ngOnInit() {
    const apiUrl="https://localhost:7270/api/Inventory";

    this.http.get(apiUrl).subscribe(data=>{

      this.inventoryList=data;
      console.log(this.inventoryList);
    });


  }

  onSubmit() {

    const apiUrl="https://localhost:7270/api/Inventory";
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      })
    };

    this.http.post(apiUrl, this.inventoryData, httpOptions).subscribe({
      next: (data) => {
        console.log('POST request successful', data);
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
      complete: () => {
        alert('Form submitted!'+ JSON.stringify(this.inventoryData));
      }
    });
    
  }
}
