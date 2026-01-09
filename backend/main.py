from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ===================== ROUTERS =====================
from routers.donations import router as donations_router
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.programs import router as programs_router
from routers.inquiries import router as inquiries_router
from routers.volunteers import router as volunteers_router

# ===================== APP =====================
app = FastAPI(title="RIDS Backend")

# ===================== CORS =====================
# Required for:
# - Public website
# - Admin panel
# - Razorpay
# - Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # public + admin
    allow_credentials=False,      # IMPORTANT for Vercel
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== HEALTH CHECK =====================
@app.get("/")
def root():
    return {"status": "ok"}

# ===================== API ROUTERS =====================
API_PREFIX = "/api"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(users_router, prefix=API_PREFIX)
app.include_router(programs_router, prefix=API_PREFIX)
app.include_router(donations_router, prefix=API_PREFIX)
app.include_router(inquiries_router, prefix=API_PREFIX)
app.include_router(volunteers_router, prefix=API_PREFIX)
