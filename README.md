# CS465 Full Stack Development - Travlr Getaways

## Architecture

### Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).

The **customer-facing site** was built with Express and Handlebars, which is a traditional server-side rendering model. Each page request hits an Express route, the controller fetches data from the API, and the server renders a complete HTML page before sending it to the browser. This is straightforward and works well for content-heavy, mostly static pages like the travel listings, checkout, and news pages. JavaScript on these pages is minimal and used primarily for interactive enhancements.

The **admin single-page application (SPA)** was built with Angular. Unlike the Express HTML approach, the SPA loads a single `index.html` shell and then dynamically renders all views on the client side using Angular components and routing. Navigation between the trip listing, add-trip form, edit-trip form, login, and signup views happens without full page reloads. Angular's router swaps components in and out while the URL updates. Data is fetched asynchronously from the REST API using Angular's `HttpClient`. This provides a faster, more app-like experience ideal for administrative CRUD operations where users rapidly interact with data.

The key difference is where rendering happens. Express HTML renders on the server (good for SEO, simpler initial loads), while the Angular SPA renders on the client (better interactivity, faster subsequent navigation). JavaScript on the Express side powers the backend logic, and on the Angular side drives the entire frontend application.

### Why did the backend use a NoSQL MongoDB database?

MongoDB was chosen because the trip data is naturally document-oriented. Each trip is a self-contained object with fields like `code`, `name`, `length`, `start`, `resort`, `perPerson`, `image`, `description`, and `category`. MongoDB pairs seamlessly with Mongoose for schema validation and with the Node.js/Express stack, allowing data to flow as JSON from the database through the API to the frontend without translation layers. Its flexible schema also made it easy to iterate on the data model throughout development, such as adding the `deletedAt` field for soft-delete functionality and the `category` field for trip filtering.

---

## Functionality

### How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces?

JSON (JavaScript Object Notation) is a lightweight data format. It is text that represents structured data using key-value pairs and arrays. JavaScript is a full programming language with functions and execution logic. While JSON's syntax comes from JavaScript object literals, JSON cannot contain functions, comments, or executable code.

JSON connects the entire stack of the application. The MongoDB documents are stored in a BSON format that maps to JSON. The Express API controllers send and receive JSON via `res.json()` and `req.body`. The Angular SPA's `HttpClient` sends HTTP requests and parses JSON responses into TypeScript objects. Even the JWT authentication tokens are JSON payloads encoded in Base64. This means data flows seamlessly as JSON across every layer: database → API → frontend.

### Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.

Several refactoring instances improved the codebase:

- **From static JSON to MongoDB**: The travel controller originally read trip data from a static `trips.json` file (`fs.readFileSync('./data/trips.json')`). This was refactored to make API calls to the Express REST endpoints backed by MongoDB, enabling dynamic CRUD operations.
- **JWT interceptor**: Rather than manually attaching authorization headers to every HTTP request in the Angular SPA, a reusable `JwtInterceptor` was created that automatically injects the Bearer token for all non-authentication API calls.
- **Auth guard**: Route protection was refactored from ad-hoc checks into a centralized `authGuard` that verifies login status and admin role before allowing access to protected routes.

Reusable UI components like `TripCard`, `Navbar`, `TripListing`, `AddTrip`, and `EditTrip` provide significant benefits: they enforce consistency across the interface, enable modularity so each component can be developed and tested independently, reduce code duplication since the same `TripCard` component renders each trip uniformly, and improve maintainability because changes to a component's template or logic propagate everywhere it is used.

---

## Testing

### Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security.

In a full stack application, methods refer to the HTTP verbs — GET, POST, PUT, DELETE, and PATCH — that define the type of operation performed on a resource. Endpoints are the URL paths that these methods act upon. In this project, the API endpoints include:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/trips` | Retrieve all trips (with optional filtering) |
| GET | `/api/trips/:tripCode` | Retrieve a single trip by code |
| POST | `/api/trips` | Add a new trip (authenticated) |
| PUT | `/api/trips/:tripCode` | Update an existing trip (authenticated) |
| DELETE | `/api/trips/:tripCode` | Soft-delete a trip (admin only) |
| PATCH | `/api/trips/:tripCode/restore` | Restore a soft-deleted trip (admin only) |
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate and receive a JWT |

Testing these endpoints requires verifying correct status codes, response bodies, and error handling for each method. The security layer adds complexity because endpoints like POST, PUT, DELETE, and PATCH require a valid JWT in the `Authorization` header. Testing must cover unauthenticated requests, non-admin requests to admin-only endpoints, expired tokens, and invalid tokens. Postman was used to send requests with and without authorization headers to validate that the `authenticateJWT` and `requireAdmin` middleware functions correctly protect the API while allowing legitimate access.

---

## Reflection

### How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?

This course provided hands-on experience building a complete full stack application from the ground up. I developed practical skills in the MEAN stack, learning how to architect an application with clear separation between the database layer, RESTful API, server-rendered customer site, and client-rendered admin SPA.

Key skills I developed include:
- designing and implementing RESTful APIs with proper HTTP methods and status codes
- working with MongoDB and Mongoose for data modeling and persistence
- building Angular components, services, and routing for a responsive SPA
- implementing authentication and authorization using Passport.js, JWTs, password hashing with crypto, and route guards
- writing HTTP interceptors for automatic token management
- enabling CORS for secure cross-origin communication.

Beyond specific technologies, I strengthened my understanding of software architecture patterns and security principles like never storing plain-text passwords, using environment variables for secrets, and implementing role-based access control. These are foundational skills that make me a more competitive candidate for full stack engineering roles.