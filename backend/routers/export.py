from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from auth import get_current_user
from db import get_db
import csv
import io

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/donations")
async def export_donations(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.donations.find({})

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "ID", "Name", "Email", "Phone",
        "Amount", "Type", "Status",
        "Razorpay Order ID", "Created At"
    ])

    async for d in cursor:
        writer.writerow([
            d.get("id"),
            d.get("name"),
            d.get("email"),
            d.get("phone"),
            d.get("amount"),
            d.get("type"),
            d.get("status"),
            d.get("razorpay_order_id"),
            d.get("created_at"),
        ])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=donations.csv"
        }
    )
