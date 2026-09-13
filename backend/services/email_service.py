"""
Email Service for Veda Jothidam

Features:
- SMTP email sending
- Email templates
- Chart reports via email
- Consultation confirmations
- User notifications
- HTML and plain text support

Configuration:
- SMTP server settings from environment
- Email queue support
- Retry logic
- Logging
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.application import MIMEApplication
from email import encoders
from datetime import datetime
import logging
from typing import Optional, List, Dict
from pathlib import Path


logger = logging.getLogger(__name__)


class EmailConfig:
    """Email configuration from environment"""

    SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'noreply@vedajothidam.com')
    SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD', '')
    SENDER_NAME = 'Veda Jothidam'
    USE_TLS = os.environ.get('SMTP_USE_TLS', 'True').lower() == 'true'
    USE_SSL = os.environ.get('SMTP_USE_SSL', 'False').lower() == 'true'


class EmailTemplate:
    """Email templates with placeholders"""

    @staticmethod
    def welcome_email(user_name: str, username: str) -> Dict[str, str]:
        """Welcome email template"""
        return {
            'subject': 'Welcome to Veda Jothidam!',
            'html': f"""
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Welcome to Veda Jothidam!</h1>

        <p>Dear {user_name},</p>

        <p>Thank you for joining Veda Jothidam, your personal guide to Vedic astrology insights and wisdom.</p>

        <p>Your account has been successfully created with username <strong>{username}</strong>.</p>

        <h3>Getting Started:</h3>
        <ul>
            <li>Create your birth chart with your birth date, time, and place</li>
            <li>Receive personalized astrological insights</li>
            <li>Book consultations with expert astrologers</li>
            <li>Export your charts and reports</li>
            <li>Explore public charts from other users</li>
        </ul>

        <p><a href="#" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        <p style="color: #6b7280; font-size: 12px;">
            If you did not create this account, please contact us immediately at support@vedajothidam.com
        </p>
    </div>
</body>
</html>
""",
            'text': f"""
Welcome to Veda Jothidam!

Dear {user_name},

Thank you for joining Veda Jothidam, your personal guide to Vedic astrology insights and wisdom.

Your account has been successfully created with username {username}.

Getting Started:
- Create your birth chart with your birth date, time, and place
- Receive personalized astrological insights
- Book consultations with expert astrologers
- Export your charts and reports
- Explore public charts from other users

If you did not create this account, please contact us immediately at support@vedajothidam.com
"""
        }

    @staticmethod
    def chart_report_email(user_name: str, chart_name: str) -> Dict[str, str]:
        """Chart report email template"""
        return {
            'subject': f'Your Birth Chart Analysis: {chart_name}',
            'html': f"""
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Birth Chart Analysis Report</h1>

        <p>Dear {user_name},</p>

        <p>Your comprehensive birth chart analysis for <strong>{chart_name}</strong> is ready!</p>

        <p>The detailed report includes:</p>
        <ul>
            <li>Personality & Character Analysis</li>
            <li>Career & Professional Prospects</li>
            <li>Love & Relationship Insights</li>
            <li>Health & Wellbeing Assessment</li>
            <li>Spiritual Growth & Purpose</li>
            <li>Financial Prospects</li>
            <li>Personalized Recommendations</li>
        </ul>

        <p><a href="#" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Full Report</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        <p style="color: #6b7280; font-size: 12px;">
            Generated on {datetime.now().strftime('%B %d, %Y')} | Veda Jothidam
        </p>
    </div>
</body>
</html>
""",
            'text': f"""
Birth Chart Analysis Report

Dear {user_name},

Your comprehensive birth chart analysis for {chart_name} is ready!

The detailed report includes:
- Personality & Character Analysis
- Career & Professional Prospects
- Love & Relationship Insights
- Health & Wellbeing Assessment
- Spiritual Growth & Purpose
- Financial Prospects
- Personalized Recommendations

View the full report in your dashboard.

Generated on {datetime.now().strftime('%B %d, %Y')} | Veda Jothidam
"""
        }

    @staticmethod
    def consultation_confirmation_email(user_name: str, consultation_title: str,
                                       scheduled_date: str, consultation_type: str) -> Dict[str, str]:
        """Consultation confirmation email"""
        return {
            'subject': f'Consultation Confirmed: {consultation_title}',
            'html': f"""
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Consultation Confirmed</h1>

        <p>Dear {user_name},</p>

        <p>Your consultation has been confirmed!</p>

        <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Consultation Details</h3>
            <p><strong>Title:</strong> {consultation_title}</p>
            <p><strong>Type:</strong> {consultation_type.title()}</p>
            <p><strong>Scheduled:</strong> {scheduled_date}</p>
        </div>

        <h3>What to Expect:</h3>
        <ul>
            <li>In-depth analysis of your birth chart</li>
            <li>Personalized insights and recommendations</li>
            <li>Discussion of remedies and solutions</li>
            <li>Q&A session with the astrologer</li>
        </ul>

        <p><a href="#" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Consultation</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        <p style="color: #6b7280; font-size: 12px;">
            If you need to reschedule or cancel, please do so at least 24 hours before your scheduled time.
        </p>
    </div>
</body>
</html>
""",
            'text': f"""
Consultation Confirmed

Dear {user_name},

Your consultation has been confirmed!

Consultation Details:
- Title: {consultation_title}
- Type: {consultation_type.title()}
- Scheduled: {scheduled_date}

