from typing import Any


def to_dict(obj: Any):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
