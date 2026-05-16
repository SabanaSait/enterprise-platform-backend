# Enterprise Platform Backend

Backend platform service for the Enterprise Admin Platform, designed with a scalable, modular, and frontend-agnostic architecture.

## Overview

This service provides backend APIs, real-time data capabilities, and an AI-powered copilot layer to support modern enterprise applications.

The system is designed with clear service boundaries and contract-driven APIs, enabling it to evolve into a distributed architecture if needed.

The backend is intentionally **frontend-agnostic**, allowing reuse across different client applications such as administrative dashboards and AI-driven interfaces.

## Key Highlights

- RESTful APIs for enterprise data management
- Real-time updates using WebSockets
- AI Copilot with **LLM-powered tool calling**
- Modular, scalable architecture

## Tech Stack

- Node.js (v20.20.2)
- TypeScript (v5.9.3)
- NestJS (v11.0.16)

## Goals

- Provide reliable backend APIs for client applications
- Enable real-time, event-driven data updates
- Integrate AI capabilities using a tool-based architecture
- Maintain a clean, modular, and scalable system design
- Support future evolution into distributed systems

## Architecture Principles

- **Contract-Driven Design**  
  APIs and event contracts are defined independently of any specific frontend.

- **Frontend-Agnostic Models**  
  Data structures are based on domain concepts, not UI requirements.

- **Modular Architecture**  
  Organized into domain-based modules for scalability and maintainability.

- **Extensibility**  
  Designed to evolve into microservices or distributed systems.

## AI Copilot

The backend includes an AI Copilot layer that enables natural language interaction with system data using LLM-powered tool execution.

### Features

- LLM-powered query handling
- Intelligent tool selection layer
- Structured tool execution (e.g., metrics fetching)
- Streaming responses for real-time UX
- Context-aware conversation handling

### Architecture

User Query  
↓  
LLM (Tool Decision)  
↓  
Tool Registry  
↓  
Backend Services (Metrics, Users)  
↓  
LLM (Response Generation)  
↓  
Streaming Response to Client

### Example Use Cases

- "Show me dashboard metrics"
- "How many active users are there?"
- "Which user group is largest?"

## Version 1 Scope (Current Implementation)

The current version focuses on:

- User management (with pagination, sorting, and filtering)
- Real-time metrics
- AI-assisted querying
- Simulated data layer (in-memory)

## Real-Time Capabilities

Supports WebSocket-based communication for live updates.

### Use Cases

- Live dashboard updates
- Event-driven UI refresh
- Eliminates polling

## Data Layer (V1)

Uses an **in-memory mock data store**.

### Benefits

- Fast development
- No database setup required
- Predictable test data
- Easy future replacement

## Future Enhancements

- Database integration (PostgreSQL)
- Authentication and authorization
- Role-based access control (RBAC)
- Advanced metrics computation
- Observability (logging and monitoring)
- Persistent memory for AI Copilot
- Multi-tool orchestration

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start:dev
```

## Design Philosophy

This backend is built as a **reusable platform service**, not a single-application backend.

### Core Intentions

- Maintain strong domain boundaries
- Support multiple client applications
- Ensure backward compatibility
- Enable incremental evolution
- Integrate AI as a first-class capability

## Why This Project Stands Out

- Combines traditional backend architecture with modern AI patterns
- Implements **LLM-based tool calling (agent-like behavior)**
- Supports real-time + streaming user experiences
- Maintains clean separation (LLM ↔ Tools ↔ Services)
