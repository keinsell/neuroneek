insert default::Substance {
  common_names := <array<std::str>>$common_names,
  brand_names := <array<std::str>>$brand_names,
  substitutive_name := <std::str>$substitutive_name,
  cas_number := <std::str>$cas_number,
  chemical_class := <std::str>$chemical_class,
  description := <std::str>$description,
  inchi_key := <std::str>$inchi_key,
  iupac := <std::str>$iupac,
  name := <std::str>$name,
  psychoactive_class := <array<std::str>>$psychoactive_class,
  smiles := <std::str>$smiles,
  systematic_name := <std::str>$systematic_name,
  unii := <std::str>$unii
};