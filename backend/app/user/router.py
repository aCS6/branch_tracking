
from models import user_collection
from app.user.schemas import User, UserInDB, CurrentUser
from fastapi import HTTPException
from utils import get_current_user, hash_password, verify_password, create_access_token
from pydantic import EmailStr
from fastapi import APIRouter,Depends

user_router = APIRouter()

# Helper function to get user by username
async def get_user(username: str):
    user = user_collection.find_one({"username": username})

    if user:
        db_user = UserInDB(
            hashed_password=user.get("hashed_password"),
            username=user.get("username"),
            email=user.get("email"),
            id=str(user.get("_id", "")),
        )
        print(db_user)
        return db_user
    return None

# Sign-up route
@user_router.post("/signup")
async def signup(user: User):
    if user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = hash_password(user.password)
    user_collection.insert_one({"username": user.username, "email": user.email, "hashed_password": hashed_password})
    return {"msg": "User created"}

# Sign-in route
@user_router.post("/signin")
async def signin(user: User):
    db_user = await get_user(user.username)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    data = CurrentUser(
        id = db_user.id,
        username = db_user.username,
        email= db_user.email,
    )
    access_token = create_access_token(data=data.model_dump())
    return {"access_token": access_token, "token_type": "bearer"}

# Password reset route (simple example)
@user_router.post("/forget-password")
async def forget_password(email: EmailStr):
    user = user_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # This is a placeholder for the real password reset process
    # For a real-world application, send a reset email here
    return {"msg": "Password reset instructions sent to your email"}

# Protected route example
@user_router.get("/protected")
async def protected_route(payload: dict = Depends(get_current_user)):
    return {"msg": "This is a protected route", "user": payload.username}
