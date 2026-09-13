"""
Unit Tests for SQLAlchemy Models

Tests for User, Chart, and Consultation models.
Covers: instantiation, field validation, relationships, serialization.
"""

import unittest
from datetime import datetime, date, time
from backend.database import db
from backend.models import User, Chart, Consultation


class TestUserModel(unittest.TestCase):
    """Test cases for User model."""

    def test_user_creation(self):
        """Test creating a user instance."""
        user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password',
            full_name='Test User',
            phone='+1234567890',
            city='Chennai',
            state='Tamil Nadu',
            country='India',
            is_active=True,
            language='tamil',
            timezone='Asia/Kolkata'
        )

        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.full_name, 'Test User')
        self.assertEqual(user.phone, '+1234567890')
        self.assertEqual(user.city, 'Chennai')
        self.assertTrue(user.is_active)

    def test_user_defaults(self):
        """Test default values for User."""
        user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password'
        )

        self.assertEqual(user.language, 'tamil')
        self.assertEqual(user.timezone, 'Asia/Kolkata')
        self.assertTrue(user.is_active)
        self.assertIsNotNone(user.id)

    def test_user_repr(self):
        """Test User __repr__ method."""
        user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password'
        )

        repr_str = repr(user)
        self.assertIn('testuser', repr_str)
        self.assertIn('test@example.com', repr_str)

    def test_user_to_dict(self):
        """Test User to_dict() method."""
        user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password',
            full_name='Test User',
            city='Chennai',
            country='India'
        )

        user_dict = user.to_dict(include_email=True)
        self.assertEqual(user_dict['email'], 'test@example.com')
        self.assertEqual(user_dict['username'], 'testuser')
        self.assertEqual(user_dict['full_name'], 'Test User')
        self.assertIn('created_at', user_dict)
        self.assertIn('updated_at', user_dict)

    def test_user_to_dict_without_email(self):
        """Test User to_dict() without email."""
        user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password'
        )

        user_dict = user.to_dict(include_email=False)
        self.assertNotIn('email', user_dict)
        self.assertEqual(user_dict['username'], 'testuser')

    def test_user_to_dict_public(self):
        """Test User to_dict_public() method."""
        user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password',
            full_name='Test User',
            phone='+1234567890',
            city='Chennai',
            country='India'
        )

        public_dict = user.to_dict_public()
        self.assertEqual(public_dict['username'], 'testuser')
        self.assertEqual(public_dict['full_name'], 'Test User')
        self.assertEqual(public_dict['city'], 'Chennai')
        self.assertNotIn('email', public_dict)
        self.assertNotIn('phone', public_dict)

    def test_user_is_verified(self):
        """Test User is_verified() method."""
        active_user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password',
            is_active=True
        )
        self.assertTrue(active_user.is_verified())

        inactive_user = User(
            email='test2@example.com',
            username='testuser2',
            password_hash='hashed_password',
            is_active=False
        )
        self.assertFalse(inactive_user.is_verified())

    def test_user_get_charts_count(self):
        """Test User get_charts_count() method."""
        user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password'
        )

        # Initially, user has no charts
        self.assertEqual(user.get_charts_count(), 0)


