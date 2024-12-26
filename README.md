# Devtendance

Devtendance is a Discord bot designed to track user check-in and check-out times, manage break statuses, and generate activity reports. It uses Discord's interaction model and is integrated with Airtable for data storage.

## Features

- **Slash Commands**:
  - `/checkin`: Records a user's check-in time.
  - `/checkout`: Prompts a modal for checkout details.
  - `/brb`: Marks a user as on a break.
  - `/back`: Updates a user's status after returning from a break.
  - `/report`: Generates detailed activity reports.
- **Modal Submissions**: Handles progress updates via modal forms.
- **Airtable Integration**: Manages user data and status updates.
- **Activity Notifications**: Sends status updates to designated channels.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fhd-codes/devtendance.git
   cd devtendance
   npm install
   ```

2. Create a .env file with the following variables:
    ```
    BOT_TOKEN=***
    BOT_APP_ID=***
    BOT_PUBLIC_KEY=***
    BOT_CLIENT_KEY=***
    BOT_CLIENT_SECRET=***
    BOT_DAILY_UPDATE_CHANNEL_ID=***
    
    AIRTABLE_TOKEN=***
    AIRTABLE_BASE_ID=***
    
    REPORT_PWD =***
    PORT=3000
    ```

3. Usage
  
   Register commands with Discord:
    ```bash
    npm run register
    ```
  Start the bot:
    ```bash
    npm start
    ```
  For development mode with automatic restarts:
    ```bash
    npm run dev
    ```

4. Commands list

    | Command     | Description                              |
    |-------------|------------------------------------------|
    | `/checkin`  | Registers a user's check-in time.        |
    | `/checkout` | Prompts a modal to log checkout details. |
    | `/brb`      | Marks the user as "Be Right Back".       |
    | `/back`     | Updates the status to "Back".           |
    | `/report`   | Generates a detailed activity report.    |
