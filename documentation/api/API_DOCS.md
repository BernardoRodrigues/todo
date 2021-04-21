
# API
The api url's always start with the prefix "api/$$version$$".

# USER

### POST user/signup
creates a new user
Request body:
```json
{
  "email": "example@gmail.com",
  "password": "password",
  "firstName": "John",
  "lastName": "Doe"
}
```
Response:
* HTTP code 201
```json
{ "id": "54fdf009-0270-461a-beeb-89d57ed3bc42" }
```
* HTTP code 400 - //todo add custom error


### POST user/login
logs user in
Request body:
```json
{
    "email": "example@gmail.com",
    "password": "password"
}
```
Response:
* HTTP code 200
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0YWZkODhiLTk5MWItNDk2NS1iMmM5LTk2ZTRjMmZjNThkZSJ9.He07nMDw6wYsqWknGzm-O2ykDuighPwhC6AdfIavs-w",
    "email": "example@gmail.com",
    "firstName": "Bernardo",
    "lastName": "Rodrigues"
}
```

### POST user/logout

### DELETE user/
Request header:
* Authorization: Bearer token
Request


# TODO

