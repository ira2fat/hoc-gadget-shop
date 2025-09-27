using HOCGadgetShopApi.Models;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HOCGadgetShopApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerDetailsController : ControllerBase
    {
        [HttpPost]
        public IActionResult SaveCustomerData(CustomerRequestDto requestDto)
        {
            Console.WriteLine(requestDto.RegistrationDate);
            SqlConnection connection = new SqlConnection
            {

                ConnectionString = "Server=DESKTOP-N67GFHH; Database=gadgetShop; Integrated Security=true; TrustServerCertificate=True"

            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_SaveCustomerDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@CustomerId", requestDto.CustomerId);
            command.Parameters.AddWithValue("@FirstName", requestDto.FirstName);
            command.Parameters.AddWithValue("@LastName", requestDto.LastName);
            command.Parameters.AddWithValue("@Email", requestDto.Email);
            command.Parameters.AddWithValue("@RegistrationDate", requestDto.RegistrationDate);
            command.Parameters.AddWithValue("@PhoneNumber", requestDto.PhoneNumber);

            connection.Open();
            command.ExecuteNonQuery();

            connection.Close();
            return Ok();
        }

        [HttpGet]
        public IActionResult GetCustomersData()
        {
            SqlConnection connection = new SqlConnection
            {

                ConnectionString = "Server=DESKTOP-N67GFHH; Database=gadgetShop; Integrated Security=true; TrustServerCertificate=True"

            };
            SqlCommand command = new SqlCommand
            {
                CommandText = "sp_GetCustomersDetails",
                CommandType = System.Data.CommandType.StoredProcedure,
                Connection = connection
            };

            connection.Open();

            List<CustomerDto> response = new List<CustomerDto>();

            using (SqlDataReader reader = command.ExecuteReader())
            {

                while (reader.Read())
                {

                    CustomerDto customerDto = new CustomerDto();

                    customerDto.CustomerId = Convert.ToInt32(reader["CustomerId"]);
                    customerDto.FirstName = Convert.ToString(reader["FirstName"]);
                    customerDto.LastName = Convert.ToString(reader["LastName"]);
                    customerDto.Email = Convert.ToString(reader["Email"]);
                    customerDto.PhoneNumber = Convert.ToString(reader["PhoneNumber"]);
                    customerDto.RegistrationDate = Convert.ToDateTime(reader["RegistrationDate"]);
                    response.Add(customerDto);
                }
            }

            connection.Close();
            return Ok(JsonConvert.SerializeObject(value: response));
        }
    }
}
