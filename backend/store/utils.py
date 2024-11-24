from django.template.loader import render_to_string
from io import BytesIO
from django.core.mail import EmailMessage
from django.conf import settings
from django.utils.html import strip_tags
from rest_framework.response import Response
"""
def generate_invoice(order):
    # Render the invoice template with order data
    html_string = render_to_string('invoice_template.html', {'order': order})
    
    # Convert HTML to PDF
    html = HTML(string=html_string)
    pdf_file = BytesIO()
    html.write_pdf(target=pdf_file)
    pdf_file.seek(0)  # Reset pointer to the beginning of the file
    return pdf_file
"""


def send_order_confirmation_email(order):
    # Generate the invoice PDF
    #invoice_pdf = generate_invoice(order)
    return Response("111")

    # Prepare the email content
    #subject = f'Your Order #{order.id} - Invoice'
    message = render_to_string('order_confirmation_email.html', {'order': order})
    plain_message = strip_tags(message)  # Plain text version of the email
    return Response(order.customer.email, "mess1}, status=status.HTTP_200_OK")
    # Create the email with an attachment
    email = EmailMessage(
        #subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [order.customer.email],  # Send to the customer's email
    )
    
    # Attach the invoice PDF
    #email.attach(f'Invoice_{order.id}.pdf', invoice_pdf.read(), 'application/pdf')

    # Send the email
    email.send()
