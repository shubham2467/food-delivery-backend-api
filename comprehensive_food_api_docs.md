# Food Delivery Backend API Reference

## Base URL

```text
https://your-domain/api/v1
```

## Authentication

Use the following header for protected endpoints:

```http
Authorization: Bearer <jwt_token>
```

---

# 1. Authentication APIs

## Register

**POST** `/auth/register`

### Sample Request

```json
{
  "firstName": "Shubham",
  "lastName": "Kumar",
  "email": "shubham@example.com",
  "password": "Password@123",
  "phone": "9876543210",
  "address": "Bhopal",
  "answer": "cricket"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login

**POST** `/auth/login`

### Sample Request

```json
{
  "email": "shubham@example.com",
  "password": "Password@123"
}
```

### Success Response

```json
{
  "success": true,
  "token": "<jwt_token>",
  "user": {}
}
```

---

## Logout

**POST** `/auth/logout`

**Auth Required:** Yes

### Success Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

# 2. User APIs

## Get Current User

**GET** `/user`

**Auth Required:** Yes

---

## Update Profile

**PUT** `/user`

### Sample Request

```json
{
  "firstName": "Shubham",
  "lastName": "Kumar",
  "phone": "9999999999",
  "address": "Patna"
}
```

---

## Update Password

**PUT** `/user/password`

### Sample Request

```json
{
  "oldPassword": "Password@123",
  "newPassword": "NewPassword@123"
}
```

---

## Delete Profile

**DELETE** `/user/{id}`

---

## Update User Role (Admin)

**PUT** `/user/role/{id}`

### Sample Request

```json
{
  "usertype": "admin"
}
```

---

# 3. Restaurant APIs

## Create Restaurant

**POST** `/restaurant`

### Sample Request

```json
{
  "title": "Pizza Hub",
  "imageUrl": "https://example.com/image.png",
  "foods": [],
  "time": "30 mins",
  "pickup": true,
  "delivery": true,
  "isOpen": true,
  "logoUrl": "https://example.com/logo.png",
  "rating": 4.5,
  "ratingCount": "120",
  "code": "RST001",
  "coords": {
    "lat": 23.2599,
    "lng": 77.4126
  }
}
```

---

## Get All Restaurants

**GET** `/restaurant`

---

## Get Restaurant By ID

**GET** `/restaurant/{id}`

---

## Update Restaurant

**PUT** `/restaurant/{id}`

---

## Delete Restaurant

**DELETE** `/restaurant/{id}`

---

# 4. Category APIs

## Create Category

**POST** `/category`

### Sample Request

```json
{
  "title": "Veg"
}
```

---

## Get All Categories

**GET** `/category`

---

## Update Category

**PUT** `/category/{id}`

```json
{
  "title": "Fast Food"
}
```

---

## Delete Category

**DELETE** `/category/{id}`

---

# 5. Food APIs

## Create Food

**POST** `/food`

### Sample Request

```json
{
  "title": "Paneer Pizza",
  "description": "Cheese pizza with paneer",
  "price": 299,
  "imageUrl": "https://example.com/pizza.png",
  "foodTags": ["cheese", "spicy"],
  "category": "veg-category-id",
  "restaurant": "restaurant-id",
  "code": "FD001",
  "isAvailable": true
}
```

---

## Get All Foods

**GET** `/food`

---

## Get Food By ID

**GET** `/food/{id}`

---

## Get Food By Category

**GET** `/food/category/{title}`

Example:

```text
/food/category/Veg
```

---

## Get Food By Restaurant

**GET** `/food/restaurant/{id}`

---

## Update Food

**PUT** `/food/{id}`

---

## Delete Food

**DELETE** `/food/{id}`

---

# 6. Order APIs

## Place Order

**POST** `/food/place-order`

### Sample Request

```json
{
  "cart": [
    {
      "foodId": "food-id",
      "quantity": 2
    }
  ],
  "payment": {
    "method": "COD"
  },
  "shippingAddress": "Bhopal"
}
```

---

## Update Order Status

**PUT** `/food/order-status/{id}`

### Sample Request

```json
{
  "status": "Preparing"
}
```

Possible values:

- Pending
- Preparing
- Out for Delivery
- Delivered
- Cancelled

---

# HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
