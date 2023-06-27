# Branded Things (UNIQLOK) Documentation

## Endpoints:

List of available endpoints:

1. POST /api/register
2. POST /api/login
3. POST api/loginMentor
4. GET /api/mentors
5. GET /api/categories

<!-- Need Authentication -->

6. GET /wishlist
7. POST /wishlist/:id
8. DELETE /wishlist/:id

&nbsp;

## 1. POST /api/register

### Request:

- **body**

```js
{
    "name": "string",
    "password": "string",
    "email": "string",
    "categoryId":"integer",
}
```

### Response:

_Response (201 - Created)_

```js
{
    "id":"integer"
    "name": "string",
    "email": "string"
}
```

_Response (400 - Bad Request)_

```
{
    "message": "Email has been registered"
}
OR
{
  "message": "Name is required"
},
OR
{
  "message": "Email is required"
},
OR
{
  "message": "Password is required"
},
OR
{
  "message": "Category Id is required"
},
OR
{
  "message": "Email is invalid format"
}
```

&nbsp;

## 2. POST /api/login

### Request:

- **body**

```js
{
    "email": "string",
    "password": "integer",
}
```

### Response:

_Response (200-OK)_

```js
{
    "name": "string",
    "access_token": 'string'
}
```

_Response (401-Unauthorized)_

```js
{
  message: "Invalid email/password";
}
```

_Response (400-BAD REQUEST)_

```js
{
  message: "Email is required";
}
```

OR

```js
{
  message: "Password is required";
}
```

&nbsp;

## 3. POST /api/loginMentor

### Request:

- **body**

```js
{
    "email": "string",
    "password": "integer",
}
```

### Response:

_Response (200-OK)_

```js
{
    "name": "string",
    "access_token": 'string'
}
```

_Response (401-Unauthorized)_

```js
{
  message: "Invalid email/password";
}
```

_Response (400-BAD REQUEST)_

```js
{
  message: "Email is required";
}
```

OR

```js
{
  message: "Password is required";
}
```

## 4. GET /api/mentors

&nbsp;

### Request:

- **Query**

```
{
  'page': 'integer'
},
{
  'categoryId': 'integer'
}
```

### Response:

_Response (200 - OK)_

```js
{
    "count": "integer",
    "rows": [
        {
            "id": "integer",
            "name": "string",
            "email": "string",
            "password": "string",
            "about": "text",
            "rate": "integer",
            "instagram": "string",
            "categoryId": "integer",
            "createdAt": "string",
            "updatedAt": "string",
            "Category": {
                "id": "integer",
                "category": "string",
                "createdAt": "string",
                "updatedAt": "string"
            }
        }
    ]
}
```

&nbsp;

## 5. GET /api/wishlist

### Request:

- **headers**

```js
{
  "access_token": "string"
}
```

### Response:

_Response (200 - OK)_

```js
[
    {
        "id": integer,
        "mentorId": integer,
        "menteeId": integer,
        "Mentor": {
            "id": integer,
            "name": "string",
            "email": "string",
            "about": "text",
            "rate": integer,
            "instagram": "string",
            "categoryId": integer,
            "Category": {
                "id": integer,
                "category": "string"
            }
        }
    },
    ...
]
```

&nbsp;

# 6. POST /wishlist/:id

### Request:

- **headers**

```js
{
  "access_token": "string"
}
```

- **parameters**

```
{
  id: 'integer'
}
```

### Response:

_Response (201 - Created)_

```js
{
    "id": "integer",
    "menteeId": "integer",
    "mentorId": "integer",
    "updatedAt": "string",
    "createdAt": "string"
}
```

_Response (404 - Not found)_

```
{
   "name": "Data not found"
}
```

## 7. DELETE /wishlist/:id

### Request:

- **headers**

```js
{
  "access_token": "string"
}
```

- **parameters**

```
{
  id: 'integer'
}
```

### Response:

_Response (200 - OK)_

```js
{
  message: "Your wishlist deleted successfully";
}
```

_Response (404 - Not found)_

```
{
   "name": "Data not found"
}
```

---

&nbsp;

# **Global Error**

### Response

_Response (401 - Unauthorized)_

```
{
    message: 'Invalid Token'
}
```

_Response (500 - Internal Server Error)_

```
{
    message: "Internal server error"
}
```
