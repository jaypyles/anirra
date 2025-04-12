from freezegun import freeze_time
from saas_backend.tests.conftest import client

from unittest.mock import patch
import uuid

from saas_backend.tests.utils.user import create_api_key, login, register


class TestRegister:
    def test_register_user(self):
        response = client.post(
            "/register", json={"username": "test_register_user", "password": "test"}
        )

        assert response.status_code == 200
        assert response.json() == {"message": "User registered successfully"}

    def test_failed_register_user(self):
        register(client, "test_register_user", "test")
        response = client.post(
            "/register", json={"username": "test_register_user", "password": "test"}
        )
        assert response.status_code == 400
        assert response.json() == {"detail": "User with this username already exists"}


class TestLogin:
    def test_login(self):
        register(client, "test_login_user", "test")
        response = client.post(
            "/login", data={"username": "test_login_user", "password": "test"}
        )
        assert response.status_code == 200
        assert response.json() == {"message": "User logged in successfully"}

    def test_failed_login(self):
        register(client, "test_failed_login_user", "test")
        response = client.post(
            "/login", data={"username": "test_failed_login_user", "password": "wrong"}
        )
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid username or password"}


@freeze_time("2023-01-01")
class TestApiKey:
    def test_create_api_key(self):
        register(client, "test_create_api_key_user", "test")
        response = client.post(
            "/login",
            data={"username": "test_create_api_key_user", "password": "test"},
        )

        access_token = response.headers["Set-Cookie"].split("=")[1].split(";")[0]

        mock_uuid = uuid.UUID("12345678123456781234567812345678")
        with patch("uuid.uuid4", return_value=mock_uuid):
            response = client.put(
                "/api-key", headers={"Authorization": f"Bearer {access_token}"}
            )

            assert response.status_code == 200
            assert response.json() == {
                "message": "API key created successfully",
                "api_key": mock_uuid.hex,
            }

    def test_get_api_key(self):
        username = "test_get_api_key_user"
        register(client, username, "test")
        api_key = create_api_key(client, username, "test")
        access_token = login(client, username, "test")

        response = client.get(
            "/api-key", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 200
        assert response.json() == {
            "message": "API key retrieved successfully",
            "api_key": api_key,
        }

    def test_delete_api_key(self):
        username = "test_delete_api_key_user"
        register(client, username, "test")
        _ = create_api_key(client, username, "test")
        access_token = login(client, username, "test")

        response = client.delete(
            "/api-key", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 200
        assert response.json() == {"message": "API key deleted successfully"}

    def test_failed_delete_api_key(self):
        username = "test_failed_delete_api_key_user"
        register(client, username, "test")
        access_token = login(client, username, "test")

        response = client.delete(
            "/api-key", headers={"Authorization": f"Bearer {access_token}"}
        )

        assert response.status_code == 500
        assert response.json() == {"detail": "Error deleting API key"}
