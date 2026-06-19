# BorrowBox API Endpoints Documentation

This document describes all API endpoints currently supported by the BorrowBox backend.

---

## 1. Authentication & Profiles (`api/auth/`)

### A. Register User
* **Method**: `POST`
* **URL**: `/api/auth/register/`
* **Authentication**: None (Public)
* **Request Body (JSON)**:
  ```json
  {
    "username": "student_a",
    "email": "student_a@campus.edu",
    "password": "SecurePassword123!"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "username": "student_a",
    "email": "student_a@campus.edu"
  }
  ```

### B. Login / Token Obtain
* **Method**: `POST`
* **URL**: `/api/auth/login/`
* **Authentication**: None (Public)
* **Request Body (JSON)**:
  ```json
  {
    "username": "student_a",
    "password": "SecurePassword123!"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "refresh": "eyJhbGciOiJIUzI1NiIsIn...",
    "access": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

### C. Token Refresh
* **Method**: `POST`
* **URL**: `/api/auth/token/refresh/`
* **Authentication**: None (Public)
* **Request Body (JSON)**:
  ```json
  {
    "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

### D. Get Profile
* **Method**: `GET`
* **URL**: `/api/auth/profile/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Response (200 OK)**:
  ```json
  {
    "username": "student_a",
    "email": "student_a@campus.edu",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "profile_picture": "http://127.0.0.1:8000/media/profiles/avatar.jpg"
  }
  ```

### E. Update Profile
* **Method**: `PUT` or `PATCH`
* **URL**: `/api/auth/profile/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Request Body (JSON/Multipart)**:
  ```json
  {
    "email": "updated_email@campus.edu",
    "full_name": "Johnathan Doe",
    "phone_number": "+1987654321"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "username": "student_a",
    "email": "updated_email@campus.edu",
    "full_name": "Johnathan Doe",
    "phone_number": "+1987654321",
    "profile_picture": "http://127.0.0.1:8000/media/profiles/avatar.jpg"
  }
  ```

---

## 2. Listings (`api/listings/`)

### A. List Listings (Public Marketplace)
* **Method**: `GET`
* **URL**: `/api/listings/`
* **Authentication**: None (Public - SAFE_METHODS allowed)
* **Parameters**: `category` (id filter), `condition` (choices filter), `search` (text search on title, description, location)
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "owner": 2,
      "owner_username": "owner_user",
      "category": 1,
      "category_name": "Electronics",
      "title": "HD Projector",
      "description": "Like-new projector for rent.",
      "price_per_day": "12.50",
      "condition": "GOOD",
      "availability_status": "AVAILABLE",
      "location": "Library Annex",
      "image": null,
      "created_at": "2026-06-19T18:41:00Z"
    }
  ]
  ```

### B. Create Listing
* **Method**: `POST`
* **URL**: `/api/listings/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Request Body (JSON/Multipart)**:
  ```json
  {
    "category": 1,
    "title": "Science Calculator",
    "description": "Scientific graphing calculator.",
    "price_per_day": 2.50,
    "condition": "GOOD",
    "location": "Science Hall"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 2,
    "owner": 3,
    "owner_username": "student_a",
    "category": 1,
    "category_name": "Electronics",
    "title": "Science Calculator",
    "description": "Scientific graphing calculator.",
    "price_per_day": "2.50",
    "condition": "GOOD",
    "availability_status": "AVAILABLE",
    "location": "Science Hall",
    "image": null,
    "created_at": "2026-06-20T00:22:00Z"
  }
  ```

### C. Get Listing Details
* **Method**: `GET`
* **URL**: `/api/listings/<id>/`
* **Authentication**: None (Public)
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "owner": 2,
    "owner_username": "owner_user",
    "category": 1,
    "category_name": "Electronics",
    "title": "HD Projector",
    "description": "Like-new projector for rent.",
    "price_per_day": "12.50",
    "condition": "GOOD",
    "availability_status": "AVAILABLE",
    "location": "Library Annex",
    "image": null,
    "created_at": "2026-06-19T18:41:00Z"
  }
  ```

### D. Update Listing
* **Method**: `PUT` or `PATCH`
* **URL**: `/api/listings/<id>/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be the Listing Owner.
* **Response (200 OK)**: Returns updated Listing details JSON.

### E. Delete Listing
* **Method**: `DELETE`
* **URL**: `/api/listings/<id>/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be the Listing Owner.
* **Response (24 No Content)**

### F. Get Categories
* **Method**: `GET`
* **URL**: `/api/listings/categories/`
* **Authentication**: None (Public)
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Electronics"
    }
  ]
  ```

