table "account" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "username" {
    null = false
    type = text
  }
  column "password" {
    null = false
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  index "Account_username_key" {
    unique = true
    columns = [column.username]
  }
}
table "subject" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "firstName" {
    null = true
    type = text
  }
  column "lastName" {
    null = true
    type = text
  }
  column "dateOfBirth" {
    null = true
    type = datetime
  }
  column "weight" {
    null = true
    type = integer
  }
  column "height" {
    null = true
    type = integer
  }
  column "account_id" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "Subject_account_id_fkey" {
    columns = [column.account_id]
    ref_columns = [table.account.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
  index "Subject_account_id_key" {
    unique = true
    columns = [column.account_id]
  }
}
table "substance" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "name" {
    null = false
    type = text
  }
  column "common_names" {
    comment = "Common names are informal names for chemical compounds that are widely used in everyday language, but not necessarily scientifically accurate or consistent. They often reflect the historical or common usage of a compound, rather than its chemical structure or composition. This field is serialized from Vector<str>, and in this pericular case it's delimited by comma."
    null = false
    type = text
  }
  column "brand_names" {
    null = false
    type = text
  }
  column "substitutive_name" {
    comment = "Substitutive name is a type of chemical nomenclature used for organic compounds. In this system, the substitutive name of a compound is based on the name of the parent hydrocarbon, with the functional group (such as an alcohol or a carboxylic acid) indicated by a prefix or suffix."
    null = true
    type = text
  }
  column "systematic_name" {
    null = false
    type = text
  }
  column "pubchem_cid" {
    null = false
    type = integer
  }
  column "unii" {
    null = true
    type = text
  }
  column "cas_number" {
    null = true
    type = text
  }
  column "inchi_key" {
    comment = "InChIKey is a condensed, 27-character representation of a molecule's InChI (International Chemical Identifier)"
    null = false
    type = text
  }
  column "smiles" {
    null = false
    type = text
  }
  column "psychonautwiki_url" {
    null = true
    type = text
  }
  column "psychoactive_class" {
    null = false
    type = text
  }
  column "chemical_class" {
    null = true
    type = text
  }
  column "description" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  index "substance_id_key" {
    unique = true
    columns = [column.id]
  }
  index "substance_name_key" {
    unique = true
    columns = [column.name]
  }
  index "substance_substitutive_name_key" {
    unique = true
    columns = [column.substitutive_name]
  }
  index "substance_systematic_name_key" {
    unique = true
    columns = [column.systematic_name]
  }
  index "substance_pubchem_cid_key" {
    unique = true
    columns = [column.pubchem_cid]
  }
  index "substance_cas_number_key" {
    unique = true
    columns = [column.cas_number]
  }
  index "substance_inchi_key_key" {
    unique = true
    columns = [column.inchi_key]
  }
  index "substance_smiles_key" {
    unique = true
    columns = [column.smiles]
  }
}
table "substance_synonym" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "substanceId" {
    null = false
    type = text
  }
  column "name" {
    null = false
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "substance_synonym_substanceId_fkey" {
    columns = [column.substanceId]
    ref_columns = [table.substance.column.id]
    on_update = CASCADE
    on_delete = RESTRICT
  }
  index "substance_synonym_name_key" {
    unique = true
    columns = [column.name]
  }
}
table "substance_tolerance" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "substanceId" {
    null = false
    type = text
  }
  column "mechanism" {
    null = false
    type = text
  }
  column "mechanism_desciption" {
    null = true
    type = text
  }
  column "onset_mechanism" {
    null = false
    type = text
  }
  column "onset_description" {
    null = true
    type = text
  }
  column "decline_mechanism" {
    null = false
    type = text
  }
  column "decline_description" {
    null = true
    type = text
  }
  column "onset_duration" {
    null = true
    type = text
  }
  column "decline_to_baseline_duration" {
    null = true
    type = text
  }
  column "decline_to_half_duration" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "substance_tolerance_substanceId_fkey" {
    columns = [column.substanceId]
    ref_columns = [table.substance.column.id]
    on_update = CASCADE
    on_delete = RESTRICT
  }
  index "substance_tolerance_substanceId_key" {
    unique = true
    columns = [column.substanceId]
  }
}
table "chemical_class" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "name" {
    null = false
    type = text
  }
  column "description" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  index "chemical_class_name_key" {
    unique = true
    columns = [column.name]
  }
}
table "psychoactive_class" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "name" {
    null = false
    type = text
  }
  column "summary" {
    null = true
    type = text
  }
  column "description" {
    null = true
    type = text
  }
  column "substanceId" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "psychoactive_class_substanceId_fkey" {
    columns = [column.substanceId]
    ref_columns = [table.substance.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
  index "psychoactive_class_name_key" {
    unique = true
    columns = [column.name]
  }
}
table "substance_route_of_administration" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "substanceName" {
    null = false
    type = text
  }
  column "name" {
    null = false
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "substance_route_of_administration_substanceName_fkey" {
    columns = [column.substanceName]
    ref_columns = [table.substance.column.name]
    on_update = CASCADE
    on_delete = RESTRICT
  }
  index "substance_route_of_administration_name_substanceName_key" {
    unique = true
    columns = [column.name, column.substanceName]
  }
}
table "substance_route_of_administration_phase" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "classification" {
    null = false
    type = text
  }
  column "lower_duration" {
    null = true
    type = text
  }
  column "upper_duration" {
    null = true
    type = text
  }
  column "routeOfAdministrationId" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "route_of_administration_phase_routeOfAdministrationId_fkey" {
    columns = [column.routeOfAdministrationId]
    ref_columns = [table.substance_route_of_administration.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
  index "route_of_administration_phase_routeOfAdministrationId_classification_key" {
    unique = true
    columns = [column.routeOfAdministrationId, column.classification]
  }
}
table "substance_route_of_administration_dosage" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "intensity" {
    null = false
    type = text
  }
  column "lower_bound_amount" {
    null = true
    type = real
  }
  column "upper_bound_amount" {
    null = true
    type = real
  }
  column "unit" {
    null = false
    type = text
  }
  column "routeOfAdministrationId" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "route_of_administration_dosage_routeOfAdministrationId_fkey" {
    columns = [column.routeOfAdministrationId]
    ref_columns = [table.substance_route_of_administration.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
  index "route_of_administration_dosage_intensivity_routeOfAdministrationId_key" {
    unique = true
    columns = [column.intensity, column.routeOfAdministrationId]
  }
}
table "substance_interactions" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "substanceId" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "SubstanceInteraction_substanceId_fkey" {
    columns = [column.substanceId]
    ref_columns = [table.substance.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
}
table "substance_route_of_administration_phase_effects" {
  schema = schema.main
  column "A" {
    null = false
    type = text
  }
  column "B" {
    null = false
    type = text
  }
  foreign_key "_EffectToPhase_B_fkey" {
    columns = [column.B]
    ref_columns = [table.substance_route_of_administration_phase.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
  foreign_key "_EffectToPhase_A_fkey" {
    columns = [column.A]
    ref_columns = [table.effect.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
  index "_EffectToPhase_AB_unique" {
    unique = true
    columns = [column.A, column.B]
  }
  index "_EffectToPhase_B_index" {
    columns = [column.B]
  }
}
table "effect" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "name" {
    null = false
    type = text
  }
  column "slug" {
    null = false
    type = text
  }
  column "category" {
    null = true
    type = text
  }
  column "type" {
    null = true
    type = text
  }
  column "tags" {
    null = false
    type = text
  }
  column "summary" {
    null = true
    type = text
  }
  column "description" {
    null = false
    type = text
  }
  column "parameters" {
    null = false
    type = text
  }
  column "see_also" {
    null = false
    type = text
  }
  column "effectindex" {
    null = true
    type = text
  }
  column "psychonautwiki" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  index "Effect_name_key" {
    unique = true
    columns = [column.name]
  }
  index "Effect_slug_key" {
    unique = true
    columns = [column.slug]
  }
}
table "ingestion" {
  schema = schema.main
  column "id" {
    null = false
    type = integer
    auto_increment = true
  }
  column "substance_name" {
    null = true
    type = text
  }
  column "administration_route" {
    null = true
    type = text
  }
  column "dosage_unit" {
    null = true
    type = text(2)
  }

  column "dosage_amount" {
    null = true
    type = float
  }

  column "ingestion_date" {
    null = true
    type = datetime
  }

  column "subject_id" {
    null = true
    type = text
  }

  column "stash_id" {
    null = true
    type = text
  }

  primary_key {
    columns = [column.id]
  }
  foreign_key "fk_stash_ingestion_id" {
    columns = [column.stash_id]
    ref_columns = [table.stash.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
  foreign_key "fk_stash_substance_id" {
    columns = [column.substance_name]
    ref_columns = [table.substance.column.name]
    on_update = CASCADE
    on_delete = SET_NULL
  }
  foreign_key "fk_ingestion_subject_id" {
    columns = [column.subject_id]
    ref_columns = [table.subject.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
}
table "stash" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "owner_id" {
    null = false
    type = text
  }
  column "substance_id" {
    null = false
    type = text
  }
  column "addedDate" {
    null = true
    type = datetime
    default = sql("CURRENT_TIMESTAMP")
  }
  column "expiration" {
    null = true
    type = datetime
  }
  column "amount" {
    null = true
    type = integer
  }
  column "price" {
    null = true
    type = text
  }
  column "vendor" {
    null = true
    type = text
  }
  column "description" {
    null = true
    type = text
  }
  column "purity" {
    null    = true
    type    = integer
    default = 100
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "fk_stash_substance_id" {
    columns = [column.substance_id]
    ref_columns = [table.substance.column.name]
    on_update = CASCADE
    on_delete = RESTRICT
  }
  foreign_key "fk_stash_owner_id" {
    columns = [column.owner_id]
    ref_columns = [table.subject.column.id]
    on_update = CASCADE
    on_delete = RESTRICT
  }
}
schema "main" {
}
