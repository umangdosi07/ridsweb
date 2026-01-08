from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.donations import router as donations_router
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.programs import router as programs_router
from routers.inquiries import router as inquiries_router   # ✅ ADD THIS

app = FastAPI(title="RIDS Backend")

# ======================================================
# ✅ CORS — FINAL, WORKING CONFIG
# ======================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Public website + admin panel
    allow_credentials=False,      # IMPORTANT for Vercel + browsers
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# ROOT HEALTH CHECK
# ======================================================
@app.get("/")
def root():
    return {"status": "ok"}

# ======================================================
# API ROUTERS
# ======================================================
API_PREFIX = "/api"

app.include_router(donations_router, prefix=API_PREFIX)
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(users_router, prefix=API_PREFIX)
app.include_router(programs_router, prefix=API_PREFIX)
app.include_router(inquiries_router, prefix=API_PREFIX)   # ✅ REQUIRED
