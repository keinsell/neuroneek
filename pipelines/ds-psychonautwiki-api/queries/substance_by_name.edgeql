select default::Substance {
  id,
  common_names,
  brand_names,
  substitutive_name,
  unii,
  systematic_name,
  smiles,
  psychoactive_class,
  name,
  iupac,
  inchi_key,
  description,
  chemical_class,
  cas_number
}
filter .name = <str>$arg