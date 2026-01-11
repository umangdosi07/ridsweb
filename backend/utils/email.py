import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
OFFICIAL_EMAIL = os.getenv("OFFICIAL_EMAIL")


def send_email(to_email: str, subject: str, html_content: str):
    """
    Generic email sender (safe for production).
    If SMTP is not configured, fails silently.
    """
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        return

    msg = MIMEMultipart("alternative")
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        # Never crash API because of email failure
        print("Email sending failed:", e)


def send_donation_emails(donation: dict):
    """
    Sends:
    1️⃣ Thank-you email to donor
    2️⃣ Notification email to official NGO email
    """

    # ===============================
    # 1️⃣ Donor Thank You Email
    # ===============================
    donor_html = f"""
    <div style="font-family: Arial, sans-serif">
        <h2>Thank you for your donation ❤️</h2>
        <p>Dear <b>{donation['name']}</b>,</p>

        <p>
            We sincerely thank you for your generous donation of
            <b>₹{donation['amount']}</b>.
        </p>

        <p>
            <b>Reference ID:</b> {donation['id']}<br/>
            <b>Donation Type:</b> {donation['type']}
        </p>

        <p>
            Your support helps us continue our work for rural development
            and community upliftment.
        </p>

        <br/>
        <p>Warm regards,<br/>
        <b>RIDS – Rajasthan Integrated Development Society</b></p>
    </div>
    """

    send_email(
        to_email=donation["email"],
        subject="Thank you for supporting RIDS ❤️",
        html_content=donor_html,
    )

    # ===============================
    # 2️⃣ Official NGO Notification
    # ===============================
    if OFFICIAL_EMAIL:
        official_html = f"""
        <div style="font-family: Arial, sans-serif">
            <h2>New Donation Received</h2>

            <p><b>Name:</b> {donation['name']}</p>
            <p><b>Email:</b> {donation['email']}</p>
            <p><b>Phone:</b> {donation['phone']}</p>
            <p><b>Amount:</b> ₹{donation['amount']}</p>
            <p><b>Type:</b> {donation['type']}</p>
            <p><b>Donation ID:</b> {donation['id']}</p>

            <br/>
            <p>— RIDS Website</p>
        </div>
        """

        send_email(
            to_email=OFFICIAL_EMAIL,
            subject="New Donation Received – RIDS",
            html_content=official_html,
        )
