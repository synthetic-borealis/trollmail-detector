# Trollmail Detector

## Table of Contents
* [Overview](#overview)
* [Setting Up](#setting-up)
* [Usage Examples](#usage-examples)

## Overview

Trollmail detector is a RESTful API that validates e-mail addresses and compares and compares the domain they're associated with against a list of known throwaway e-mail provider domains.

## Setting Up

1. Install dependencies by running `npm install` from the root directory.
2. Run `echo PORT={PORT NUMBER} > .env` (replace {PORT NUMBER} with a port number).
3. Run `yarn start` to start the server.

- _Optional but highly recommended:_ Install pm2 and start the service by running `pm2 start src/app.js`.

## Usage Examples

### Example 1

**Request:**

```json
{
  "email": "gordon.freeman@bmrf.com"
}
```

**Response:**

```json
{
  "email": "gordon.freeman@bmrf.com",
  "status": "Valid"
}
```

### Example 2

**Request:**

```json
{
  "email": "gordon.freeman#bmrf.com"
}
```

**Response:**

```json
{
  "email": "gordon.freeman#bmrf.com",
  "status": "NotAnEmail"
}
```

### Example 3

**Request:**

```json
{
  "email": "gordon.freeman@sharklasers.com"
}
```

**Response:**

```json
{
  "email": "gordon.freeman@sharklasers.com",
  "status": "Blacklisted"
}
```
