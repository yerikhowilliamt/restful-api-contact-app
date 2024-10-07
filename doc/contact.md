# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts/create

Header :

- Authorization : token

Request Body :

```json
{
  "first_name": "Yerikho William",
  "last_name": "Tasilima", // opsional
  "phone": "08123456789",
  "email": "yerikho@mail.com" // opsional
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "first_name": "Yerikho William",
    "last_name": "Tasilima",
    "phone": "08123456789",
    "email": "yerikho@mail.com"
  }
}
```

## Get Contact

Endpoint : GET /api/contacts/:contactId

Header :

- Authorization : token

Response Body :

```json
{
  "data": {
    "id": 1,
    "first_name": "Yerikho William",
    "last_name": "Tasilima",
    "phone": "08123456789",
    "email": "yerikho@mail.com"
  }
}
```

## Update Contact

Endpoint : PUT /api/contacts/:contactId

Header :

- Authorization : token

Request Body :

```json
{
  "first_name": "Yerikho William",
  "last_name": "Tasilima",
  "phone": "08123456789",
  "email": "yerikho@mail.com"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "first_name": "Yerikho William",
    "last_name": "Tasilima",
    "phone": "08123456789",
    "email": "yerikho@mail.com"
  }
}
```

Response Body (Failed) :

```json
{
  "data": "Phone number already exists"
}
```

## Delete Contact

Endpoint : DELETE /api/contacts/contactId

Header :

- Authorization : token

Response Body :

```json
{
  "data": true
}
```

## Search Contact

Endpoint : GET /api/contacts

Header :

- Authorization : token

Query Params :

- name : first name or contact last name (string), optional
- phone : contact phone number (string), optional
- phone : contact email (string), optional
- page : default 1 (number)
- size : default 10 (number)

Response Body :

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Yerikho William",
      "last_name": "Tasilima",
      "phone": "08123456789",
      "email": "yerikho@mail.com"
    },
    {
      "id": 2,
      "first_name": "John",
      "last_name": "Doe",
      "phone": "08123466689",
      "email": "johndoe@mail.com"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```