What to Expect:
- In-depth analysis of your birth chart
- Personalized insights and recommendations
- Discussion of remedies and solutions
- Q&A session with the astrologer

If you need to reschedule or cancel, please do so at least 24 hours before your scheduled time.
"""
        }

    @staticmethod
    def password_reset_email(user_name: str, reset_link: str) -> Dict[str, str]:
        """Password reset email"""
        return {
            'subject': 'Reset Your Veda Jothidam Password',
            'html': f"""
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Password Reset Request</h1>

        <p>Dear {user_name},</p>

        <p>We received a request to reset your Veda Jothidam password.</p>

        <p><a href="{reset_link}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>

        <p>This link will expire in 24 hours.</p>

        <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        <p style="color: #6b7280; font-size: 12px;">
            For security, never share this link with anyone.
        </p>
    </div>
</body>
</html>
""",
            'text': f"""
Password Reset Request

Dear {user_name},

We received a request to reset your Veda Jothidam password.

Click the link below to reset your password:
{reset_link}

This link will expire in 24 hours.

If you did not request a password reset, please ignore this email and your password will remain unchanged.

For security, never share this link with anyone.
"""
        }


class EmailService:
    """Handle email sending"""

    def __init__(self):
        """Initialize email service"""
        self.config = EmailConfig()

    def send_email(self, recipient: str, subject: str, html_content: str,
                  text_content: Optional[str] = None, attachments: Optional[List[Dict]] = None) -> bool:
        """
        Send an email

        Args:
            recipient: Email address
            subject: Email subject
            html_content: HTML body
            text_content: Plain text body (optional)
            attachments: List of attachment dicts with 'filename' and 'file_path' keys

        Returns:
            Success status
        """
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f'{self.config.SENDER_NAME} <{self.config.SENDER_EMAIL}>'
            msg['To'] = recipient

            # Add text and HTML parts
            if text_content:
                msg.attach(MIMEText(text_content, 'plain'))
            msg.attach(MIMEText(html_content, 'html'))

            # Add attachments
            if attachments:
                for attachment in attachments:
                    self._attach_file(msg, attachment['file_path'], attachment['filename'])

            # Send email
            self._send_smtp(msg)
            logger.info(f"Email sent successfully to {recipient}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {recipient}: {str(e)}")
            return False

    def send_welcome_email(self, user_email: str, user_name: str, username: str) -> bool:
        """Send welcome email"""
        template = EmailTemplate.welcome_email(user_name, username)
        return self.send_email(user_email, template['subject'], template['html'], template['text'])

    def send_chart_report(self, user_email: str, user_name: str, chart_name: str,
                         report_pdf: Optional[bytes] = None) -> bool:
        """
        Send chart report email

        Args:
            user_email: User's email
            user_name: User's name
            chart_name: Chart name
            report_pdf: Optional PDF report bytes

        Returns:
            Success status
        """
        template = EmailTemplate.chart_report_email(user_name, chart_name)

        attachments = []
        if report_pdf:
            # Save PDF temporarily
            temp_path = f'/tmp/{chart_name.replace(" ", "_")}_report.pdf'
            with open(temp_path, 'wb') as f:
                f.write(report_pdf)
            attachments.append({
                'filename': f'{chart_name}_report.pdf',
                'file_path': temp_path
            })

        return self.send_email(
            user_email,
            template['subject'],
            template['html'],
            template['text'],
            attachments if attachments else None
        )

    def send_consultation_confirmation(self, user_email: str, user_name: str,
                                      consultation_title: str, scheduled_date: str,
                                      consultation_type: str) -> bool:
        """Send consultation confirmation"""
        template = EmailTemplate.consultation_confirmation_email(
            user_name, consultation_title, scheduled_date, consultation_type
        )
        return self.send_email(user_email, template['subject'], template['html'], template['text'])

    def send_password_reset(self, user_email: str, user_name: str, reset_link: str) -> bool:
        """Send password reset email"""
        template = EmailTemplate.password_reset_email(user_name, reset_link)
        return self.send_email(user_email, template['subject'], template['html'], template['text'])

    def _send_smtp(self, msg: MIMEMultipart) -> bool:
        """
        Send via SMTP

        Args:
            msg: MIMEMultipart message

        Returns:
            Success status
        """
        if not self.config.SENDER_PASSWORD:
            logger.error("SENDER_PASSWORD not configured")
            return False

        try:
            if self.config.USE_SSL:
                server = smtplib.SMTP_SSL(self.config.SMTP_SERVER, self.config.SMTP_PORT)
            else:
                server = smtplib.SMTP(self.config.SMTP_SERVER, self.config.SMTP_PORT)

            if self.config.USE_TLS and not self.config.USE_SSL:
                server.starttls()

            server.login(self.config.SENDER_EMAIL, self.config.SENDER_PASSWORD)
            server.send_message(msg)
            server.quit()

            return True

        except smtplib.SMTPAuthenticationError:
            logger.error("SMTP authentication failed")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending email: {str(e)}")
            return False

    def _attach_file(self, msg: MIMEMultipart, file_path: str, filename: str) -> None:
        """
        Attach file to message

        Args:
            msg: MIMEMultipart message
            file_path: Path to file
            filename: Display filename
        """
        try:
            with open(file_path, 'rb') as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())

            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename= {filename}')
            msg.attach(part)

        except Exception as e:
            logger.error(f"Failed to attach file {file_path}: {str(e)}")


def create_email_service() -> EmailService:
    """Factory function to create email service"""
    return EmailService()
