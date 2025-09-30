import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { InventoryItem, InventoryRequest } from '../../models/inventory.model';
import { InventoryService } from '../../services/inventory.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit, OnDestroy {

  private ngModalService = inject(NgbModal);
  private inventoryService = inject(InventoryService);

  private destroy$ = new Subject<void>();

  disableProductIDInput: boolean = false;
  inventoryList: InventoryItem[] = [];
  productIDToDelete: number = 0;
  inventoryData: InventoryRequest = {
    productID: "",
    productName: "",
    availableStock: 0,
    reorderPoint: 0,
  }

  ngOnInit(): void {
    this.getInventoryList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }




  onSubmit() {
    if (this.disableProductIDInput) {
      this.inventoryService.updateInventory(this.inventoryData).pipe(takeUntil(this.destroy$)).subscribe({
        next: () =>  this.getInventoryList()
      })
      this.disableProductIDInput = false;
    }
    else {
      this.inventoryService.createInventory(this.inventoryData).pipe(takeUntil(this.destroy$)).subscribe({
          next: (createdItem) => {
            console.log('Inventory item created successfully:', createdItem);
            this.getInventoryList();
          },
          error: (error) => {
            console.error('Error creating inventory item:', error);
          }
        });     
    }
  }

  private getInventoryList() {

    this.inventoryService.getAllInventory().pipe(takeUntil(this.destroy$)).subscribe({
      next: (inventory: InventoryItem[]) => {
        this.inventoryList = inventory;
        console.log('Inventory list loaded:', inventory);
      },
      error: (error: Error) => {
        console.error('Error loading inventory:', error);
      }
    });
    this.inventoryData = {
      productID: "",
      productName: "",
      availableStock: 0,
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

  private DeleteItem() {

    this.inventoryService.deleteInventory(this.productIDToDelete).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        console.log('Inventory item deleted successfully');
        this.getInventoryList();
      },
      error: (error: Error) => {
        console.error('Error loading inventory:', error);}
    });
  }
  populateFormForEdit(item: InventoryItem) {
    this.inventoryData.productID = item.productId.toString();
    this.inventoryData.productName = item.productName;
    this.inventoryData.availableStock = item.availableStock;
    this.inventoryData.reorderPoint = item.reorderPoint;

    this.disableProductIDInput = true;
  }
}
