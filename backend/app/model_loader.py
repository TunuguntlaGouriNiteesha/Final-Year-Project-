from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

_classifier = None

def get_classifier():
    global _classifier
    if _classifier is None:
        try:
            logger.info("Loading BERT model for fake news detection...")
            _classifier = pipeline(
                "text-classification",
                model="jy46604790/fake-news-bert-detect",
                device=-1,  # Use CPU (-1) or GPU (0)
                max_length=512,
                truncation=True
            )
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise
    return _classifier