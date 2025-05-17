# Review and Payment Management System

A Node.js/Express application for handling appointments, reviews, payments, and SMS notifications.

## Table of Contents
- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Security Features](#security-features)

## API Contract
For detailed API specifications and contract, please refer to: [API Contract Document](https://docs.google.com/document/d/1Ht1X4CHSL35XBPxJTujl6LLBeF-slvFD6kUuCI6YcYU/edit?usp=sharing)

## Project Overview

This system allows users to:
- Create appointments
- Send SMS notifications
- Collect and process reviews
- Handle payments through Razorpay
- Generate insights from reviews

## Setup Instructions

### Prerequisites
- Node.js
- MySQL Database
- Twilio Account (for SMS)
- Razorpay Account (for payments)

### Environment Variables
Create a `.env` file with:

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
TWILLIO_ACCOUNT_ID=your_twilio_account_id
TWILLIO_AUTH_TOKEN=your_twilio_auth_token
RAZORPAY_ID=your_razorpay_id
RAZORPAY_SECRET=your_razorpay_secret
ENV=dev/prod

### Installation
bash
npm install
npm start

## API Documentation

### 1. SMS Routes

#### `POST /sendReviewRequest`
Sends SMS to customers requesting reviews

json
Request Body:
{
"appointmentId": "uuid",
"phoneNo": "string"
}
Response:
{
"message": "SMS sent successfully",
"data": {
"appointmentId": "uuid",
"status": "sent"
}
}

#### `GET /getAppointments`
Retrieves all appointments


json
Response:
{
"message": "Appointments retrieved successfully",
"data": [
{
"id": "uuid",
"firstName": "string",
"lastName": "string",
"phoneNo": "string",
"pricing": "string",
"shortId": "string",
"age": "string"
}
]
}

### 2. Review Routes

#### `POST /checkReview`
Checks if a review exists for an appointment

json
Request Body:
{
"appointmentId": "uuid"
}
Response:
{
"message": "Review status retrieved",
"data": {
"exists": boolean,
"reviewId": "uuid" // if exists
}
}

#### `GET /getReviewParameters/:appointmentId`
Gets all review parameters for an appointment

json
Response:
{
"message": "Parameters retrieved successfully",
"data": [
{
"id": "uuid",
"paramterName": "string",
"description": "string"
}
]
}

#### `POST /saveReview`
Saves review ratings for an appointment


json
Request Body:
{
"appointmentId": "uuid",
"ratings": [
{
"parameterId": "uuid",
"rating": number
}
]
}
Response:
{
"message": "Review saved successfully",
"data": {
"reviewId": "uuid"
}
}

### 3. Payment Routes

#### `POST /initiatePayment`
Initiates payment process through Razorpay

json
Request Body:
{
"appointmentId": "uuid",
"amount": number
}
Response:
{
"message": "Payment initiated successfully",
"data": {
"orderId": "string",
"amount": number,
"currency": "string",
"receipt": "string"
}
}

#### `POST /updatePayment`
Webhook endpoint for Razorpay payment updates

json
Request Body:
{
"razorpay_payment_id": "string",
"razorpay_order_id": "string",
"razorpay_signature": "string"
}
Response:
{
"message": "Payment updated successfully",
"data": {
"status": "string",
"orderId": "string"
}
}

### 4. Insights Routes

#### `GET /getInsights`
Retrieves review insights and pricing suggestions

json
Response:
{
"message": "Insights retrieved successfully",
"data": {
"finalRating": number,
"suggestivePricing": number,
"optedPricing": number,
"paymentStatus": "string"
}
}


## Database Schema

### Tables

1. **Appointments**
sql
id (UUID, PK)
firstName (STRING)
lastName (STRING)
pricing (STRING)
phoneNo (STRING)
shortId (STRING)
age (STRING)

2. **Reviews**
sql
id (UUID, PK)
appointmentId (UUID)
parameterId (UUID)
rating (INTEGER)


3. **Parameters**
sql
id (UUID, PK)
paramterName (STRING)
description (STRING)
timestamp (DATE)
isActive (BOOLEAN)


4. **ReviewInsights**
sql
id (UUID, PK)
appointmentId (UUID)
suggestivePricing (INTEGER)
optedPricing (INTEGER)

5. **Orders**
sql
id (UUID, PK)
appointmentId (UUID)
status (STRING)
price (STRING)
razorpayOrderId (STRING)
receiptUrl (TEXT)

## Error Handling

The project uses a centralized error handling system with custom exceptions:
- Validation Exceptions
- API Exceptions
- Database Exceptions

Error codes and status codes are defined in:
- `utils/errorCodes.utils.js`
- `utils/errorStatusCodes.utils.js`

## Security Features

- Input validation for all requests
- Error handling middleware
- Environment-based error messages
- Secure payment processing

## Response Format

All API responses follow a standard format:
json
{
"message": "Success/Failure message",
"data": {
// Response data
}
}

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details