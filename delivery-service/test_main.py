# Tests cho FastAPI delivery service
# Thành viên C: Delivery Service

from fastapi.testclient import TestClient
from main import app, calculate_fee

client = TestClient(app)


# ── Unit tests cho hàm calculate_fee ──────────────────────────────────────
class TestCalculateFee:
    def test_basic_fee_no_discount(self):
        result = calculate_fee(2.0, 50_000)

        assert result["raw_fee"] == 20_000
        assert result["discount_rate"] == 0.0
        assert result["discount_amount"] == 0
        assert result["delivery_fee"] == 20_000

    def test_discount_10_percent_for_100k_order(self):
        result = calculate_fee(2.0, 100_000)

        assert result["raw_fee"] == 20_000
        assert result["discount_rate"] == 0.10
        assert result["discount_amount"] == 2_000
        assert result["delivery_fee"] == 18_000

    def test_discount_20_percent_for_200k_order(self):
        result = calculate_fee(2.0, 200_000)

        assert result["raw_fee"] == 20_000
        assert result["discount_rate"] == 0.20
        assert result["discount_amount"] == 4_000
        assert result["delivery_fee"] == 16_000

    def test_zero_distance(self):
        result = calculate_fee(0, 50_000)

        assert result["raw_fee"] == 10_000
        assert result["delivery_fee"] == 10_000

    def test_large_distance(self):
        result = calculate_fee(20, 50_000)

        assert result["raw_fee"] == 110_000
        assert result["delivery_fee"] == 110_000


# ── Integration tests qua HTTP ─────────────────────────────────────────────
class TestDeliveryFeeAPI:
    def test_health_check(self):
        response = client.get("/health")

        assert response.status_code == 200
        assert response.json() == {
            "status": "ok",
            "service": "delivery-fee-service",
        }

    def test_calculate_endpoint_returns_200(self):
        response = client.post(
            "/delivery-fee/calculate",
            json={
                "distance_km": 3.0,
                "order_amount": 150_000,
            },
        )

        assert response.status_code == 200

        body = response.json()
        assert body["delivery_fee"] == 22_500
        assert body["breakdown"]["raw_fee"] == 25_000
        assert body["breakdown"]["discount_rate"] == 0.10
        assert body["breakdown"]["discount_amount"] == 2_500

    def test_negative_distance_returns_422(self):
        response = client.post(
            "/delivery-fee/calculate",
            json={
                "distance_km": -1,
                "order_amount": 100_000,
            },
        )

        assert response.status_code == 422

    def test_missing_field_returns_422(self):
        response = client.post(
            "/delivery-fee/calculate",
            json={
                "distance_km": 3,
            },
        )

        assert response.status_code == 422

    def test_negative_order_amount_returns_422(self):
        response = client.post(
            "/delivery-fee/calculate",
            json={
                "distance_km": 3,
                "order_amount": -1,
            },
        )

        assert response.status_code == 422