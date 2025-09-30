using OnlineShopApi.Models;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using OnlineShopApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace OnlineShopApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class CustomerDetailsController : ControllerBase
    {
  
        private readonly ILogger<CustomerDetailsController> _logger;
        private readonly OnlineShopContext _context;
        private readonly IMemoryCache _cache;


        public CustomerDetailsController(IConfiguration configuration, ILogger<CustomerDetailsController> logger, OnlineShopContext context, IMemoryCache cache)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
        }

        [HttpPost]
        public async Task<IActionResult> SaveCustomerData([FromBody] CustomerRequestDto requestDto)
        {
            
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var customerDetail= new CustomerDetails
                {
                    CustomerId = requestDto.CustomerId,
                    FirstName = requestDto.FirstName,
                    LastName = requestDto.LastName,
                    Email = requestDto.Email,
                    PhoneNumber = requestDto.PhoneNumber,
                    RegistrationDate = requestDto.RegistrationDate
                };
                await _context.CustomerDetails.AddAsync(customerDetail);
                await _context.SaveChangesAsync();

                _cache.Remove("CustomerData");

                return CreatedAtAction(nameof(GetCustomersData), new { id = customerDetail.CustomerId }, customerDetail);


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving customer data");

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomersData()
        {
            
            try
            {
                const string cacheKey = "CustomerData";

                if (!_cache.TryGetValue(cacheKey, out List<CustomerDetails> cachedData))
                {
                    cachedData = await _context.CustomerDetails.ToListAsync();
                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(5));
                    _cache.Set(cacheKey, cachedData, cacheEntryOptions);
                }
                return Ok(cachedData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Getting customer data");

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred.");
            }

        }

        [HttpPut]
        public async Task<IActionResult> UpdateCustomerData([FromBody] CustomerRequestDto requestDto)
        {
           

            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var existingCustomer = await _context.CustomerDetails.FindAsync(requestDto.CustomerId);
                if (existingCustomer == null)
                {
                    return NotFound($"Customer with ID {requestDto.CustomerId} not found.");
                }
                existingCustomer.FirstName = requestDto.FirstName;
                existingCustomer.LastName = requestDto.LastName;
                existingCustomer.Email = requestDto.Email;
                existingCustomer.PhoneNumber = requestDto.PhoneNumber;
                existingCustomer.RegistrationDate = requestDto.RegistrationDate;


                _context.CustomerDetails.Update(existingCustomer);
                await _context.SaveChangesAsync();

                _cache.Remove("CustomerData");

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating Customer Details");

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred.");
            }

        }

        [HttpDelete("{customerId}")]
        public async Task<IActionResult> DeleteCustomerData(int customerId)
        {
            try
            {
                var customerDetail = await _context.CustomerDetails.FindAsync(customerId);
                if (customerDetail == null)
                {
                    return NotFound();
                }
                _context.CustomerDetails.Remove(customerDetail);
                await _context.SaveChangesAsync();

                _cache.Remove("CustomerData");

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Deleting Customer Details");

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred.");
            }
        }
    }
}
