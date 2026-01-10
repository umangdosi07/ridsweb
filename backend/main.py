from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.programs import router as programs_router
from routers.inquiries import router as inquiries_router
from routers.volunteers import router as volunteers_router
from routers.donations import router as donations_router
from routers.export import router as export_router

app = FastAPI(title="RIDS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok"}

API_PREFIX = "/api"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(users_router, prefix=API_PREFIX)
app.include_router(programs_router, prefix=API_PREFIX)
app.include_router(inquiries_router, prefix=API_PREFIX)
app.include_router(volunteers_router, prefix=API_PREFIX)
app.include_router(donations_router, prefix=API_PREFIX)
app.include_router(export_router, prefix=API_PREFIX)
