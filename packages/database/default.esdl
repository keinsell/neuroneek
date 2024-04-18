using extension auth;

module default {
  type Substance {
    required property name -> str {
      constraint exclusive;
    };
    property common_names -> array<str>;
    property brand_names -> array<str>;
    property substitutive_name -> str {
      constraint exclusive;
    };
    property systematic_name -> str {
      constraint exclusive;
    };
    property unii -> str;
    property cas_number -> str {
      constraint exclusive;
    };
    property inchi_key -> str;
    property iupac -> str;
    property smiles -> str;
    property psychoactive_class -> array<str>;
    property chemical_class -> str;
    property description -> str;
  }
}
