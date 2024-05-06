# SplitAI - AI-Powered Group Accounting App

## Overview

This application leverages artificial intelligence to simplify the process of recording and splitting expenses among groups, aiming to deliver a seamless user experience. It is designed to assist users in managing their finances collaboratively with friends, family, or any group settings. By integrating cutting-edge AI technology, the app interprets natural language to automatically log and categorize expenses, streamlining the accounting process and minimizing manual entry errors.

## Key Features

- **AI-Driven Expense Logging *(Unrealized)***: Utilize AI to convert natural language inputs into structured expense entries. 
- **Group Accounting**: Create groups, add friends via their username, and manage shared expenses effortlessly.
- **Seamless User Experience**: Designed with the user in mind, the app provides intuitive navigation and real-time updates for all group activities.

## Getting Started

To start using the app, users need to register an account(only login currently), create a group, invite friends to the group, and begin adding expenses.

---

## Current Capabilities

- **Basic Expense Tracking**: Log individual and group expenses with support for multiple currencies.
- **Expense Splitting**: Automatically calculate splits based on predefined rules (equal, shared, or fixed).
- **Group Management**: Users can form groups, invite friends, and view combined financial activities in a unified dashboard.

## Target Audience

This app is ideal for anyone who want to manage shared expenses together.

## API Endpoints

### Session Management

- **GET /api/session**: Retrieve the current user's session data.
- **POST /api/session**: Authenticate and create a session for a user.
- **DELETE /api/session**: Log out and delete the current session.

### User Management

- **POST /api/users**: Register a new user (not explicitly shown, implement if needed).
- **GET /api/users/{username}**: Get detailed information about a specific user (not explicitly shown, implement if needed).

### Group Management

- **GET /api/groups**: Retrieve all groups that the logged-in user belongs to.
- **POST /api/groups**: Create a new group.
- **PATCH /api/groups/{id}**: Update group details, typically used to change the group owner or modify membership.
- **DELETE /api/groups/{id}**: Delete a group and its associated data.

### Expense Management

- **GET /api/groups/{id}/expenses**: Get all expenses for a specific group.
- **POST /api/expenses**: Create a new expense and associate it with a group.

### Membership Management

- **POST /api/groups/{id}/member**: Add a member to a specific group.

### Error Handling

Responses to errors such as invalid usernames, insufficient permissions, and missing data are provided with appropriate HTTP status codes to facilitate error handling on the client side.

### Responses

All endpoints return JSON format data. Each response includes either the data requested or a relevant error message and status code.

---

## Product Roadmap

### Planned Enhancements

- **Advanced AI Features**: Implement more complex natural language processing to handle diverse financial entries.
- **Enhanced Group Features**: Introduce more granular permissions and roles within groups.
- **Integration with Financial Tools**: Connect with banking APIs for real-time financial data and transaction importing.

Our goal is to make financial management as effortless and collaborative as possible, harnessing the power of AI to transform how people handle their money.

### Upcoming Features (Soon!)

- **Expense Date Selection**: Introduce the ability to select and modify the date of an expense for more accurate financial tracking.

- **Payer Selection**: Implement functionality for users to specify who paid for each expense, enhancing clarity in shared financial situations.

- **Multi-Currency Support**: Add support for multiple currencies, allowing users to log and manage expenses in the currency of their choice.

- **Real-Time Currency Conversion**: Incorporate real-time exchange rate conversion to ensure accurate and up-to-date financial reporting in a preferred base currency.

These planned features are aimed at providing a more robust and user-friendly experience, facilitating precise financial management for diverse user needs.

---

## Licensing
- Google Material Icons: [Apache License Version 2.0.](https://www.apache.org/licenses/LICENSE-2.0.txt)