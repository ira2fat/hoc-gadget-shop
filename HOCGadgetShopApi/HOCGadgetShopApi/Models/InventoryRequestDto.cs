using System.ComponentModel.DataAnnotations;

namespace HOCGadgetShopApi.Models
{
    public class InventoryRequestDto
    {
        #region Properties
        [Required]
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int AvailableStock { get; set; }
        public int ReorderPoint { get; set; }

        #endregion
    }
}
