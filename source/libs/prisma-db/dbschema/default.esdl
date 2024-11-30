using extension auth;

module default {
  type Substance {
    name: str {
    constraint exclusive;
    };
    common_names: array<str>;
    brand_names: array<str>;
    substitutive_name: str {
    constraint exclusive;
    };
  }
}
