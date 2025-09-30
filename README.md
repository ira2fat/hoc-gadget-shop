# Online Shop - E-Commerce Application

A full-stack e-commerce application with Angular frontend and .NET Core Web API backend.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Backend API Setup](#backend-api-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)


## 🔧 Prerequisites

Before running the application, ensure you have the following installed:

### Required Software:
- **Node.js** (v18+ recommended) - [Download here](https://nodejs.org/)
- **Angular CLI** (v18+) - Install globally: `npm install -g @angular/cli`
- **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server** (LocalDB, Express, or Full) - [Download here](https://www.microsoft.com/sql-server/sql-server-downloads)

### Check Installations:
```bash
# Check Node.js version
node --version

# Check Angular CLI
ng version

# Check .NET version
dotnet --version

```

## 🗄️ Database Setup

### 1. SQL Server Setup

#### Option A: SQL Server LocalDB (Recommended for Development)
```bash
# Install SQL Server LocalDB (comes with Visual Studio)
# Or download separately from Microsoft
```

#### Option B: SQL Server Express
```bash
# Download and install SQL Server Express
# Create a new database instance
```

### 2. Database Configuration

1. **Update Connection String**:
   - Open `HOCGadgetShopApi/HOCGadgetShopApi/appsettings.json`
   - Update the connection string to match your SQL Server setup:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=OnlineShopDb;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

**Common Connection String Examples:**

```json
// For SQL Server LocalDB
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=OnlineShopDb;Trusted_Connection=true;TrustServerCertificate=true;"

// For SQL Server Express
"DefaultConnection": "Server=.\\SQLEXPRESS;Database=OnlineShopDb;Trusted_Connection=true;TrustServerCertificate=true;"

// For SQL Server with SQL Authentication
"DefaultConnection": "Server=localhost;Database=OnlineShopDb;User Id=sa;Password=YourPassword;TrustServerCertificate=true;"
```

### 3. Create Database and Tables

#### Manual Database Setup:
```sql
-- Connect to your SQL Server instance and run:

CREATE DATABASE OnlineShopDb;
GO

USE OnlineShopDb;
GO

-- Create Inventory table
CREATE TABLE Inventory (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(255) NOT NULL,
    AvailableStock INT NOT NULL DEFAULT 0,
    ReorderPoint INT NOT NULL DEFAULT 0
);

-- Create CustomerDetails table
CREATE TABLE CustomerDetails (
    CustomerId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20),
    RegistrationDate DATETIME2 DEFAULT GETDATE()
);

```

## 🚀 Backend API Setup

### 1. Navigate to API Directory
```bash
cd HOCGadgetShopApi
```

### 2. Restore Dependencies
```bash
dotnet restore
```

### 3. Build the Project
```bash
dotnet build
```

### 4. Run the API
```bash
# For development
dotnet run

# Or specify the project
dotnet run --project HOCGadgetShopApi

# The API will start on: https://localhost:7270 and http://localhost:5155
```

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd hoc-gadget-shop-frontend
```

### 2. Install Dependencies
```bash
npm install
```


### 4. Run the Frontend
```bash
# Start development server
ng serve

# The app will be available at: http://localhost:4200
```

##  Running the Application

### Start Both Services:

1. **Terminal 1 - Backend API:**
```bash
cd HOCGadgetShopApi
dotnet run
# API runs on: https://localhost:7270
```

2. **Terminal 2 - Frontend:**
```bash
cd hoc-gadget-shop-frontend
ng serve
# Frontend runs on: http://localhost:4200
```

3. **Open Browser:**
   - Navigate to: `http://localhost:4200`
   - The app should load with the About page as the homepage

## 📡 API Endpoints

### Inventory Management:
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory` - Update inventory item
- `DELETE /api/inventory/{id}` - Delete inventory item

### Customer Management:
- `GET /api/customerdetails` - Get all customers
- `POST /api/customerdetails` - Create new customer
- `PUT /api/customerdetails` - Update customer
- `DELETE /api/customerdetails/{id}` - Delete customer

## 🔧 Troubleshooting

### Common Issues:

#### 1. **Database Connection Issues:**
```
Error: Cannot connect to database
```
**Solution:** 
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Ensure database exists

#### 2. **CORS Errors:**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** 
- Verify frontend URL is in API CORS policy (Program.cs)
- Check frontend is running on expected port

#### 3. **Angular CLI Not Found:**
```
'ng' is not recognized as an internal or external command
```
**Solution:**
```bash
npm install -g @angular/cli
```

#### 4. **Port Already in Use:**
```
Port 4200 is already in use
```
**Solution:**
```bash
ng serve --port 4300
```

#### 5. **SSL Certificate Issues:**
```
SSL certificate problem
```
**Solution:**
- Trust the development certificate:
```bash
dotnet dev-certs https --trust
```

### Useful Commands:

```bash
# Clear npm cache
npm cache clean --force

# Reset Angular node_modules
rm -rf node_modules package-lock.json
npm install

# Check what's running on ports
netstat -ano | findstr :4200
netstat -ano | findstr :7270

# Kill process by PID (Windows)
taskkill /PID <PID> /F
```

## 🚀 Development Workflow

1. **Start Backend API** (Terminal 1)
2. **Start Frontend** (Terminal 2)
3. **Open Browser** to `http://localhost:4200`
4. **Make Changes** and they'll auto-reload
5. **Test API** via Swagger at `https://localhost:7270/swagger`

## 📝 Notes

- Frontend runs on **HTTP** (port 4200)
- Backend API runs on **HTTPS** (port 7270)
- Database connection uses **Windows Authentication** by default
- All routes redirect to About page for unknown URLs
- CORS is configured for localhost development