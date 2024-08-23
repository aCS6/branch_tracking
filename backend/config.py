from functools import lru_cache
from pydantic_settings import BaseSettings

# Define settings class
class Settings(BaseSettings):
    MONGO_URI: str
    SECRET_KEY: str


    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

# Create a cached settings function
@lru_cache(maxsize=None)
def get_settings() -> Settings:
    return Settings()
