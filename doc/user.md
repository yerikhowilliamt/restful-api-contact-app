# User API Spec

## Register User

Endpoint : POST /api/users/register

request body :

```json
{
  "username": "Yerikho William",
  "email": "yerikho@mail.com",
  "password": "password"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "username": "Yerikho William",
    "email": "yerikho@mail.com"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "email already registered"
}
```

## Login User

Endpoint : POST /api/users/login

request body :

```json
{
  "email": "yerikho@mail.com",
  "password": "password"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "Yerikho William",
    "email": "yerikho@mail.com",
    "token": "session_id_generated"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "email or password is wrong"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body (Success) :

```json
{
  "data": {
    "username": "Yerikho William",
    "email": "yerikho@mail.com"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

request body :

```json
{
  "username": "Yerikho William", // optional
  "password": "password" // optional
}
```

Response Body :

```json
{
  "data": {
    "username": "Yerikho William",
    "email": "yerikho@mail.com"
  }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Headers :

- Authorization : token

Response Body :

```json
{
  "data": true
}
```
