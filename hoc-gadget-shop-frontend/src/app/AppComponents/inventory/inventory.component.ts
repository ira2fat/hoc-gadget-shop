import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { InventoryItem, InventoryRequest } from '../../models/inventory.model';
import { InventoryService } from '../../services/inventory.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit, OnDestroy {

  private ngModalService = inject(NgbModal);
  private inventoryService = inject(InventoryService);
  private fb = inject(FormBuilder);

  private destroy$ = new Subject<void>();

  inventoryForm: FormGroup;
  inventoryList: InventoryItem[] = [];
  productIDToDelete: number = 0;
  isEditMode: boolean = false;

  constructor() {
    this.inventoryForm = this.fb.group({
      productID: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      availableStock: [0, [Validators.required, Validators.min(0)]],
      reorderPoint: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.getInventoryList();
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }




  onSubmit() {
    if (this.inventoryForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData: InventoryRequest = this.inventoryForm.value;

    if (this.isEditMode) {
      this.inventoryService.updateInventory(formData).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Inventory item updated successfully');
          this.resetForm();
          this.getInventoryList();
        },
        error: (error) => {
          console.error('Error updating inventory item:', error);
        }
      });
    } else {
      this.inventoryService.createInventory(formData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (createdItem) => {
          console.log('Inventory item created successfully:', createdItem);
          this.resetForm();
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
  }

  resetForm(): void {
    this.inventoryForm.reset({
      productID: '',
      productName: '',
      availableStock: 0,
      reorderPoint: 0
    });
    this.isEditMode = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.inventoryForm.controls).forEach(key => {
      const control = this.inventoryForm.get(key);
      control?.markAsTouched();
    });
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
    this.inventoryForm.patchValue({
      productID: item.productId.toString(),
      productName: item.productName,
      availableStock: item.availableStock,
      reorderPoint: item.reorderPoint
    });
    
    this.isEditMode = true;
    // Disable the productID field when editing
    this.inventoryForm.get('productID')?.disable();
  }

  // Helper method to get field error messages
  getFieldError(fieldName: string): string {
    const field = this.inventoryForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['min']) {
        return `${fieldName} must be greater than or equal to ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  // Helper method to check if field has error
  hasFieldError(fieldName: string): boolean {
    const field = this.inventoryForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}
