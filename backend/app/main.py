from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import TextRequest, SocialRequest, NewsTopicRequest
from app.predict import predict_text
from app.social_predict import predict_social
from app.news_verifier import news_verifier
import logging
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Fake News Detection API",
    description="API for detecting fake news using ML models and real-time news verification",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Health check endpoint
@app.get("/")
def root():
    return {
        "status": "API running",
        "version": "2.0.0",
        "endpoints": {
            "health": "/health",
            "predict_text": "/predict/text",
            "predict_social": "/predict/social",
            "news_verify": "/news/verify",
            "random_topics": "/news/random-topics"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Fake News Detection API",
        "features": ["text_analysis", "social_analysis", "news_verification"]
    }

@app.post("/predict/text")
def text_prediction(req: TextRequest):
    """Analyze text using ML model"""
    try:
        logger.info(f"Text prediction request received: {len(req.text)} characters")
        result = predict_text(req.text)
        logger.info(f"Text prediction result: {result}")
        return result
    except Exception as e:
        logger.error(f"Text prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Text analysis failed: {str(e)}"
        )

@app.post("/predict/social")
def social_prediction(req: SocialRequest):
    """Analyze social media content"""
    try:
        logger.info(f"Social prediction request received: {len(req.content)} characters")
        result = predict_social(req.content)
        logger.info(f"Social prediction completed successfully")
        return result
    except Exception as e:
        logger.error(f"Social prediction error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Social media analysis failed",
                "detail": str(e),
                "analysis": "Unable to analyze content at the moment. Please try again later."
            }
        )

@app.get("/news/random-topics")
def get_random_topics():
    """Get random news topics for verification"""
    try:
        topics = news_verifier.get_random_news_topics()
        return {"topics": topics}
    except Exception as e:
        logger.error(f"Error getting random topics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get random topics: {str(e)}"
        )

@app.post("/news/verify")
def verify_news_topic(req: NewsTopicRequest):
    """Verify news articles on a given topic"""
    try:
        # If no topic provided, get a random one
        topic = req.topic
        if not topic and req.random:
            topics = news_verifier.get_random_news_topics()
            topic = topics[0] if topics else "technology AI"
        
        if not topic:
            raise HTTPException(
                status_code=400,
                detail="No topic provided and random is false"
            )
        
        logger.info(f"News verification request for topic: {topic}")
        result = news_verifier.verify_news_topic(topic)
        
        return result
        
    except Exception as e:
        logger.error(f"News verification error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"News verification failed: {str(e)}"
        )

# Add error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global error handler: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc)
        }
    )

# Add OPTIONS handler for CORS preflight
@app.options("/{path:path}")
async def options_handler(request: Request, path: str):
    return JSONResponse(
        status_code=200,
        content={"message": "OK"}
    )