import smtplib
import logging
from email.message import EmailMessage
from datetime import datetime, timedelta

EMAIL_USER = "berimadhav911@gmail.com"
EMAIL_PASS = "sgpp yzgy vcyo pjwk"

def build_google_maps_link(lat: float, lng: float) -> str:
    if lat is not None and lng is not None:
        return f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"
    return "Location permissions were completely denied by the user."

def send_success_email(parent_email: str, child_name: str, task_name: str, lat: float = None, lng: float = None):
    try:
        msg = EmailMessage()
        msg["Subject"] = f"🟢 Task Completed Successfully: {child_name}"
        msg["From"] = f"Padhle Bhai!! <{EMAIL_USER}>"
        msg["To"] = parent_email

        current_time = (datetime.utcnow() + timedelta(hours=5, minutes=30)).strftime("%I:%M %p IST on %d %b %Y")
        location_text = build_google_maps_link(lat, lng)

        msg.set_content(
            f"""Dear Parent,

We are thrilled to inform you that your child has successfully completed their assigned task: "{task_name}".

Child's Name: {child_name}
They showed great focus and dedication to successfully finish this module.

Task Completion Time: {current_time}

📍 Verified Final Location: 
{location_text}

You can always check out {child_name}'s daily analysis and detailed progress reports on the Padhle Bhai!! App.

Thanks for using Padhle Bhai!!

Regards,
Padhle Bhai Focus Team
"""
        )

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        print(f"✅ [email_service] Success Email dispatched successfully to {parent_email}")
    except Exception as e:
        print(f"❌ [email_service] Success Email sending failed: {str(e)}")

def send_failure_email(parent_email: str, child_name: str, task_name: str, minutes_spent: int, lat: float = None, lng: float = None):
    try:
        msg = EmailMessage()
        msg["Subject"] = f"🔴 IMMEDIATE ATTENTION: {child_name} Left Session Early"
        msg["From"] = f"Padhle Bhai!! <{EMAIL_USER}>"
        msg["To"] = parent_email

        current_time = (datetime.utcnow() + timedelta(hours=5, minutes=30)).strftime("%I:%M %p IST on %d %b %Y")
        location_text = build_google_maps_link(lat, lng)

        msg.set_content(
            f"""Dear Parent,

This is a strict notification to inform you that your child DID NOT complete their assigned task: "{task_name}".

Child's Name: {child_name}
They either exceeded our distraction limit, left the app deliberately, or accepted defeat after studying for only {minutes_spent} minutes.

This incident requires your immediate attention to ensure they stay on track.

Termination Time: {current_time}

📍 Verified Incident Location: 
{location_text}

You can check your child's daily analysis and see what caused this alert in the Padhle Bhai!! App.

Thanks for using Padhle Bhai!!

Regards,
Padhle Bhai Monitoring System
"""
        )

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        print(f"✅ [email_service] Failure Alert Email dispatched successfully to {parent_email}")
    except Exception as e:
        print(f"❌ [email_service] Failure Alert Email sending failed: {str(e)}")
