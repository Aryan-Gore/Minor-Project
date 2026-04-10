# app/seasonal.py
# Seasonal boost logic for RPLI and RD_TD schemes.
# Farmers have more money after harvest — this is when to push insurance.

from typing import List


# Month numbers when Rabi crop farmers receive harvest money
# Rabi crops (wheat, mustard, gram) are harvested March-April
RABI_HARVEST_MONTHS = [3, 4]

# Month numbers when Kharif crop farmers receive harvest money
# Kharif crops (rice, maize, cotton) are harvested October-November
KHARIF_HARVEST_MONTHS = [10, 11]

# Boost amount added to RPLI score during harvest season
HARVEST_BOOST = 0.20

# Smaller boost for RD/TD during harvest — farmers save more then
RD_TD_HARVEST_BOOST = 0.10


def get_rpli_seasonal_boost(
    crop_type: str,
    harvest_months: List[int],
    current_month: int
) -> tuple[float, str]:
    """
    Returns (boost_amount, reason_text) for RPLI.
    boost_amount is 0.0 if not harvest season, 0.20 if it is.
    """
    # Check if current month is in the village's own harvest months
    if current_month in harvest_months:
        return HARVEST_BOOST, "harvest season boost applied"

    # Fallback: check standard harvest months for the crop type
    if crop_type in ['Rabi', 'Both']:
        if current_month in RABI_HARVEST_MONTHS:
            return HARVEST_BOOST, "Rabi harvest season boost applied"

    if crop_type in ['Kharif', 'Both']:
        if current_month in KHARIF_HARVEST_MONTHS:
            return HARVEST_BOOST, "Kharif harvest season boost applied"

    return 0.0, ""


def get_rd_td_seasonal_boost(
    crop_type: str,
    harvest_months: List[int],
    current_month: int
) -> float:
    """
    Returns boost for RD/TD during harvest season.
    Farmers tend to save more right after harvest.
    """
    if current_month in harvest_months:
        return RD_TD_HARVEST_BOOST

    if crop_type in ['Rabi', 'Both']:
        if current_month in RABI_HARVEST_MONTHS:
            return RD_TD_HARVEST_BOOST

    if crop_type in ['Kharif', 'Both']:
        if current_month in KHARIF_HARVEST_MONTHS:
            return RD_TD_HARVEST_BOOST

    return 0.0
