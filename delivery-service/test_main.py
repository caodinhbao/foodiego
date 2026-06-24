# Tests cho FastAPI delivery service
# Thành viên C viết (Ngày 1 + Ngày 4)
# Chạy: pytest test_main.py -v

from fastapi.testclient import TestClient
from main import app, calculate_fee

client = TestClient(app)


# ── Unit tests cho hàm calculate_fee ──────────────────────────────────────
class TestCalculateFee:
    def test_basic_fee_no_discount(self):
        """
        TODO (Thành viên C - Ngày 1):
        Gọi calculate_fee(distance_km=2.0, order_amount=50_000)
        Expected: delivery_fee = 10_000 + 2 * 5_000 = 20_000 (không giảm)
        """
        # result = calculate_fee(2.0, 50_000)
        # assert result["delivery_fee"] == 20_000
        # assert result["discount_rate"] == 0.0
        assert True  # placeholder

    def test_discount_10_percent_for_100k_order(self):
        """
        TODO: order_amount = 100_000 → discount 10%
        """
        assert True  # placeholder

    def test_discount_20_percent_for_200k_order(self):
        """
        TODO: order_amount = 200_000 → discount 20%
        """
        assert True  # placeholder

    def test_zero_distance(self):
        """
        TODO: distance_km = 0 → chỉ tính base_fee = 10_000
        """
        assert True  # placeholder

    def test_large_distance(self):
        """
        TODO: distance_km = 20 → raw_fee = 10_000 + 20*5_000 = 110_000
        """
        assert True  # placeholder


# ── Integration tests qua HTTP ─────────────────────────────────────────────
class TestDeliveryFeeAPI:
    def test_health_check(self):
        res = client.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "ok"

    def test_calculate_endpoint_returns_200(self):
        """
        TODO (Thành viên C - Ngày 1):
        Gọi POST /delivery-fee/calculate với body hợp lệ
        Expected: 200 + có field delivery_fee
        """
        # res = client.post("/delivery-fee/calculate", json={
        #     "distance_km": 3.0,
        #     "order_amount": 150_000
        # })
        # assert res.status_code == 200
        # assert "delivery_fee" in res.json()
        assert True  # placeholder

    def test_negative_distance_returns_422(self):
        """
        TODO: gửi distance_km = -1 → expect 422 Unprocessable Entity
        """
        # res = client.post("/delivery-fee/calculate", json={
        #     "distance_km": -1,
        #     "order_amount": 100_000
        # })
        # assert res.status_code == 422
        assert True  # placeholder

    def test_missing_field_returns_422(self):
        """
        TODO: gửi thiếu order_amount → expect 422
        """
        assert True  # placeholder
