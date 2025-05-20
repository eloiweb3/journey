## Description

  _Journey_ is a Solana blockchain application that enables users to create, update, and delete personal journal entries. Each entry consists of a title and message, with entries stored securely on the Solana   blockchain. This document provides a high-level overview of the Journey program architecture, core components, and their interactions.


### System architecture

  The App follows a layered architecture pattern that separates concerns across multiple components:

<img width="319" alt="image" src="https://github.com/user-attachments/assets/7d20daf3-0511-416c-a199-a7b83e757675" />

# Core components

### Solana Program
  Journey Solana program is implemented in Rust using the Anchor framework. It serves as the backend for the application, handling all data storage and transaction logic.

  The program provides three main instructions:

  <img width="700" alt="image" src="https://github.com/user-attachments/assets/dba82396-b4ee-4480-8f1b-8f03805fe558" />

  <br>

Each entry is stored in a JourneyEntryState account, which contains:

  - Owner (the user's public key)
  - Title (limited to 50 characters)
  - Message (limited to 1000 characters)


### Account structure

The program uses Program Derived Addresses (PDAs) to deterministically generate account addresses based on the title and owner. This ensures:

  1. Each user can only have one entry with a given title
  2. Entries can be easily located given the title and owner

<img width="365" alt="image" src="https://github.com/user-attachments/assets/778c9d36-9ee7-40ef-8266-1bf758661800" />

### Data flow

The following sequence diagram illustrates the flow of data when creating a new journey entry:

<img width="1455" alt="image" src="https://github.com/user-attachments/assets/91f2a732-f614-423b-bdbd-d566df6e8525" />

### UI Components

The Journey application provides several UI components for interaction:

<img width="694" alt="image" src="https://github.com/user-attachments/assets/3ce8bfbd-f532-4e2e-980a-b4a0da0b2512" />

The UI components interact with the Solana program through custom React hooks that handle data fetching and mutation.

<img width="743" alt="image" src="https://github.com/user-attachments/assets/25d95fb6-1520-4d2e-a37a-34b6b3d0d417" />

### Technical Implementation
  The Journey program uses several key technologies:

  Solana Blockchain: For secure, decentralized storage of journal entries
  Anchor Framework: Simplifies Solana program development
  React: For building the user interface
  Next.js: For the web application framework
  Key technical aspects include:

  Program ID: The Solana program has a unique identifier specified in declare_id!
  Account Space Management: The program pre-allocates space for each entry account
  Owner Verification: Only the owner of an entry can update or delete it
  PDA Derivation: Accounts are derived using the entry title and owner public key


