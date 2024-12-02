import hashlib


def generate_substance_id(systematic_name: str) -> str:
    return str(hashlib.blake2b(systematic_name.encode()).hexdigest())

def generate_route_of_administration_id(substance_id: str, route_classification: str) -> str:
    id_format = f"substance_{substance_id},route_{route_classification}"
    hashed = hashlib.blake2b(id_format.encode()).hexdigest()
    return str(hashed)

def generate_route_of_administration_phase_id(route_of_administration_id: str, phase_classification: str) -> str:
    id_format = f"route_{route_of_administration_id},phase_{phase_classification}"
    hashed = hashlib.blake2b(id_format.encode()).hexdigest()
    return str(hashed)

def generate_route_of_administration_dosage_id(route_of_administration_id: str, dosage_classification: str) -> str:
    id_format = f"route_{route_of_administration_id},dosage_{dosage_classification}"
    hashed = hashlib.blake2b(id_format.encode()).hexdigest()
    return str(hashed)
