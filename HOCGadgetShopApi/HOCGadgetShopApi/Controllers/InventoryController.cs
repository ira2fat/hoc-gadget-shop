
using HOCGadgetShopApi.Data;
using HOCGadgetShopApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Data;


namespace HOCGadgetShopApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : Controller
    {

        readonly ILogger<InventoryController> _logger;
        private readonly GadgetShopContext _context;
        private readonly IMemoryCache _cache;


        public InventoryController( ILogger<InventoryController> logger, GadgetShopContext context, IMemoryCache cache)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
        }


        [HttpPost]
        public async Task<IActionResult> SaveInventoryData([FromBody] InventoryRequestDto requestDto)
        {
            

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var inventory = new Inventory
                {
                    ProductId = requestDto.ProductId,
                    ProductName = requestDto.ProductName,
                    AvaliableStock = requestDto.AvaliableStock,
                    ReorderPoint = requestDto.ReorderPoint
                };
                await _context.Inventories.AddAsync(inventory);
                await _context.SaveChangesAsync();

                _cache.Remove("InventoryData");

                return CreatedAtAction(nameof(GetInventoryData), new { id = requestDto.ProductId }, requestDto);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving customer data");

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred.");
            }

      
        }

        [HttpGet]
        public async Task <IActionResult> GetInventoryData()
        {


            try
            {
                const string cacheKey = "InventoryData";
                if (!_cache.TryGetValue(cacheKey, out List<Inventory> cachedInventory))
                {
                    // Data not in cache, fetch from database
                    cachedInventory = await _context.Inventories.ToListAsync();

                    // Set cache options
                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5), // Cache expires in 5 minutes
                        SlidingExpiration = TimeSpan.FromMinutes(2) // Reset expiration if accessed within 2 minutes
                    };

                    // Store data in cache
                    _cache.Set(cacheKey, cachedInventory, cacheOptions);
                }

                return Ok(cachedInventory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching inventory data");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred.");
            }

            
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteInventoryData(int productId)
        {
            try
            {
                var inventory = await _context.Inventories.FindAsync(productId);
                if (inventory == null)
                {
                    return NotFound();
                }

                _context.Inventories.Remove(inventory);
                await _context.SaveChangesAsync();

                _cache.Remove("InventoryData");

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting inventory data");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateInventoryData([FromBody] InventoryRequestDto requestDto)
        {
            
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var inventory = await _context.Inventories.FindAsync(requestDto.ProductId);
                if (inventory == null)
                {
                    return NotFound();
                }

                inventory.ProductName = requestDto.ProductName;
                inventory.AvaliableStock = requestDto.AvaliableStock;
                inventory.ReorderPoint = requestDto.ReorderPoint;

                _context.Inventories.Update(inventory);
                await _context.SaveChangesAsync();

                _cache.Remove("InventoryData");

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating inventory data");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred.");
            }
        }
    }
}
