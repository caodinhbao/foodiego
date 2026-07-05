from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator

app = FastAPI(
    title="FoodieGo Delivery Fee Service",
    description="Tính phí giao hàng dựa trên khoảng cách và giá trị đơn hàng",
    version="1.0.0",
)


# ── Schema ─────────────────────────────────────────────────────────────────
class DeliveryFeeRequest(BaseModel):
    distance_km: float
    order_amount: float

    @field_validator("distance_km")
    @classmethod
    def distance_must_be_positive(cls, value: float) -> float:
        if value < 0:
            raise ValueError("distance_km must be >= 0")
        return value

    @field_validator("order_amount")
    @classmethod
    def amount_must_be_positive(cls, value: float) -> float:
        if value < 0:
            raise ValueError("order_amount must be >= 0")
        return value


class DeliveryFeeResponse(BaseModel):
    delivery_fee: float
    breakdown: dict  # để báo cáo SPQM, trả thêm chi tiết


# ── Công thức tính phí ──────────────────────────────────────────────────────
# TODO (Thành viên C - Ngày 1):
# Công thức gợi ý:
#   base_fee = 10_000 (VND)
#   per_km   = 5_000  (VND/km)
#   raw_fee  = base_fee + distance_km * per_km
#
#   Giảm giá nếu order_amount cao:
#   - order_amount >= 200_000 → giảm 20%
#   - order_amount >= 100_000 → giảm 10%
#   - còn lại → không giảm
#
#   delivery_fee = max(0, raw_fee * (1 - discount))

BASE_FEE = 10_000
PER_KM_RATE = 5_000


def calculate_fee(distance_km: float, order_amount: float) -> dict:
    """
    Tính phí giao hàng theo công thức:
      raw_fee = base_fee + distance_km * per_km_rate
      discount: >=200k → 20%, >=100k → 10%, còn lại → 0%
      delivery_fee = max(0, raw_fee * (1 - discount_rate))
    """
    raw_fee = BASE_FEE + distance_km * PER_KM_RATE

    if order_amount >= 200_000:
        discount_rate = 0.20
    elif order_amount >= 100_000:
        discount_rate = 0.10
    else:
        discount_rate = 0.0

    discount_amount = raw_fee * discount_rate
    delivery_fee = max(0.0, round(raw_fee - discount_amount, 0))

    return {
        "delivery_fee": delivery_fee,
        "raw_fee": raw_fee,
        "discount_rate": discount_rate,
        "discount_amount": round(discount_amount, 0),
    }


# ── Endpoints ───────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "delivery-fee-service"}


@app.post("/delivery-fee/calculate", response_model=DeliveryFeeResponse)
def calculate_delivery_fee(data: DeliveryFeeRequest):
    """
    Tính phí giao hàng

    - **distance_km**: khoảng cách từ nhà hàng đến địa chỉ giao (km)
    - **order_amount**: tổng giá trị đơn hàng (VND)
    """
    result = calculate_fee(data.distance_km, data.order_amount)
    return DeliveryFeeResponse(
        delivery_fee=result["delivery_fee"],
        breakdown=result,
    )