class TestChartModel(unittest.TestCase):
    """Test cases for Chart model."""

    def setUp(self):
        """Set up test fixtures."""
        self.user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password'
        )

    def test_chart_creation(self):
        """Test creating a chart instance."""
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            timezone='Asia/Kolkata',
            ayanamsa='lahiri',
            node_type='mean'
        )

        self.assertEqual(chart.name, 'Birth Chart')
        self.assertEqual(chart.birth_location, 'Chennai, India')
        self.assertEqual(chart.ayanamsa, 'lahiri')
        self.assertEqual(chart.node_type, 'mean')

    def test_chart_defaults(self):
        """Test default values for Chart."""
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )

        self.assertEqual(chart.timezone, 'Asia/Kolkata')
        self.assertEqual(chart.ayanamsa, 'lahiri')
        self.assertEqual(chart.node_type, 'mean')
        self.assertIsNone(chart.d1_data)

    def test_chart_repr(self):
        """Test Chart __repr__ method."""
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )

        repr_str = repr(chart)
        self.assertIn('Birth Chart', repr_str)
        self.assertIn('2000-01-15', repr_str)

    def test_chart_to_dict(self):
        """Test Chart to_dict() method."""
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )

        chart_dict = chart.to_dict(include_calculations=False)
        self.assertEqual(chart_dict['name'], 'Birth Chart')
        self.assertEqual(chart_dict['birth_location'], 'Chennai, India')
        self.assertEqual(chart_dict['ayanamsa'], 'lahiri')
        self.assertNotIn('d1_data', chart_dict)

    def test_chart_to_dict_with_calculations(self):
        """Test Chart to_dict() with calculations."""
        d1_data = {'ascendant': 'Aries', 'sign': 1}
        dasha_data = {'periods': [{'dasha': 'Sun', 'start': '2000-01-15'}]}

        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            d1_data=d1_data,
            dasha_data=dasha_data
        )

        chart_dict = chart.to_dict(include_calculations=True)
        self.assertEqual(chart_dict['d1_data'], d1_data)
        self.assertEqual(chart_dict['dasha_data'], dasha_data)

    def test_chart_to_dict_full(self):
        """Test Chart to_dict_full() method."""
        d1_data = {'ascendant': 'Aries'}
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            d1_data=d1_data
        )

        chart_dict = chart.to_dict_full()
        self.assertEqual(chart_dict['d1_data'], d1_data)

    def test_chart_get_lagna(self):
        """Test Chart get_lagna() method."""
        d1_data = {'ascendant': 'Aries', 'sign': 1}
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            d1_data=d1_data
        )

        self.assertEqual(chart.get_lagna(), 'Aries')

    def test_chart_get_lagna_empty(self):
        """Test Chart get_lagna() when no data."""
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )

        self.assertIsNone(chart.get_lagna())

    def test_chart_get_dasha_periods(self):
        """Test Chart get_dasha_periods() method."""
        dasha_data = {'periods': [
            {'dasha': 'Sun', 'start': '2000-01-15'},
            {'dasha': 'Moon', 'start': '2006-01-15'}
        ]}
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            dasha_data=dasha_data
        )

        periods = chart.get_dasha_periods()
        self.assertEqual(len(periods), 2)
        self.assertEqual(periods[0]['dasha'], 'Sun')

    def test_chart_get_dasha_periods_empty(self):
        """Test Chart get_dasha_periods() when no data."""
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )

        periods = chart.get_dasha_periods()
        self.assertEqual(periods, [])

    def test_chart_is_calculated(self):
        """Test Chart is_calculated() method."""
        # Not calculated
        chart1 = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )
        self.assertFalse(chart1.is_calculated())

        # Calculated
        chart2 = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707,
            d1_data={'ascendant': 'Aries'},
            dasha_data={'periods': []}
        )
        self.assertTrue(chart2.is_calculated())

    def test_chart_get_consultations_count(self):
        """Test Chart get_consultations_count() method."""
        chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )

        # Initially, chart has no consultations
        self.assertEqual(chart.get_consultations_count(), 0)


