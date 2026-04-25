from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# Request Models
class TextRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Text content to analyze")

class SocialRequest(BaseModel):
    content: str = Field(..., min_length=5, description="Social media content to analyze")

class NewsTopicRequest(BaseModel):
    topic: Optional[str] = Field(None, description="News topic to verify (optional)")
    random: Optional[bool] = Field(True, description="Get random news topic if no topic provided")

# Response Models for Enhanced Misinformation Detection
class DetectionSignal(BaseModel):
    signal: str = Field(..., description="Type of signal detected (e.g., 'Sensational language')")
    description: str = Field(..., description="Brief explanation of the signal")
    severity: str = Field(..., description="Severity level: Low, Medium, High")

class AnalysisStep(BaseModel):
    step: int = Field(..., description="Step number (1-6)")
    step_name: str = Field(..., description="Name of the verification step")
    findings: str = Field(..., description="Findings from this step")
    passed: bool = Field(..., description="Whether this step passed verification")

class MisinformationAnalysis(BaseModel):
    classification: str = Field(..., description="REAL / FAKE / MISLEADING / UNVERIFIED")
    confidence: str = Field(..., description="High / Medium / Low")
    confidence_score: float = Field(..., description="Numerical confidence score 0-1")
    analysis: str = Field(..., description="2-3 sentence explanation of the classification")
    signals_detected: List[str] = Field(default=[], description="List of detected misinformation signals")
    detailed_signals: List[DetectionSignal] = Field(default=[], description="Detailed signal information")
    verification_steps: List[AnalysisStep] = Field(default=[], description="Results of each verification step")
    recommendations: List[str] = Field(default=[], description="Recommendations based on the analysis")

class PredictionResult(BaseModel):
    label: str = Field(..., description="REAL / FAKE / MISLEADING / UNVERIFIED / ERROR")
    confidence: float = Field(..., description="Confidence score 0-1")
    confidence_level: str = Field(..., description="High / Medium / Low")
    text_preview: Optional[str] = Field(None, description="Preview of analyzed text")
    processing_time: int = Field(0, description="Processing time in ms")
    analysis: Optional[str] = Field(None, description="Detailed analysis explanation")
    enhanced_analysis: Optional[MisinformationAnalysis] = Field(None, description="Full misinformation analysis")
    signals_detected: List[str] = Field(default=[], description="List of detected warning signs")
    error: Optional[str] = Field(None, description="Error message if any")

class ArticleAnalysis(BaseModel):
    article: Optional[Dict[str, Any]] = Field(None, description="Article metadata")
    prediction: Optional[PredictionResult] = Field(None, description="Analysis result")
    detailed_analysis: Optional[MisinformationAnalysis] = Field(None, description="Detailed misinformation analysis")

class NewsVerificationResult(BaseModel):
    topic: str = Field(..., description="Topic that was analyzed")
    status: str = Field(..., description="Analysis status")
    overall_credibility: Dict[str, Any] = Field(..., description="Overall credibility metrics")
    articles: List[ArticleAnalysis] = Field(default=[], description="Individual article analyses")
    enhanced_analysis: Optional[MisinformationAnalysis] = Field(None, description="Aggregated topic analysis")