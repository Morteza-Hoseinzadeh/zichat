#!/usr/bin/env python3
import argparse
import logging
from app import create_app
from app.config import DevelopmentConfig, ProductionConfig

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="Run Flask application")
    parser.add_argument(
        '--debug',
        action='store_true',
        help="Run in development mode"
    )
    parser.add_argument(
        '--port',
        type=int,
        default=5000,
        help="Port to run server on"
    )
    return parser.parse_args()

def main():
    args = parse_args()
    
    config = DevelopmentConfig if args.debug else ProductionConfig
    app = create_app(config)
    
    try:
        logger.info(f"Starting server on port {args.port}")
        app.run(host='0.0.0.0', port=args.port, debug=args.debug)
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        raise

if __name__ == '__main__':
    main()