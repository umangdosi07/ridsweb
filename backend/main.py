from fastapi import FastAPI

from routers.donations import router as donations_router
from routers.auth import router as auth_router

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

app.include_router(donations_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
