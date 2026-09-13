"""
Pytest configuration and shared fixtures
"""

import pytest
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

@pytest.fixture(scope='session')
def test_session():
    """Setup test session"""
    print("\n=== Starting Integration Tests ===")
    yield
    print("\n=== Integration Tests Complete ===")
