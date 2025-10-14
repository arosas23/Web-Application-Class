# basic-express-bmi

An exercise using Express.js application that calculates Body Mass Index (BMI) from user-submitted weight and height. This project serves a static HTML form from the `public` folder and exposes a `/bmi` POST endpoint that returns the calculated BMI.

## Features

- Serves static files from `public` (including `index.html`).
- Accepts form submissions (weight in kilograms and height in centimeters) and returns the BMI rounded to two decimal places.

## Requirements

- Node.js (v16+ recommended)
- npm (or another Node package manager)

## Install

1. Open a terminal in the project folder (`basic-express-bmi`).
2. Install dependencies:

```powershell
npm install
```

Note: This project depends on `express` and `body-parser` as declared in `package.json`.

## Run

Start the server with:

```powershell
node server.js
```

The server listens on http://localhost:3000 by default (see `server.js`).

Open your browser and navigate to:

```
http://localhost:3000
```

Use the form on the page to submit weight (kg) and height (cm). The server responds with a simple message containing the calculated BMI.

## Endpoint

- POST /bmi
  - Body (form-encoded): `weight` (kg), `height` (cm)
  - Response: plain text message `Your BMI is <value>` or an error message for invalid input.

## Notes

- The app performs minimal input validation: it checks that weight and height are positive numbers. It returns an error string for invalid input.
- The BMI calculation uses height in centimeters and converts it appropriately: BMI = weight / (height_meters^2).

## Author

Aemi Rosas

## License

ISC
