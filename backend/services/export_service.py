"""
Chart Export Service

Functionality:
- Export charts to PDF
- Export charts to JSON
- Export interpretations to PDF
- Export detailed reports
- Email report delivery
- Archive generation

Formats:
- PDF with full formatting
- JSON for data backup
- HTML for email
"""

from io import BytesIO
from datetime import datetime
import json
import os
from typing import Dict, Optional, Tuple

try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
    from reportlab.lib.units import inch
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False


class ChartExporter:
    """Export charts in multiple formats"""

    def __init__(self):
        """Initialize exporter"""
        if not HAS_REPORTLAB:
            raise ImportError("reportlab not installed. Install with: pip install reportlab")

    def export_to_pdf(self, chart, interpretations: Dict, filename: Optional[str] = None) -> bytes:
        """
        Export chart with interpretations to PDF

        Args:
            chart: BirthChart model instance
            interpretations: Dict with interpretation results
            filename: Optional filename for saving

        Returns:
            PDF bytes
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)

        # Build story
        story = []
        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1f2937'),
            spaceAfter=12,
            alignment=1  # Center
        )

        section_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#374151'),
            spaceAfter=8,
            spaceBefore=8
        )

        body_style = ParagraphStyle(
            'BodyText',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            alignment=4  # Justify
        )

        # Title
        title = Paragraph(f"Birth Chart Analysis: {chart.name}", title_style)
        story.append(title)
        story.append(Spacer(1, 0.2*inch))

        # Birth Information
        birth_info_style = ParagraphStyle(
            'BirthInfo',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#4b5563')
        )

        birth_info = [
            f"<b>Birth Date:</b> {chart.birth_date.strftime('%B %d, %Y')}",
            f"<b>Birth Time:</b> {chart.birth_time.strftime('%H:%M:%S') if chart.birth_time else 'Not specified'}",
            f"<b>Birth Place:</b> {chart.birth_place}",
        ]

        for info in birth_info:
            story.append(Paragraph(info, birth_info_style))

        story.append(Spacer(1, 0.2*inch))

        # Interpretations
        for section, interpretation in interpretations.items():
            # Section heading
            section_title = section.replace('_', ' ').title()
            story.append(Paragraph(section_title, section_style))

            # Insights
            story.append(Paragraph("<b>Key Insights:</b>", body_style))
            for i, insight in enumerate(interpretation.get('insights', [])[:3], 1):
                story.append(Paragraph(f"• {insight}", body_style))

            # Challenges
            story.append(Paragraph("<b>Challenges:</b>", body_style))
            for challenge in interpretation.get('challenges', [])[:2]:
                story.append(Paragraph(f"• {challenge}", body_style))

            # Recommendations
            story.append(Paragraph("<b>Recommendations:</b>", body_style))
            for rec in interpretation.get('recommendations', [])[:3]:
                story.append(Paragraph(f"• {rec}", body_style))

            story.append(Spacer(1, 0.15*inch))

        # Footer
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=1
        )
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(
            f"Generated on {datetime.now().strftime('%B %d, %Y at %H:%M:%S')} | Veda Jothidam",
            footer_style
        ))

        # Build PDF
        doc.build(story)
        buffer.seek(0)

        # Save if filename provided
        if filename:
            with open(filename, 'wb') as f:
                f.write(buffer.getvalue())

        return buffer.getvalue()

    def export_to_json(self, chart) -> str:
        """
        Export chart as JSON

        Args:
            chart: BirthChart model instance

        Returns:
            JSON string
        """
        data = {
            'chart': {
                'id': chart.id,
                'name': chart.name,
                'birth_date': chart.birth_date.isoformat(),
                'birth_time': chart.birth_time.isoformat() if chart.birth_time else None,
                'birth_place': chart.birth_place,
                'birth_latitude': chart.birth_latitude,
                'birth_longitude': chart.birth_longitude,
                'description': chart.description,
            },
            'data': {
                'chart_data': chart.chart_data,
                'strength_data': chart.strength_data,
                'dasha_data': chart.dasha_data,
            },
            'metadata': {
                'created_at': chart.created_at.isoformat(),
                'updated_at': chart.updated_at.isoformat(),
                'last_analyzed_at': chart.last_analyzed_at.isoformat() if chart.last_analyzed_at else None,
            }
        }

        return json.dumps(data, indent=2, default=str)

    def export_interpretation_report(self, chart, interpretations: Dict) -> bytes:
        """
        Export detailed interpretation report to PDF

        Args:
            chart: BirthChart model instance
            interpretations: Dict with all interpretations

        Returns:
            PDF bytes
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.75*inch, bottomMargin=0.75*inch)
        story = []
        styles = getSampleStyleSheet()

        # Title page
        title_style = ParagraphStyle(
            'Title',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#1f2937'),
            spaceAfter=12,
            alignment=1,
            leading=36
        )

        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#6b7280'),
            alignment=1,
            spaceAfter=24
        )

        story.append(Spacer(1, 1*inch))
        story.append(Paragraph("Complete Astrological Analysis", title_style))
        story.append(Paragraph(f"Birth Chart: {chart.name}", subtitle_style))
        story.append(Spacer(1, 0.5*inch))

        # Birth details
        birth_style = ParagraphStyle(
            'BirthDetail',
            parent=styles['Normal'],
            fontSize=11,
            alignment=1,
            spaceAfter=6
        )

        story.append(Paragraph(f"<b>Born:</b> {chart.birth_date.strftime('%B %d, %Y')}", birth_style))
        if chart.birth_time:
            story.append(Paragraph(f"<b>Time:</b> {chart.birth_time.strftime('%H:%M:%S')}", birth_style))
        story.append(Paragraph(f"<b>Place:</b> {chart.birth_place}", birth_style))
        story.append(Paragraph(f"<b>Analysis Date:</b> {datetime.now().strftime('%B %d, %Y')}", birth_style))

        story.append(PageBreak())

        # Interpretation sections
        for section_key, interpretation in interpretations.items():
            section_name = section_key.replace('_', ' ').title()

            # Section heading
            section_heading = ParagraphStyle(
                'SectionHeading',
                parent=styles['Heading2'],
                fontSize=16,
                textColor=colors.HexColor('#1f2937'),
                spaceAfter=12,
                spaceBefore=12,
                borderColor=colors.HexColor('#e5e7eb'),
                borderWidth=2,
                borderPadding=8
            )

            story.append(Paragraph(section_name, section_heading))

            body_style = ParagraphStyle(
                'Body',
                parent=styles['Normal'],
                fontSize=10,
                leading=14,
                alignment=4
            )

            # Insights
            story.append(Paragraph("<b>✓ Key Insights</b>", body_style))
            for insight in interpretation.get('insights', []):
                story.append(Paragraph(f"• {insight}", body_style))
            story.append(Spacer(1, 0.1*inch))

            # Challenges
            story.append(Paragraph("<b>⚠ Challenges</b>", body_style))
            for challenge in interpretation.get('challenges', []):
                story.append(Paragraph(f"• {challenge}", body_style))
            story.append(Spacer(1, 0.1*inch))

            # Recommendations
            story.append(Paragraph("<b>→ Recommendations</b>", body_style))
            for rec in interpretation.get('recommendations', []):
                story.append(Paragraph(f"• {rec}", body_style))

            story.append(Spacer(1, 0.2*inch))

        # Build document
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()

    def get_file_size(self, data: bytes) -> str:
        """Format file size for display"""
        size = len(data)
        for unit in ['B', 'KB', 'MB']:
            if size < 1024:
                return f"{size:.1f}{unit}"
            size /= 1024
        return f"{size:.1f}GB"


