# Blog Moderation Application

This project is a small event-driven blog application built with React and Node.js microservices. Users can create posts and comments, and comments now pass through a moderation service before they are shown as approved or rejected.

## Services

| Service | Port | Purpose |
| --- | ---: | --- |
| `client` | `3000` | React UI for creating posts and comments |
| `posts` | `4000` | Stores posts and publishes `PostCreated` events |
| `comments` | `4001` | Stores comments, marks new comments as `pending`, and publishes comment events |
| `query` | `4002` | Builds the read model used by the React app |
| `moderation` | `4003` | Reviews new comments and publishes moderation results |
| `event-bus` | `4005` | Broadcasts events to all backend services |

All backend services keep data in memory. Restarting a service clears its local state.

## Event Flow

1. The client creates a post through the `posts` service.
2. `posts` emits a `PostCreated` event to the event bus.
3. `query` receives the event and stores the post for reads.
4. The client creates a comment through the `comments` service.
5. `comments` stores the comment with `pending` status and emits `CommentCreated`.
6. `moderation` receives `CommentCreated` and checks the comment content.
7. Comments containing `horse` are rejected; all other comments are approved.
8. `moderation` emits `CommentModerated`.
9. `comments` updates the stored comment and emits `CommentUpdated`.
10. `query` updates the read model so the client can show the final comment status.

## Requirements

- Node.js
- npm

## Install Dependencies

Install dependencies in each service directory:

```powershell
cd posts
npm install

cd ..\comments
npm install

cd ..\query
npm install

cd ..\moderation
npm install

cd ..\event-bus
npm install

cd ..\client
npm install
```

## Run the Application

Start each service in a separate terminal:

```powershell
cd event-bus
npm start
```

```powershell
cd posts
npm start
```

```powershell
cd comments
npm start
```

```powershell
cd query
npm start
```

```powershell
cd moderation
npm start
```

```powershell
cd client
npm start
```

Open the client at:

```text
http://localhost:3000
```

## API Summary

### Posts Service

- `GET http://localhost:4000/posts`
- `POST http://localhost:4000/posts`

Example body:

```json
{
  "title": "My post title"
}
```

### Comments Service

- `GET http://localhost:4001/posts/:id/comments`
- `POST http://localhost:4001/posts/:id/comments`

Example body:

```json
{
  "content": "My comment"
}
```

### Query Service

- `GET http://localhost:4002/posts`

The React app reads from this endpoint because it contains posts and comments combined into one read model.

## Moderation Rules

The moderation service checks every `CommentCreated` event.

- If the comment contains `horse`, the comment status becomes `rejected`.
- Otherwise, the comment status becomes `approved`.
- While moderation is in progress, the client displays the comment as awaiting moderation.

## Notes

- The services communicate through HTTP and the local event bus.
- There is no database in this version.
- The event bus does not persist or replay events.
- If a service is offline when an event is published, that service can miss the event.
