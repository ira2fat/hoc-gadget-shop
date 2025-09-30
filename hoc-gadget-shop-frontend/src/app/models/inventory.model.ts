export interface InventoryItem {
  productId: number;
  productName: string;
  availableStock: number;
  reorderPoint: number;
}

export interface InventoryRequest {
  productID: string;
  productName: string;
  availableStock: number;
  reorderPoint: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}