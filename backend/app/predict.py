from app.model_loader import get_classifier
from app.gemini_client import analyze_news_text
import logging
import time

logger = logging.getLogger(__name__)

LABEL_MAP = {
    "LABEL_0": "FAKE",
    "LABEL_1": "REAL"
}

def get_confidence_level(score):
    """
    Convert numerical confidence to High/Medium/Low
    """
    if score >= 0.8:
        return "High"
    elif score >= 0.5:
        return "Medium"
    else:
        return "Low"

def predict_text(text: str):
    """
    Analyze text using ML model with LLM-enhanced misinformation detection
    """
    start_time = time.time()
    
    try:
        text = text.strip()
        
        if len(text) < 5:
            return {
                "label": "ERROR",
                "confidence": 0.0,
                "confidence_level": "Low",
                "error": "Text too short for analysis",
                "analysis": "Text must be at least 5 characters long.",
                "enhanced_analysis": None,
                "signals_detected": [],
                "processing_time": 0
            }
        
        logger.info(f"Analyzing text of length: {len(text)}")
        
        # Get LLM-based enhanced analysis
        enhanced_analysis = analyze_news_text(text)
        
        # Get ML model prediction as fallback/enhancement
        classifier = get_classifier()
        ml_result = classifier(text[:1000])[0]  # Limit to first 1000 chars
        ml_label = LABEL_MAP.get(ml_result["label"], ml_result["label"])
        ml_confidence = float(ml_result["score"])
        
        # Combine LLM and ML results
        # Priority: LLM classification (more sophisticated), but use ML confidence as validation
        final_classification = enhanced_analysis.get("classification", "UNVERIFIED")
        
        # If LLM says UNVERIFIED but ML is confident, use ML result
        if final_classification == "UNVERIFIED" and ml_confidence > 0.8:
            final_classification = ml_label
            enhanced_analysis["classification"] = ml_label
            enhanced_analysis["confidence"] = get_confidence_level(ml_confidence)
            enhanced_analysis["confidence_score"] = ml_confidence
            enhanced_analysis["analysis"] = f"ML model indicates {ml_label} with {ml_confidence:.1%} confidence. " + enhanced_analysis.get("analysis", "")
        
        # Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)
        
        # Build result with enhanced analysis
        result = {
            "label": final_classification,
            "confidence": enhanced_analysis.get("confidence_score", ml_confidence),
            "confidence_level": enhanced_analysis.get("confidence", get_confidence_level(ml_confidence)),
            "text_preview": text[:200] + "..." if len(text) > 200 else text,
            "processing_time": processing_time,
            "analysis": enhanced_analysis.get("analysis", f"Analysis completed. Classification: {final_classification}"),
            "enhanced_analysis": enhanced_analysis,
            "signals_detected": enhanced_analysis.get("signals_detected", []),
            "ml_prediction": {
                "label": ml_label,
                "confidence": ml_confidence
            }
        }
        
        logger.info(f"Text analysis result: {result['label']} with confidence {result['confidence']}")
        return result
        
    except Exception as e:
        logger.error(f"Error in text prediction: {str(e)}")
        processing_time = int((time.time() - start_time) * 1000)
        
        # Fallback to ML-only if LLM fails
        try:
            classifier = get_classifier()
            ml_result = classifier(text[:1000])[0]
            ml_label = LABEL_MAP.get(ml_result["label"], ml_result["label"])
            ml_confidence = float(ml_result["score"])
            
            return {
                "label": ml_label,
                "confidence": ml_confidence,
                "confidence_level": get_confidence_level(ml_confidence),
                "text_preview": text[:200] + "..." if len(text) > 200 else text,
                "processing_time": processing_time,
                "analysis": f"ML-based analysis: Content classified as {ml_label} with {ml_confidence:.1%} confidence. LLM analysis failed.",
                "enhanced_analysis": None,
                "signals_detected": ["LLM analysis failed - using ML fallback"],
                "error": f"LLM analysis failed: {str(e)}"
            }
        except Exception as ml_error:
            return {
                "label": "ERROR",
                "confidence": 0.0,
                "confidence_level": "Low",
                "error": f"Both LLM and ML analysis failed: {str(e)}; ML error: {str(ml_error)}",
                "analysis": "Analysis failed. Please try again.",
                "enhanced_analysis": None,
                "signals_detected": ["Analysis failed"],
                "processing_time": processing_time
            }