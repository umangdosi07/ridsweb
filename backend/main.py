from fastapi import FastAPI

from routers.donations import router as donations_router
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.programs import router as programs_router

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

app.include_router(donations_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(programs_router, prefix="/api")
