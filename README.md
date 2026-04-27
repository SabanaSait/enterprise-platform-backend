# Enterprise Platform Backend

Backend platform service for the Enterprise Admin Platform, designed with a scalable, modular, and frontend-agnostic architecture.

## Overview

This service provides backend APIs and real-time data capabilities to support multiple client applications.

The system is designed with clear service boundaries and contract-driven APIs, enabling it to evolve into a distributed architecture if needed.

The backend is intentionally **frontend-agnostic**, allowing reuse across different types of client applications such as administrative dashboards and interactive applications.

## Goals

- Provide RESTful APIs for client applications
- Enable real-time data updates using WebSockets
- Maintain a frontend-agnostic architecture
- Ensure modular and scalable system design
- Support future system evolution

## Architecture Principles

- **Contract-Driven Design**  
  APIs and event contracts are defined independently of any specific frontend implementation.

- **Frontend-Agnostic Models**  
  Data structures are based on domain concepts, not UI requirements.

- **Modular Architecture**  
  The system is organized into domain-based modules to support scalability and maintainability.

- **Extensibility**  
  Designed to support future evolution into distributed or microservice-based architectures if required.

## Version 1 Scope ( Current Implementation)

The current version focuses on foundational user management and real-time metrics capabilities using simulated data.

### Implemented Modules

#### Users Module

Provides core user management functionality.

**Features:**

- Create, update, and delete users
- Fetch users with:
  - Backend-driven pagination
  - Sorting support
  - Search filtering
- Optional pagination support (used internally for metrics calculations)
- Real-time user update notifications via WebSockets
- In-memory mock data store (no database dependency in V1)

#### Metrics Module

Provides derived metrics based on user data.

**Features:**

- REST endpoint to fetch metrics
- WebSocket support for live metric updates
- Test endpoint to simulate metric update events
- Integration with Users module data

## Real-Time Capabilities

The backend supports WebSocket-based communication to notify connected clients about data changes.

Typical use cases include:

- Updating dashboards when users are created, updated, or deleted
- Triggering live metric updates
- Keeping UI data synchronized without polling

## Pagination Support

The Users API supports backend-driven pagination.

Example Request:

GET /users?pageNumber=1&pageSize=10

Example Response:

```json
{
  "entities": [...],
  "total": 50,
  "pageNumber": 1,
  "pageSize": 10
}
```

Pagination is optional and can be bypassed internally when full datasets are required (for example, during metrics computation).

## Data Layer (V1)

The current version uses an **in-memory mock data store** to simulate persistent storage.

This approach enables:

- Faster development cycles
- Predictable test data
- Independent backend development without database setup
- Future database replacement without API redesign

### Planned Enhancements

- Database integration (PostgreSQL or equivalent)
- ORM-based persistence layer
- Data migration support

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start:dev
```

## Future Enhancements

Planned improvements include:

- Database integration
- Authentication and authorization
- Role-based access control
- Advanced metrics computation
- Performance optimization
- Logging and monitoring support

## Design Philosophy

This backend is built as a **reusable service platform**, not a single-application backend.

### Key Design Intentions

- Maintain clean domain boundaries
- Support multiple client applications
- Preserve backward compatibility
- Enable incremental architectural evolution
