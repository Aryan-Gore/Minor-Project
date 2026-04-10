# app/models.py
# Pydantic v2 — data validation and serialization

from pydantic import BaseModel, Field, field_validator
from typing import List


class VillageData(BaseModel):
    """
    Data Spring Boot sends to Python for scoring.
    Every field is validated automatically by Pydantic.
    If a field is wrong type or missing, Python returns 422 error.
    """
    villageId: str = Field(..., description="MongoDB _id of the village")

    # Population numbers — all must be non-negative integers
    popTotal:        int = Field(..., ge=1,  description="Total population")
    popMale:         int = Field(..., ge=0,  description="Male population")
    popFemale:       int = Field(..., ge=0,  description="Female population")
    popChildUnder10: int = Field(..., ge=0,  description="Children under 10")
    popSenior60Plus: int = Field(..., ge=0,  description="Seniors aged 60+")
    popFarmer:       int = Field(..., ge=0,  description="Farmers")
    popSalaried:     int = Field(..., ge=0,  description="Salaried workers")
    popBusiness:     int = Field(..., ge=0,  description="Business owners")

    # Farming info
    cropType:      str       = Field(..., description="Rabi, Kharif, or Both")
    harvestMonths: List[int] = Field(..., description="e.g. [3, 4] for March, April")
    currentMonth:  int       = Field(..., ge=1, le=12, description="1=Jan to 12=Dec")

    # Validate cropType is one of the allowed values
    @field_validator('cropType')
    @classmethod
    def validate_crop_type(cls, v):
        allowed = ['Rabi', 'Kharif', 'Both']
        if v not in allowed:
            raise ValueError(f'cropType must be one of {allowed}')
        return v

    # Validate harvest months are valid month numbers
    @field_validator('harvestMonths')
    @classmethod
    def validate_harvest_months(cls, v):
        for month in v:
            if month < 1 or month > 12:
                raise ValueError(f'Month {month} is invalid. Must be 1-12.')
        return v


class SchemeScore(BaseModel):
    """One scheme with its score and reason."""
    code:   str   = Field(..., description="Scheme code: SSA, MSSC, SCSS, etc.")
    score:  float = Field(..., ge=0.0, le=1.0, description="Score 0.0 to 1.0")
    reason: str   = Field(..., description="Human readable explanation")


class RecommendationResponse(BaseModel):
    """What Python returns to Spring Boot after scoring."""
    villageId: str
    month:     int
    schemes:   List[SchemeScore]  # sorted highest score first


class HealthResponse(BaseModel):
    """Response for the health check endpoint."""
    status:  str
    service: str
    version: str
