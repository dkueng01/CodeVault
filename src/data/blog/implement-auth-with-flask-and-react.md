---
author: David Küng
pubDatetime: 2025-05-11T15:00:00Z
title: Secure Authentication with Flask and React (Axios)
slug: implement-auth-with-flask-and-react
featured: true
draft: false
tags:
  - Flask
  - React
  - Authentication
description: How to securly implement Auth with Flask and React
---

# Secure Authentication with Flask and React (Axios): Step-by-Step Guide
In this blog post, I'll show you how to implement modern and secure authentication for a React frontend (with Axios) and a Flask backend. We'll use JWTs (JSON Web Tokens) stored as HTTP-only cookies. This protects against XSS and is ideal for SPAs.

We'll go through the five most important steps:
- Login request from the frontend
- JWT token issuance in the backend
- Secure token storage
- Authenticated requests
- Token validation in the backend

## 1. Login Request from the Frontend
The React frontend sends login data (e.g., email and password) via POST to the Flask backend.
With Axios, it looks like this:

```js
// src/api/auth.js
import axios from 'axios';

export async function login(email, password) {
  const response = await axios.post(
    'http://localhost:5000/api/login',
    { email, password },
    { withCredentials: true } // important for cookies!
  );
  return response.data;
}
```

## 2. JWT Token Issuance in the Backend
The Flask backend verifies the credentials and returns a JWT as an HTTP-only cookie upon success.

```python
# app.py
from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, set_access_cookies
)
from datetime import timedelta

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

jwt = JWTManager(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    # Here you would check the credentials!
    if email == 'test@example.com' and password == 'password123':
        access_token = create_access_token(identity=email)
        resp = jsonify({'login': True})
        set_access_cookies(resp, access_token)
        return resp
    return jsonify({'login': False}), 401
```

## 3. Secure Token Storage
The JWT is not stored in localStorage or sessionStorage, but set as an HTTP-only cookie by the backend.
The frontend has no access to the token – this protects against XSS.
Important:
All subsequent requests must set withCredentials: true so the browser sends the cookie.

## 4. Authenticated Requests
The React frontend can now easily make API requests – the cookie is sent automatically.

```js
// src/api/user.js
import axios from 'axios';

export async function getProfile() {
  const response = await axios.get(
    'http://localhost:5000/api/profile',
    { withCredentials: true } // Cookie is sent automatically!
  );
  return response.data;
}
```

## 5. Token Validation in the Backend
The Flask backend checks the JWT from the cookie for each protected endpoint.

```python
# app.py (continued)
from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    user_email = get_jwt_identity()
    # Here you would fetch user data from the DB
    return jsonify({
        'email': user_email,
        'name': 'John Doe'
    })
```

## Bonus: Logout
During logout, the cookie is simply deleted:
```python
from flask_jwt_extended import unset_jwt_cookies

@app.route('/api/logout', methods=['POST'])
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp
```

In the frontend:

```js
// src/api/auth.js
import axios from 'axios';

export async function logout() {
  const response = await axios.post(
    'http://localhost:5000/api/logout',
    {},
    { withCredentials: true }
  );
  return response.data;
}
```

## Conclusion
With this setup, you have secure, modern authentication for your React/Flask app:
- JWTs as HTTP-only cookies protect against XSS.
- The frontend doesn't need to worry about token handling.
- The backend checks authentication with every request.