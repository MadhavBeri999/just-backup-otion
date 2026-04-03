from fastapi import FastAPI
from dotenv import load_dotenv

# Load .env FIRST — before any route imports that read env vars
load_dotenv()

from app.database.db import engine
from app.database.models import Base
from app.routes import parent_routes
from app.routes import child_routes
from app.routes import task_routes
from app.routes import session_routes
from app.routes import analytics_routes
from app.routes.ai import router as ai_router
from app.routes.costudy_ws import router as costudy_router
from app.routes.report_routes import router as report_router


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(parent_routes.router)

app.include_router(child_routes.router)

app.include_router(ai_router)


app.include_router(task_routes.router)
app.include_router(session_routes.router)
app.include_router(analytics_routes.router)
app.include_router(costudy_router)
app.include_router(report_router)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Study Buddy Backend Running 🚀"}
