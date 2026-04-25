import os
from dotenv import load_dotenv
import google.generativeai as genai
import time
import logging
import json

load_dotenv()

logger = logging.getLogger(__name__)

# ✅ FIXED GEMINI SETUP
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    logger.warning("GEMINI_API_KEY not found in environment variables")
    model = None
else:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")


MISINFORMATION_PROMPT = """
You are an advanced misinformation detection and verification AI used in a professional fake news detection platform.

Your task is to analyze a piece of news or social media content and determine whether it is:

1. Real News
2. Fake News
3. Misleading / Partially True
4. Unverified Claim

Follow a strict verification process before making a decision.

VERIFICATION PROCESS:

Step 1: Content Understanding
Carefully read the input text and identify the main claim, topic, entities, and intent.

Step 2: Context Evaluation
Determine if the claim appears sensational, emotionally manipulative, politically biased, or lacking credible evidence.

Step 3: Logical Consistency Check
Evaluate whether the claim logically makes sense or contains contradictions.

Step 4: Source Reliability Assessment
Assess whether the information resembles content from credible sources or typical misinformation patterns.

Step 5: Knowledge Cross-Reference
Use general world knowledge and known facts to verify whether the claim aligns with established information.

Step 6: Final Classification
Classify the content as:
- REAL
- FAKE
- MISLEADING
- UNVERIFIED

IMPORTANT RULES:

Be extremely cautious before labeling something as REAL.
If evidence is insufficient, classify as UNVERIFIED.
Avoid guessing.
Do not hallucinate facts.
Base reasoning on logic, credibility patterns, and known knowledge.

OUTPUT FORMAT (STRICT JSON ONLY - NO MARKDOWN, NO CODE BLOCKS):

{
    "classification": "REAL / FAKE / MISLEADING / UNVERIFIED",
    "confidence": "High / Medium / Low",
    "confidence_score": 0.85,
    "analysis": "Short 2–3 sentence explanation explaining why the claim is classified this way.",
    "signals_detected": [
        "Sensational language",
        "Lack of credible source",
        "Logical inconsistency",
        "Common misinformation pattern"
    ],
    "detailed_signals": [
        {
            "signal": "Sensational language",
            "description": "Uses emotionally charged words to provoke reaction",
            "severity": "High"
        }
    ],
    "verification_steps": [
        {
            "step": 1,
            "step_name": "Content Understanding",
            "findings": "Main claim identified as...",
            "passed": true
        }
    ],
    "recommendations": [
        "Verify with official sources",
        "Check for corroborating evidence"
    ]
}

ANALYSIS RULES:

Analysis must be concise.
Maximum 3 sentences.
Focus on evidence and reasoning.
Avoid unnecessary explanation.

The response must be professional, factual, and precise.
Return ONLY the JSON object, no additional text or markdown formatting.
"""


def parse_llm_response(response_text):
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        try:
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
                return json.loads(json_str)
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
                return json.loads(json_str)
        except:
            pass

        try:
            start_idx = response_text.find("{")
            end_idx = response_text.rfind("}")
            if start_idx != -1 and end_idx != -1:
                return json.loads(response_text[start_idx:end_idx+1])
        except:
            pass

    return None


def analyze_with_llm(text, max_retries=2):

    if not model:
        return {
            "classification": "UNVERIFIED",
            "confidence": "Low",
            "confidence_score": 0.0,
            "analysis": "Gemini API key not configured. Please add GEMINI_API_KEY to .env file.",
            "signals_detected": ["API not configured"],
            "detailed_signals": [],
            "verification_steps": [],
            "recommendations": ["Configure API key for enhanced analysis"]
        }

    full_prompt = f"{MISINFORMATION_PROMPT}\n\nCONTENT TO ANALYZE:\n\"{text.strip()}\""

    for attempt in range(max_retries):
        try:
            # ✅ FIXED CALL
            response = model.generate_content(full_prompt)

            if response.text:
                parsed = parse_llm_response(response.text)

                if parsed:
                    required_fields = ["classification", "confidence", "analysis", "signals_detected"]

                    for field in required_fields:
                        if field not in parsed:
                            if field == "classification":
                                parsed[field] = "UNVERIFIED"
                            elif field == "confidence":
                                parsed[field] = "Low"
                            elif field == "analysis":
                                parsed[field] = "Unable to generate detailed analysis."
                            elif field == "signals_detected":
                                parsed[field] = []

                    if "confidence_score" not in parsed:
                        confidence_map = {"High": 0.9, "Medium": 0.6, "Low": 0.3}
                        parsed["confidence_score"] = confidence_map.get(parsed.get("confidence", "Low"), 0.3)

                    if "detailed_signals" not in parsed:
                        parsed["detailed_signals"] = []
                    if "verification_steps" not in parsed:
                        parsed["verification_steps"] = []
                    if "recommendations" not in parsed:
                        parsed["recommendations"] = []

                    return parsed

                else:
                    return {
                        "classification": "UNVERIFIED",
                        "confidence": "Low",
                        "confidence_score": 0.3,
                        "analysis": "Unable to parse LLM response.",
                        "signals_detected": ["Parsing failed"],
                        "detailed_signals": [],
                        "verification_steps": [],
                        "recommendations": ["Retry"]
                    }

            else:
                return {
                    "classification": "UNVERIFIED",
                    "confidence": "Low",
                    "confidence_score": 0.0,
                    "analysis": "No response from Gemini API",
                    "signals_detected": ["Empty response"],
                    "detailed_signals": [],
                    "verification_steps": [],
                    "recommendations": ["Retry"]
                }

        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: {str(e)}")

            if attempt == max_retries - 1:
                return {
                    "classification": "UNVERIFIED",
                    "confidence": "Low",
                    "confidence_score": 0.0,
                    "analysis": f"Error: {str(e)}",
                    "signals_detected": ["API error"],
                    "detailed_signals": [],
                    "verification_steps": [],
                    "recommendations": ["Check API key"]
                }

            time.sleep(1)


def analyze_social_content(text, max_retries=2):
    return analyze_with_llm(text, max_retries)


def analyze_news_text(text, max_retries=2):
    return analyze_with_llm(text, max_retries)
