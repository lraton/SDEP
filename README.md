# Distributed and Parallel Systems Project — UNIPG 2023/2024

It was created for the *Sistemi Distribuiti e Paralleli* project (2023/2024) by **Filippo Notari / Niccolò Tittarelli**.

**Authors:**
- Filippo Notari (ID 330606)
- Nicolò Tittarelli (ID 341487)

## Project Description

The goal of this project is to design and implement a **distributed web service** for the **sale of cars and car parts**, supporting two user types:

- **Providers** – users who offer cars or spare parts
- **Consumers** – users who search and purchase items

### Objectives Met

- RESTful web service with Node.js and Express  
- Real-time communication via Socket.IO  
- Persistent data storage using MySQL  
- Docker-based containerized deployment  
- Complete documentation and code commentary

---

## How to Run the Project Locally

Make sure you have Docker and Docker Compose installed.

## Start the Application

sudo docker-compose up -d

## View Logs

sudo docker-compose logs --follow

## Stop the Application

sudo docker-compose down -v

## Load the Database

To initialize the application with data, import the `sdep_adminer.sql` file into your MySQL container.

You can do this via Adminer (accessible through the container) or using any MySQL client of your choice.

---

## Features

| Feature                          | Status     | Responsible          |
|----------------------------------|------------|-----------------------|
| Home Page                        | Done       | Filippo               |
| Dynamic Pages (Cars & Parts)     | Done       | Filippo               |
| Footer Fix                       | Done       | Filippo               |
| Database Integration             | Done       | Filippo               |
| REST POST Endpoint for Cars      | Done       | Nicolò                |
| REST POST Endpoint for Parts     | Done       | Nicolò                |
| Cookie-Based Session Management  | Done       | Nicolò, Filippo       |
| Upload Page (Frontend)           | Done       | Filippo               |
| Upload Handler (Server Side)     | Done       | Nicolò                |

---

## Technologies Used

- Node.js + Express  
- Socket.IO  
- MySQL  
- Docker + Docker Compose  
- HTML, CSS, JavaScript

---

## Documentation Provided

- In-code comments and explanations  
- Written description of system architecture  
- Slide presentation for project overview  
- Complete submission package for UniStudium

---

## Notes

This project demonstrates the key principles of distributed systems, RESTful API design, real-time socket communication, and service orchestration using Docker.

Intended for academic and educational use.
