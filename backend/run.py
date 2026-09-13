#!/usr/bin/env python
"""Run the Flask backend server."""

import sys
import os
sys.path.insert(0, '.')

from backend.app import create_app

if __name__ == '__main__':
    app = create_app()

    # Get configuration
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'

    print("[INFO] Starting Taara Vedic Backend Server")
    print(f"[INFO] Host: {host}")
    print(f"[INFO] Port: {port}")
    print(f"[INFO] Debug: {debug}")
    print(f"[INFO] URL: http://localhost:{port}")
    print(f"[INFO] API Docs: http://localhost:{port}/api-docs")
    print("[INFO] Press Ctrl+C to stop")
    print("")

    app.run(host=host, port=port, debug=debug)
