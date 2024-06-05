from dataclasses import dataclass
from enum import Enum
import quantities


class DosageIntensivity(str, Enum):
    threshold = ("threshold",)
    light = ("light",)
    common = ("common",)
    strong = ("strong",)
    heavy = "heavy"


class DosageUnit(str, Enum):
    microgram = ("μg",)
    milligram = ("mg",)
    gram = ("g",)


@dataclass
class DosageRange:
    """Represents a range of dosage values with associated categories."""

    min_value: quantities.Quantity
    max_value: quantities.Quantity
    category: DosageIntensivity

    @classmethod
    def under_threshold(cls, max_value):
        return cls(
            quantities.UnitQuantity("-inf mg"), max_value, DosageIntensivity.threshold
        )

    @classmethod
    def light(cls, min_value, max_value):
        return cls(min_value, max_value, DosageIntensivity.light)

    @classmethod
    def common(cls, min_value, max_value):
        return cls(min_value, max_value, DosageIntensivity.common)

    @classmethod
    def strong(cls, min_value, max_value):
        return cls(min_value, max_value, DosageIntensivity.strong)

    @classmethod
    def heavy(cls, min_value):
        return cls(
            min_value, quantities.UnitQuantity("inf mg"), DosageIntensivity.heavy
        )

    def __contains__(self, dosage):
        """Allows checking if a dosage is within this range."""
        return self.min_value <= dosage <= self.max_value