### G. Get My Listings
* **Method**: `GET`
* **URL**: `/api/listings/my/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Response (200 OK)**: Returns list of Listings owned by current user.

---

## 3. Borrow Requests (`api/requests/`)

### A. Create Borrow Request
* **Method**: `POST`
* **URL**: `/api/requests/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Request Body (JSON)**:
  ```json
  {
    "listing": 1,
    "start_date": "2026-07-01",
    "end_date": "2026-07-05",
    "message": "Hey! Can I lease this for a group project?"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "listing": 1,
    "listing_details": { ... },
    "borrower": 3,
    "borrower_username": "student_a",
    "owner": 2,
    "owner_username": "owner_user",
    "message": "Hey! Can I lease this for a group project?",
    "start_date": "2026-07-01",
    "end_date": "2026-07-05",
    "status": "PENDING",
    "created_at": "2026-06-20T00:22:00Z"
  }
  ```

### B. View Incoming Requests
* **Method**: `GET`
* **URL**: `/api/requests/incoming/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Response (200 OK)**: Returns list of BorrowRequests where current user is the owner.

### C. View Outgoing Requests
* **Method**: `GET`
* **URL**: `/api/requests/outgoing/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Response (200 OK)**: Returns list of BorrowRequests where current user is the borrower.

### D. Accept Request
* **Method**: `PATCH`
* **URL**: `/api/requests/<id>/accept/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be Listing Owner. Request must be `PENDING`.
* **Response (200 OK)**:
  ```json
  {
    "status": "Request accepted, item reserved, and transaction initiated."
  }
  ```

### E. Reject Request
* **Method**: `PATCH`
* **URL**: `/api/requests/<id>/reject/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be Listing Owner. Request must be `PENDING`.
* **Response (200 OK)**:
  ```json
  {
    "status": "Request rejected."
  }
  ```

### F. Cancel Request
* **Method**: `PATCH`
* **URL**: `/api/requests/<id>/cancel/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be Borrower. Request must be `PENDING`.
* **Response (200 OK)**:
  ```json
  {
    "status": "Request cancelled."
  }
  ```

---

## 4. Transactions (`api/transactions/`)

### A. List Transactions (User's Leases)
* **Method**: `GET`
* **URL**: `/api/transactions/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Response (200 OK)**: Returns active & completed leases where the user is either the owner or borrower.

### B. Retrieve Transaction Details
* **Method**: `GET`
* **URL**: `/api/transactions/<id>/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be a participant (owner or borrower).
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "listing": 1,
    "listing_details": { ... },
    "borrower": 3,
    "borrower_username": "student_a",
    "owner": 2,
    "owner_username": "owner_user",
    "borrow_request": 1,
    "start_date": "2026-07-01",
    "end_date": "2026-07-05",
    "price_per_day": "12.50",
    "total_days": 4,
    "total_amount": "50.00",
    "status": "ACTIVE",
    "created_at": "2026-06-20T00:22:00Z"
  }
  ```

### C. Initiate Return
* **Method**: `PATCH`
* **URL**: `/api/transactions/<id>/return/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be Borrower. Transaction status must be `ACTIVE`.
* **Response (200 OK)**:
  ```json
  {
    "status": "Item marked as returned. Awaiting owner confirmation."
  }
  ```

### D. Confirm Return
* **Method**: `PATCH`
* **URL**: `/api/transactions/<id>/confirm/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be Listing Owner. Transaction status must be `RETURN_PENDING`.
* **Response (200 OK)**:
  ```json
  {
    "status": "Return confirmed. Transaction closed and item is listed again."
  }
  ```

---

## 5. Notifications (`api/notifications/`)

### A. List Notifications
* **Method**: `GET`
* **URL**: `/api/notifications/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "user": 3,
      "title": "Request Accepted",
      "message": "Your borrow request has been accepted.",
      "type": "REQUEST_ACCEPTED",
      "is_read": false,
      "created_at": "2026-06-20T00:22:15Z"
    }
  ]
  ```

### B. Mark Notification as Read
* **Method**: `PATCH`
* **URL**: `/api/notifications/<id>/read/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Check**: Must be Notification Owner.
* **Response (200 OK)**: Returns Notification JSON with `"is_read": true`.

### C. Get Unread Notification Count
* **Method**: `GET`
* **URL**: `/api/notifications/unread-count/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Response (200 OK)**:
  ```json
  {
    "count": 1
  }
  ```

---

## 6. Dashboard Metrics (`api/dashboard/`)

### A. Get Summary Metrics
* **Method**: `GET`
* **URL**: `/api/dashboard/`
* **Authentication**: JWT Bearer Token (`Authorization: Bearer <access_token>`)
* **Response (200 OK)**:
  ```json
  {
    "total_listings": 2,
    "pending_requests": 1,
    "active_borrowings": 1,
    "completed_transactions": 0,
    "unread_notifications": 1
  }
  ```
