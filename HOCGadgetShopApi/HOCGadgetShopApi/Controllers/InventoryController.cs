
using HOCGadgetShopApi.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;


namespace HOCGadgetShopApi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : Controller
    {
        [HttpPost]
        public IActionResult SaveInventoryData(InventoryRequestDto requestDto)
        {
            SqlConnection connection = new SqlConnection
            {

                ConnectionString = "Server=DESKTOP-N67GFHH; Database=gadgetShop; Integrated Security=true; TrustServerCertificate=True"

            };
            SqlCommand command = new SqlCommand { 
            CommandText= "sp_SaveInventoryData ",
            CommandType= System.Data.CommandType.StoredProcedure,
            Connection= connection
            };

            command.Parameters.AddWithValue("@ProductId", requestDto.ProductId);
            command.Parameters.AddWithValue("@ProductName", requestDto.ProductName);
            command.Parameters.AddWithValue("@AvaliableStock", requestDto.AvaliableStock);
            command.Parameters.AddWithValue("@ReorderPoint", requestDto.ReorderPoint);

            connection.Open();
            command.ExecuteNonQuery();

            connection.Close();
            return Ok();
        }

        [HttpGet]
        public IActionResult GetInventoryData()
        {
            SqlConnection connection = new SqlConnection
            {

                ConnectionString = "Server=DESKTOP-N67GFHH; Database=gadgetShop; Integrated Security=true; TrustServerCertificate=True"

            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_GetInventoryData ",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            connection.Open();

            List<InventoryDto> response = new List<InventoryDto>();

            using (SqlDataReader reader = command.ExecuteReader()) { 
            
            while (reader.Read())
                {

                    InventoryDto inventoryDto = new InventoryDto();

                    inventoryDto.ProductId = Convert.ToInt32(reader["ProductId"]);
                    inventoryDto.ProductName = Convert.ToString(reader["ProductName"]);
                    inventoryDto.AvaliableStock = Convert.ToInt32(reader["AvaliableStock"]);
                    inventoryDto.ReorderPoint = Convert.ToInt32(reader["ReorderPoint"]);
                    response.Add(inventoryDto);
                }
            }

            connection.Close();
            return Ok(JsonConvert.SerializeObject(value: response));
        }

        [HttpDelete]
        public IActionResult DeleteInventoryData(int ProductId)
        {
            SqlConnection connection = new SqlConnection
            {

                ConnectionString = "Server=DESKTOP-N67GFHH; Database=gadgetShop; Integrated Security=true; TrustServerCertificate=True"

            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "SP_DeleteInventoryDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@ProductId", ProductId);

            connection.Open();
            command.ExecuteNonQuery();


            connection.Close();
            return Ok();
        }
        [HttpPut]
        public IActionResult UpdateInventoryData(InventoryRequestDto requestDto)
        {
            SqlConnection connection = new SqlConnection
            {

                ConnectionString = "Server=DESKTOP-N67GFHH; Database=gadgetShop; Integrated Security=true; TrustServerCertificate=True"

            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_UpdateInventoryData",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@ProductId", requestDto.ProductId);
            command.Parameters.AddWithValue("@ProductName", requestDto.ProductName);
            command.Parameters.AddWithValue("@AvaliableStock", requestDto.AvaliableStock);
            command.Parameters.AddWithValue("@ReorderPoint", requestDto.ReorderPoint);

            connection.Open();
            command.ExecuteNonQuery();


            connection.Close();
            return Ok();
        }
    }
}
