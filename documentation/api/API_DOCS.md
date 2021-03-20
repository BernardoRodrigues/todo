
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

### POST user/logout

### DELETE user/:id
Request header:
* Authorization: Bearer token
Request


# TODO

