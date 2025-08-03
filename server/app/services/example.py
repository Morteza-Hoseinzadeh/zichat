import logging

logger = logging.getLogger(__name__)

def process_data(data):
    """Example service function"""
    try:
        logger.info("Processing data...")
        # Add your business logic here
        return {
            'status': 'success',
            'result': f"Processed {len(data)} items"
        }
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        raise