class ReportGenerator:
    """Generate various reports from chart data"""

    @staticmethod
    def generate_summary_report(chart, interpretations: Dict) -> Dict[str, str]:
        """
        Generate text summary report

        Args:
            chart: BirthChart instance
            interpretations: Interpretation results

        Returns:
            Dict with report sections
        """
        report = {
            'header': f"""
BIRTH CHART ANALYSIS REPORT
Generated: {datetime.now().strftime('%B %d, %Y at %H:%M:%S')}

Chart Name: {chart.name}
Birth Date: {chart.birth_date.strftime('%B %d, %Y')}
Birth Time: {chart.birth_time.strftime('%H:%M:%S') if chart.birth_time else 'Not specified'}
Birth Place: {chart.birth_place}
""",
            'sections': {}
        }

        for section_key, interpretation in interpretations.items():
            section_name = section_key.replace('_', ' ').title()
            section_text = f"\n{section_name.upper()}\n{'='*50}\n"

            section_text += "\nKey Insights:\n"
            for insight in interpretation.get('insights', []):
                section_text += f"• {insight}\n"

            section_text += "\nChallenges:\n"
            for challenge in interpretation.get('challenges', []):
                section_text += f"• {challenge}\n"

            section_text += "\nRecommendations:\n"
            for rec in interpretation.get('recommendations', []):
                section_text += f"• {rec}\n"

            report['sections'][section_key] = section_text

        return report

    @staticmethod
    def generate_html_report(chart, interpretations: Dict) -> str:
        """
        Generate HTML report (suitable for email)

        Args:
            chart: BirthChart instance
            interpretations: Interpretation results

        Returns:
            HTML string
        """
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: Arial, sans-serif; color: #333; line-height: 1.6; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
        .header h1 {{ margin: 0 0 10px 0; color: #1f2937; }}
        .header p {{ margin: 5px 0; color: #6b7280; }}
        .section {{ margin-bottom: 30px; border-left: 4px solid #3b82f6; padding-left: 20px; }}
        .section h2 {{ color: #1f2937; margin-top: 0; }}
        .section ul {{ margin: 10px 0; }}
        .section li {{ margin-bottom: 8px; }}
        .footer {{ background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; font-size: 12px; color: #6b7280; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Birth Chart Analysis</h1>
            <p><strong>Chart:</strong> {chart.name}</p>
            <p><strong>Birth Date:</strong> {chart.birth_date.strftime('%B %d, %Y')}</p>
            <p><strong>Birth Place:</strong> {chart.birth_place}</p>
            <p><strong>Generated:</strong> {datetime.now().strftime('%B %d, %Y at %H:%M:%S')}</p>
        </div>
"""

        for section_key, interpretation in interpretations.items():
            section_name = section_key.replace('_', ' ').title()

            html += f"""
        <div class="section">
            <h2>{section_name}</h2>
            <h3>Key Insights</h3>
            <ul>
"""
            for insight in interpretation.get('insights', []):
                html += f"                <li>{insight}</li>\n"

            html += """
            </ul>
            <h3>Challenges</h3>
            <ul>
"""
            for challenge in interpretation.get('challenges', []):
                html += f"                <li>{challenge}</li>\n"

            html += """
            </ul>
            <h3>Recommendations</h3>
            <ul>
"""
            for rec in interpretation.get('recommendations', []):
                html += f"                <li>{rec}</li>\n"

            html += """
            </ul>
        </div>
"""

        html += f"""
        <div class="footer">
            <p>This report was generated by Veda Jothidam - Vedic Astrology Platform</p>
            <p>&copy; {datetime.now().year} All rights reserved</p>
        </div>
    </div>
</body>
</html>
"""
        return html


def create_exporter() -> ChartExporter:
    """Factory function to create exporter"""
    return ChartExporter()


def create_report_generator() -> ReportGenerator:
    """Factory function to create report generator"""
    return ReportGenerator()