class TestConsultationModel(unittest.TestCase):
    """Test cases for Consultation model."""

    def setUp(self):
        """Set up test fixtures."""
        self.user = User(
            email='test@example.com',
            username='testuser',
            password_hash='hashed_password'
        )
        self.chart = Chart(
            user_id=self.user.id,
            name='Birth Chart',
            birth_date=date(2000, 1, 15),
            birth_time=time(12, 30, 0),
            birth_location='Chennai, India',
            latitude=13.0827,
            longitude=80.2707
        )

    def test_consultation_creation(self):
        """Test creating a consultation instance."""
        consultation = Consultation(
            chart_id=self.chart.id,
            consultation_date=datetime(2026, 9, 13, 14, 30, 0),
            notes='Test consultation notes',
            recommendations='Wear Ruby stone',
            remedies='Chant Sun mantra',
            follow_up_date=date(2026, 12, 13)
        )

        self.assertEqual(consultation.notes, 'Test consultation notes')
        self.assertEqual(consultation.recommendations, 'Wear Ruby stone')
        self.assertEqual(consultation.remedies, 'Chant Sun mantra')
        self.assertEqual(consultation.follow_up_date, date(2026, 12, 13))

    def test_consultation_defaults(self):
        """Test default values for Consultation."""
        consultation = Consultation(
            chart_id=self.chart.id
        )

        self.assertIsNone(consultation.notes)
        self.assertIsNone(consultation.recommendations)
        self.assertIsNone(consultation.remedies)
        self.assertIsNone(consultation.follow_up_date)
        self.assertIsNotNone(consultation.id)

    def test_consultation_repr(self):
        """Test Consultation __repr__ method."""
        consultation = Consultation(
            chart_id=self.chart.id,
            consultation_date=datetime(2026, 9, 13, 14, 30, 0)
        )

        repr_str = repr(consultation)
        self.assertIn('Consultation', repr_str)
        self.assertIn('2026-09-13', repr_str)

    def test_consultation_to_dict(self):
        """Test Consultation to_dict() method."""
        consultation = Consultation(
            chart_id=self.chart.id,
            notes='Test notes',
            recommendations='Test recommendations',
            remedies='Test remedies',
            follow_up_date=date(2026, 12, 13)
        )

        cons_dict = consultation.to_dict()
        self.assertEqual(cons_dict['notes'], 'Test notes')
        self.assertEqual(cons_dict['recommendations'], 'Test recommendations')
        self.assertEqual(cons_dict['follow_up_date'], '2026-12-13')
        self.assertIn('created_at', cons_dict)

    def test_consultation_to_dict_summary(self):
        """Test Consultation to_dict_summary() method."""
        consultation = Consultation(
            chart_id=self.chart.id,
            notes='Test notes',
            follow_up_date=date(2026, 12, 13)
        )

        summary = consultation.to_dict_summary()
        self.assertIn('chart_id', summary)
        self.assertNotIn('notes', summary)
        self.assertNotIn('recommendations', summary)
        self.assertEqual(summary['follow_up_date'], '2026-12-13')

    def test_consultation_has_follow_up(self):
        """Test Consultation has_follow_up() method."""
        cons_with_followup = Consultation(
            chart_id=self.chart.id,
            follow_up_date=date(2026, 12, 13)
        )
        self.assertTrue(cons_with_followup.has_follow_up())

        cons_without_followup = Consultation(
            chart_id=self.chart.id
        )
        self.assertFalse(cons_without_followup.has_follow_up())

    def test_consultation_is_overdue(self):
        """Test Consultation is_overdue() method."""
        # Overdue
        past_date = date(2020, 1, 1)
        cons_overdue = Consultation(
            chart_id=self.chart.id,
            follow_up_date=past_date
        )
        self.assertTrue(cons_overdue.is_overdue())

        # Not overdue
        future_date = date(2030, 12, 31)
        cons_valid = Consultation(
            chart_id=self.chart.id,
            follow_up_date=future_date
        )
        self.assertFalse(cons_valid.is_overdue())

        # No follow-up
        cons_none = Consultation(
            chart_id=self.chart.id
        )
        self.assertFalse(cons_none.is_overdue())

    def test_consultation_has_complete_notes(self):
        """Test Consultation has_complete_notes() method."""
        # Complete notes
        complete = Consultation(
            chart_id=self.chart.id,
            notes='Notes',
            recommendations='Recommendations',
            remedies='Remedies'
        )
        self.assertTrue(complete.has_complete_notes())

        # Missing remedies
        incomplete = Consultation(
            chart_id=self.chart.id,
            notes='Notes',
            recommendations='Recommendations'
        )
        self.assertFalse(incomplete.has_complete_notes())

        # Empty notes
        empty = Consultation(
            chart_id=self.chart.id
        )
        self.assertFalse(empty.has_complete_notes())


if __name__ == '__main__':
    unittest.main()
