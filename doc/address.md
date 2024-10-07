# Adsress API Spec

## Create Address

Endpoint : POST /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "Jalan jendral sudirman, no 13", // optional
  "city": "Solo", // optional
  "province": "Jawa Tengah", // optional
  "country": "Indonesia",
  "postal_code": "57666"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan jendral sudirman, no 13", // optional
    "city": "Solo", // optional
    "province": "Jawa Tengah", // optional
    "country": "Indonesia",
    "postal_code": "57666"
  }
}
```

## GET Address

Endpoint : POST /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Response Body :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan jendral sudirman, no 13", // optional
    "city": "Solo", // optional
    "province": "Jawa Tengah", // optional
    "country": "Indonesia",
    "postal_code": "57666"
  }
}
```

## Update Address

Endpoint : PUT /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "Jalan jendral sudirman, no 13", // optional
  "city": "Solo", // optional
  "province": "Jawa Tengah", // optional
  "country": "Indonesia",
  "postal_code": "57666"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan jendral sudirman, no 13", // optional
    "city": "Solo", // optional
    "province": "Jawa Tengah", // optional
    "country": "Indonesia",
    "postal_code": "57666"
  }
}
```

## Delete Address

Endpoint : POST /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "Jalan jendral sudirman, no 13", // optional
  "city": "Solo", // optional
  "province": "Jawa Tengah", // optional
  "country": "Indonesia",
  "postal_code": "57666"
}
```

Response Body :

```json
{
  "data": true
}
```

## List Addresses

Endpoint : GET /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Response Body :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jalan jendral sudirman, no 13", // optional
      "city": "Solo", // optional
      "province": "Jawa Tengah", // optional
      "country": "Indonesia",
      "postal_code": "57666"
    },
    {
      "id": 2,
      "street": "Jalan Slamet Riyadi, no 7", // optional
      "city": "Solo", // optional
      "province": "Jawa Tengah", // optional
      "country": "Indonesia",
      "postal_code": "57613"
    }
  ]
}
```
