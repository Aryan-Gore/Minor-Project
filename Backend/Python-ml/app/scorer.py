# app/scorer.py
# Scoring logic for all 7 India Post financial schemes.
# Input: village demographics. Output: list of SchemeScore sorted by score.

from typing import List
from app.models import VillageData, SchemeScore
from app.seasonal import get_rpli_seasonal_boost, get_rd_td_seasonal_boost


def score_village(data: VillageData) -> List[SchemeScore]:
    """
    Score all 7 schemes for a village.
    Returns list sorted highest score first.
    Each score is 0.0 to 1.0.
    """

    # Avoid division by zero if popTotal is somehow 0
    total = data.popTotal if data.popTotal > 0 else 1

    # ── Calculate all ratios ──────────────────────────────
    # A ratio is what fraction of the total population
    # belongs to this group. e.g. 660/1240 = 0.532 = 53.2%

    female_ratio   = data.popFemale / total
    child_ratio    = data.popChildUnder10 / total
    senior_ratio   = data.popSenior60Plus / total
    farmer_ratio   = data.popFarmer / total
    salaried_ratio = data.popSalaried / total

    # ── Seasonal boosts ───────────────────────────────────
    rpli_boost, rpli_boost_reason = get_rpli_seasonal_boost(
        data.cropType, data.harvestMonths, data.currentMonth
    )
    rd_td_boost = get_rd_td_seasonal_boost(
        data.cropType, data.harvestMonths, data.currentMonth
    )

    # ── Helper: format percentage string ──────────────────
    def pct(ratio: float) -> str:
        return f"{round(ratio * 100, 1)}%"

    # ── Score each scheme ─────────────────────────────────
    # Formula explanation for each scheme:

    # SSA — Sukanya Samriddhi Account
    # Target: female children under 10
    # Score = average of female ratio and child ratio
    ssa_score = round((female_ratio * 0.5) + (child_ratio * 0.5), 3)
    ssa_reason = (
        f"{pct(female_ratio)} female population, "
        f"{pct(child_ratio)} children under 10"
    )

    # MSSC — Mahila Samman Savings Certificate
    # Target: adult women
    # Score = female ratio directly
    mssc_score = round(female_ratio, 3)
    mssc_reason = f"{pct(female_ratio)} adult female population"

    # SCSS — Senior Citizen Savings Scheme
    # Target: population aged 60+
    # Score = senior ratio directly
    scss_score = round(senior_ratio, 3)
    scss_reason = f"{pct(senior_ratio)} population aged 60 and above"

    # PPF — Public Provident Fund
    # Target: salaried working adults
    # Score = salaried ratio
    ppf_score = round(salaried_ratio, 3)
    ppf_reason = f"{pct(salaried_ratio)} salaried workers"

    # PLI — Postal Life Insurance
    # Target: government and private sector employees
    # Score = salaried ratio * 0.8 (slightly lower than PPF
    #         because PLI needs formal employment, not just any salary)
    pli_score = round(salaried_ratio * 0.8, 3)
    pli_reason = f"{pct(salaried_ratio)} service holders"

    # RPLI — Rural Postal Life Insurance
    # Target: farmers and rural population
    # Score = farmer ratio + seasonal boost during harvest
    # min(..., 1.0) ensures score never exceeds 1.0
    rpli_raw   = farmer_ratio + rpli_boost
    rpli_score = round(min(rpli_raw, 1.0), 3)
    rpli_reason = f"{pct(farmer_ratio)} farmer population"
    if rpli_boost_reason:
        rpli_reason += f" + {rpli_boost_reason}"

    # RD_TD — Recurring Deposit / Time Deposit
    # Target: all segments — general savings product
    # Base score is fixed at 0.30 for every village
    # Small seasonal boost when farmers have post-harvest cash
    rd_td_score  = round(min(0.30 + rd_td_boost, 1.0), 3)
    rd_td_reason = "Baseline savings product suitable for all segments"
    if rd_td_boost > 0:
        rd_td_reason += " + seasonal savings boost"

    # ── Build list of SchemeScore objects ─────────────────
    scores = [
        SchemeScore(code="SSA",   score=ssa_score,   reason=ssa_reason),
        SchemeScore(code="MSSC",  score=mssc_score,  reason=mssc_reason),
        SchemeScore(code="SCSS",  score=scss_score,  reason=scss_reason),
        SchemeScore(code="PPF",   score=ppf_score,   reason=ppf_reason),
        SchemeScore(code="PLI",   score=pli_score,   reason=pli_reason),
        SchemeScore(code="RPLI",  score=rpli_score,  reason=rpli_reason),
        SchemeScore(code="RD_TD", score=rd_td_score, reason=rd_td_reason),
    ]

    # Sort highest score first — top scheme is always at index 0
    scores.sort(key=lambda s: s.score, reverse=True)

    return scores
