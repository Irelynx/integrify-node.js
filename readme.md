# **Todo API** (NodeJS Integrify assignment task)

## Used technologies

* Node.js
* Express (HTTP server)
  * Compression
  * CORS (security)
  * Helmet (security)
  * Morgan (logging)
* TypeScript
* Prisma (Database ORM)
* Zod (Validation library)
* PostgreSQL (Database)

## How to start

1. Install dependencies
    ```bash
    npm install
    # or one of these
    yarn install
    pnpm install
    ```
1. Create `.env` file and fill it with your data
    | ENV name | example | default | description
    | - | - | - | - |
    | `DATABASE_URL` | `postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public` | none | PostgreSQL Database connection URL |
    | `SHADOW_DATABASE_URL` | `postgresql://johndoe:randompassword@localhost:5432/mydb_shadow?schema=public` | none | PostgreSQL Database connection URL for [Shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database) |
    | `NODE_ENV` | `production` | `development` | NodeJS execution environment (production, development or testing)
    | `LISTEN_HOST` | `0.0.0.0` | `0.0.0.0` | Listen on hostname/IP address
    | `LISTEN_PORT` | `8080` | `8080` | Listen HTTP port |
    | `APP_JWT_KEY` | `YOUR_SECRET_KEY` | `JWT_KEY` | JsonWebToken Secret key |
1. Start application
    ```bash
    npm run start
    # or 
    yarn start
    pnpm start
    ```

## **Task**

> [Notion link](https://integrify-academy.notion.site/NodeJS-assignment-91f30b7a91084f8aab5e9112fa971d4d)

### **Introduction**

The purpose of this assignment is to evaluate the knowledge and experience working with Node.js for Web development

- **Language**: JavaScript (or TypeScript)
- **Framework**: ExpressJS, NestJS or vanilla NodeJS
- **Database**: PostgreSQL

### **Requirements**

You’re tasked to develop the backend for a personal TODO application that requires users to be logged in before they can call the APIs. One user can create multiple todo items and one todo item can only belong to a single user. The data model of a todo item & user is as follows:

**Todo**:

- Id: Unique identifier
- Name: Name of the todo item
- Description (*optional*): Description of the toto item
- User id: Id of the user who owns this todo item
- Created timestamp: When the item is created
- Updated timestamp: When the item is last updated
- Status: An enum of either: `NotStarted`, `OnGoing`, `Completed`

**User**:

- Id: Unique identifier
- Email: Email address
- Password: Hash of the password
- Created timestamp: When the user is created
- Updated timestamp: When the user is last updated

### **Core features**

Develop a backend application that exposes a set of REST APIs for the following endpoints:

- **POST** */api/v1/signup*: Sign up as an user of the system, using email & password
- **POST** */api/v1/signin*: Sign in using email & password. The system will return the JWT token that can be used to call the APIs that follow
- **PUT** */api/v1/changePassword*: Change user’s password
- **GET** */api/v1/todos?status=[status]*: Get a list of todo items. Optionally, a status query param can be included to return only items of specific status. If not present, return all items
- **POST** */api/v1/todos*: Create a new todo item
- **PUT** */api/v1/todos/:id*: Update a todo item
- **DELETE** */api/v1/todos/:id*: Delete a todo item

### **Code structure**

Put the code in an idiomatic structure that follows the best practices of the chosen framework. Document how to run the code clearly in the README file and then put the code into a Github repository

### **Optional**

- Write the unit tests as you see fit using the idiomatic way of the chosen framework
- Package the backend into a Docker container. You can use Docker compose as well to run both the web server and database server

---

## Checklist

* [x] Project initialization
  * [x] Express (API) with TypeScript
  * [x] Prisma (DB ORM)
  * [ ] Jest (testing library)
* [x] Database init
  * [x] Users
  * [x] Todos
* [x] Routes (`/api/v1`)
  * [x] User related endpoints:
    * [x] POST `/signup`
    * [x] POST `/signin`
    * [x] PUT `/changePassword`
  * [x] `/todos`
    * [x] GET `/` (with `status` filter)
    * [x] POST `/`
    * [x] PUT `/:id`
    * [x] DELETE `/:id`
* [ ] Testing
  * [ ] User related endpoints:
    * [ ] POST `/signup`
    * [ ] POST `/signin`
    * [ ] PUT `/changePassword`
  * [ ] `/todos`
    * [ ] GET `/` (with `status` filter)
    * [ ] POST `/`
    * [ ] PUT `/:id`
    * [ ] DELETE `/:id`
  * [ ] JWT basic security tests
  * [ ] Other
* [ ] Documentation
  * [x] Project about
  * [ ] How to run
* [ ] Dockerize
* [ ] GitHub CI/CD badges