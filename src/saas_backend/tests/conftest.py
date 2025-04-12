from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from collections.abc import Generator

from saas_backend.app import app
from saas_backend.auth.database import Base, get_db

engine = create_engine("sqlite:///test.db")
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def db_session() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


client = TestClient(app)


@pytest.fixture(scope="function", autouse=True)
def override_get_db():
    app.dependency_overrides[get_db] = db_session
    yield
    _ = app.dependency_overrides.pop(get_db, None)


@pytest.fixture(scope="function", autouse=True)
def mock_router_get_db():
    with patch("saas_backend.auth.router.get_db", side_effect=db_session):
        yield


@pytest.fixture(scope="function", autouse=True)
def mock_user_manager_get_db():
    with patch(
        "saas_backend.auth.user_manager.user_manager.get_db", side_effect=db_session
    ):
        yield


@pytest.fixture(scope="function", autouse=True)
def mock_jwt_handler_get_db():
    with patch(
        "saas_backend.auth.jwt_handler.jwt_handler.get_db", side_effect=db_session
    ):
        yield


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)

    yield
    Base.metadata.drop_all(bind=engine)
