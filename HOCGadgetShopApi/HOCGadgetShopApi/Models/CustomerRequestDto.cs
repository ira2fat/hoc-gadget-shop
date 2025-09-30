using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.Models
{
    public class CustomerRequestDto
    {
        #region Properties
        [Required]
        public int CustomerId { get; set; }
        [Required, MaxLength(50)]
        public string FirstName { get; set; }
        [Required, MaxLength(50)]
        public string LastName { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime RegistrationDate { get; set; }
        #endregion
    }
}
