using HOCGadgetShopApi.Data;
using Microsoft.EntityFrameworkCore;

var myAllowedOrigins = "_myAllowedOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();

builder.Services.AddDbContext<GadgetShopContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowedOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200",
                                              "https://hocgadgetshop.vercel.app", "http://localhost")
                                .AllowAnyHeader()
                                .AllowAnyMethod().SetIsOriginAllowedToAllowWildcardSubdomains();
                      });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(myAllowedOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
