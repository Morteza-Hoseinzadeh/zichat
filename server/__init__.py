#!/usr/bin/env python3
"""
Basic Python Application Template
"""
import argparse
import logging
import sys
from typing import Optional, List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AppConfig:
    """Application configuration class"""
    def __init__(self, debug: bool = False):
        self.debug = debug
        # Add more configuration parameters here


class MyApp:
    """Main application class"""
    
    def __init__(self, config: AppConfig):
        self.config = config
        self.setup()
        
    def setup(self):
        """Initialize application resources"""
        if self.config.debug:
            logging.getLogger().setLevel(logging.DEBUG)
            logger.debug("Debug mode enabled")
        
        # Add more initialization code here
        
    def run(self):
        """Main application logic"""
        try:
            logger.info("Starting application")
            
            # Your main application code goes here
            self._business_logic()
            
            logger.info("Application completed successfully")
            return 0
        except Exception as e:
            logger.error(f"Application failed: {str(e)}", exc_info=self.config.debug)
            return 1
            
    def _business_logic(self):
        """Example business logic method"""
        logger.info("Running business logic")
        # Replace with your actual application logic
        print("Hello from MyApp!")
        if self.config.debug:
            logger.debug("Additional debug information")


def parse_args(args: Optional[List[str]] = None) -> argparse.Namespace:
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="My Python Application")
    
    parser.add_argument(
        '-d', '--debug',
        action='store_true',
        help="Enable debug mode"
    )
    # Add more arguments as needed
    
    return parser.parse_args(args)


def main(args: Optional[List[str]] = None) -> int:
    """Application entry point"""
    parsed_args = parse_args(args)
    
    config = AppConfig(
        debug=parsed_args.debug
    )
    
    app = MyApp(config)
    return app.run()


if __name__ == "__main__":
    sys.exit(main())