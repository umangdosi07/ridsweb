from fastapi import FastAPI

from routers.donations import router as donations_router

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

# add ONLY donations router
app.include_router(donations_router, prefix="/api")
