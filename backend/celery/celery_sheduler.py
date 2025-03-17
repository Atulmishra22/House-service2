from datetime import datetime, timedelta
from celery.schedules import crontab
from flask import current_app as app
import pytz
from sqlalchemy import func
from backend.celery.tasks import email_remainder
from backend.model import ServiceRequest, Professional, db, Users


celery_app = app.extensions["celery"]


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    sender.add_periodic_task(
        crontab(hour=6, minute=00),
        service_request_reminder_emails.s(),
        name="daily_remainder",
    )
    sender.add_periodic_task(
        crontab(day_of_month=1, hour=13, minute=0),
        send_monthly_service_reports.s(),
        name="monthly_report",
    )


@celery_app.task
def service_request_reminder_emails():
    # Query professionals with pending service requests and count their requests
    professionals_with_counts = (
        db.session.query(
            Professional.id,
            Professional.email,
            Professional.name,
            func.count(ServiceRequest.id).label("request_count"),
        )
        .join(ServiceRequest, Professional.id == ServiceRequest.professional_id)
        .filter(ServiceRequest.service_status == "requested")
        .group_by(Professional.id, Professional.email, Professional.name)
        .all()
    )

    # Send personalized emails to each professional
    for prof_id, email, name, count in professionals_with_counts:
        email_subject = f"Action Required: {count} Pending Service Request(s)"

        email_body = f"""
        <html>
        <body>
            <h2>Hello {name},</h2>
            <p>You have {count} pending service request(s) that require your attention.</p>
            <p>Please login to your account to accept or reject these service requests.</p>
            <a href="http://127.0.0.1:5000/#/login" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Login Now</a>
            <p>Thank you for your prompt attention to this matter.</p>
        </body>
        </html>
        """

        # Send the email
        email_remainder.delay(email, email_subject, email_body)


@celery_app.task
def send_monthly_service_reports():

    tz = pytz.timezone("Asia/Kolkata")
    today = datetime.now(tz)

    first_day_of_current_month = today.replace(day=1)
    last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)
    first_day_of_previous_month = last_day_of_previous_month.replace(day=1)

    month_name = first_day_of_previous_month.strftime("%B %Y")

    customers = db.session.query(Users).filter(Users.roles.any(name="customer")).all()

    for customer in customers:

        status_counts = (
            db.session.query(
                ServiceRequest.service_status,
                func.count(ServiceRequest.id).label("count"),
            )
            .filter(
                ServiceRequest.customer_id == customer.id,
                ServiceRequest.date_of_request >= first_day_of_previous_month,
                ServiceRequest.date_of_request <= last_day_of_previous_month,
            )
            .group_by(ServiceRequest.service_status)
            .all()
        )

        # Convert to a dictionary for easier access
        status_dict = {status: count for status, count in status_counts}

        # Get counts for each status (default to 0 if not present)
        requested_count = status_dict.get("requested", 0)
        accepted_count = status_dict.get("accepted", 0)
        rejected_count = status_dict.get("rejected", 0)
        canceled_count = status_dict.get("canceled", 0)
        closed_count = status_dict.get("closed", 0)
        total_count = sum(status_dict.values())

        # Create email subject and body
        email_subject = f"Your Monthly Service Report for {month_name}"

        email_body = f"""
        <html>
        <body>
            <h2>Hello {customer.name},</h2>
            <p>Here is your monthly service report for {month_name}:</p>
            
            <h3>Service Summary:</h3>
            <p>Total service requests: {total_count}</p>
            <p>Requested services: {requested_count}</p>
            <p>Accepted services: {accepted_count}</p>
            <p>Rejected services: {rejected_count}</p>
            <p>Canceled services: {canceled_count}</p>
            <p>Closed services: {closed_count}</p>
            
            <p>Thank you for using our service platform!</p>
        </body>
        </html>
        """

        # Send the email
        email_remainder.delay(customer.email, email_subject, email_body)
