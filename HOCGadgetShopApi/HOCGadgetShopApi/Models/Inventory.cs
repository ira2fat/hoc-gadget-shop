using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HOCGadgetShopApi.Models
{
    [Table("Inventory")]
    public class Inventory
    {
        [Key]
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int AvaliableStock { get; set; }
        public int ReorderPoint { get; set; }
    }
}
