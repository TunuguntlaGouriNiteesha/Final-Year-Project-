from app.gemini_client import analyze_social_content
from app.predict import predict_text, get_confidence_level
import logging
import time

logger = logging.getLogger(__name__)

def predict_social(content: str):
    """
    Analyze social media content with enhanced LLM-based misinformation detection
    """
    start_time = time.time()
    
    try:
        content = content.strip()
        
        if len(content) < 5:
            return {
                "label": "ERROR",
                "confidence": 0.0,
                "confidence_level": "Low",
                "analysis": "Content too short for meaningful analysis.",
                "signals_detected": ["Insufficient content"],
                "enhanced_analysis": None,
                "processing_time": 0
            }
        
        logger.info(f"Analyzing social content of length: {len(content)}")
        
        # Get LLM-based enhanced analysis (primary method)
        enhanced_analysis = analyze_social_content(content)
        
        # Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)
        
        # Build comprehensive result
        result = {
            "label": enhanced_analysis.get("classification", "UNVERIFIED"),
            "confidence": enhanced_analysis.get("confidence_score", 0.5),
            "confidence_level": enhanced_analysis.get("confidence", "Medium"),
            "text_preview": content[:200] + "..." if len(content) > 200 else content,
            "analysis": enhanced_analysis.get("analysis", "Analysis completed."),
            "enhanced_analysis": enhanced_analysis,
            "signals_detected": enhanced_analysis.get("signals_detected", []),
            "detailed_signals": enhanced_analysis.get("detailed_signals", []),
            "verification_steps": enhanced_analysis.get("verification_steps", []),
            "recommendations": enhanced_analysis.get("recommendations", []),
            "processing_time": processing_time
        }
        
        # If LLM analysis failed or returned low confidence, fall back to ML model
        if enhanced_analysis.get("classification") == "UNVERIFIED" and enhanced_analysis.get("confidence_score", 0) < 0.5:
            logger.info("LLM analysis inconclusive, using ML model fallback")
            ml_result = predict_text(content)
            
            if ml_result["label"] != "ERROR":
                result["label"] = ml_result["label"]
                result["confidence"] = ml_result["confidence"]
                result["confidence_level"] = ml_result["confidence_level"]
                result["analysis"] = f"{result['analysis']} ML model indicates {ml_result['label']} with {ml_result['confidence']:.1%} confidence."
                result["ml_fallback"] = True
        
        logger.info(f"Social analysis result: {result['label']} with confidence {result['confidence']}")
        return result
        
    except Exception as e:
        logger.error(f"Social prediction error: {str(e)}")
        processing_time = int((time.time() - start_time) * 1000)
        
        # Fallback to ML model
        try:
            logger.info("Falling back to ML model due to error")
            ml_result = predict_text(content)
            
            if ml_result["label"] != "ERROR":
                return {
                    "label": ml_result["label"],
                    "confidence": ml_result["confidence"],
                    "confidence_level": ml_result["confidence_level"],
                    "text_preview": content[:200] + "..." if len(content) > 200 else content,
                    "analysis": f"ML-based analysis: Content classified as {ml_result['label']} with {ml_result['confidence']:.1%} confidence. LLM analysis encountered an error.",
                    "enhanced_analysis": None,
                    "signals_detected": ["LLM analysis failed - using ML fallback"],
                    "detailed_signals": [],
                    "verification_steps": [],
                    "recommendations": ["Retry analysis if needed"],
                    "processing_time": processing_time,
                    "ml_fallback": True
                }
        except Exception as ml_error:
            logger.error(f"ML fallback also failed: {str(ml_error)}")
        
        return {
            "label": "ERROR",
            "confidence": 0.0,
            "confidence_level": "Low",
            "analysis": f"Unable to analyze content. Error: {str(e)}",
            "enhanced_analysis": None,
            "signals_detected": ["Analysis failed"],
            "detailed_signals": [],
            "verification_steps": [],
            "recommendations": ["Please try again later"],
            "processing_time": processing_time
        }