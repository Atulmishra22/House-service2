from celery import shared_task
import flask_excel
from backend.model import ServiceRequest
from backend.celery.mail_service import send_email


@shared_task()
def create_csv():
    service_requests = ServiceRequest.query.filter_by(service_status="closed").all()

    column_names = [column.name for column in ServiceRequest.__table__.columns]

    if service_requests:
        csv_file = flask_excel.make_response_from_query_sets(
            service_requests, column_names=column_names, file_type="csv"
        )
    else:
        csv_file = flask_excel.make_response_from_query_sets(
            [[]],column_names=column_names, file_type="csv"
        )

    with open("./backend/celery/csv_files/closed_service_request.csv", "wb") as file:
        file.write(csv_file.data)
    
    return "closed_service_request.csv"


@shared_task(ignore_result=True)
def email_remainder(to, subject, content):
    send_email(to, subject, content)



