import smtplib
import os
from email.message import EmailMessage
from datetime import datetime


def send_parent_alert_email(
    parent_email: str,
    child_name: str,
    latitude: float,
    longitude: float,
):
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")

    if not EMAIL_USER or not EMAIL_PASS:
        print("Email credentials not set.")
        return

    msg = EmailMessage()
    msg["Subject"] = "StudyBuddy Alert Notification"
    msg["From"] = EMAIL_USER
    msg["To"] = parent_email

    current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    msg.set_content(
        f"""
Dear Parent,

This is to inform you that your child, {child_name}, has exceeded the allowed distraction limit during their study session.

The session was automatically terminated.

Time: {current_time}
Location:
Latitude: {latitude}
Longitude: {longitude}

We recommend checking in with your child to ensure focused study behavior.

Regards,
StudyBuddy Monitoring System
"""
    )

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        print("Email sent successfully.")
    except Exception as e:
        print("Email sending failed:", str(e))
