# Endpoints

## Note on validation

- If the endpoint is provided with invalid parameters, the response JSON will contain `errors` array, each item in the array having `msg`, `param`, `reason`.

- Example:
  ```json
  {
    "errors": [
      {
        "msg": "Invalid value",
        "param": "redirect",
        "location": "query"
      }
    ]
  }
  ```

## Auth

- `/auth/google` : Login using google. Not an API endpoint. Must actually redirect to this. After login, redirects to client. Pass `redirect` in body. Creates a session.
- `/auth/user` : Get the user object if logged in, error otherwise.
