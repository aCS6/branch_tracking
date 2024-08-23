from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.user.router import user_router
from app.todos.router import todo_router
from app.branch_tracking.router import branch_track_router

import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Use a list of specific origins in production.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods. Customize as needed.
    allow_headers=["*"],  # Allows all headers. Customize as needed.
)


# Include the routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(todo_router, prefix="/todos", tags=["Todos"])
app.include_router(branch_track_router, prefix="/branch_track", tags=["Branch Track"])


if __name__ == "__main__":
    # Run the app using uvicorn when the script is executed directly
    uvicorn.run(app, host="0.0.0.0", port=9000)