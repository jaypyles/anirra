from fastapi.testclient import TestClient


def register(client: TestClient, username: str, password: str):
    response = client.post(
        "/register", json={"username": username, "password": password}
    )
    return response.json()


def login(client: TestClient, username: str, password: str):
    response = client.post("/login", data={"username": username, "password": password})
    return response.headers["Set-Cookie"].split("=")[1].split(";")[0]


def create_api_key(client: TestClient, username: str, password: str):
    access_token = login(client, username, password)
    response = client.put(
        "/api-key", headers={"Authorization": f"Bearer {access_token}"}
    )
    return response.json()["api_key"]
