from typing import Any
import yaml


def to_dict(obj: Any):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


def read_config(config_name: str):
    try:
        with open("config.yaml", "r") as f:
            config = yaml.safe_load(f)
    except FileNotFoundError:
        raise FileNotFoundError("config.yaml not found")

    return config[config_name]
