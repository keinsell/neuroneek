table "Account" {
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
table "Subject" {
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
    ref_columns = [table.Account.column.id]
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
    null = false
    type = text
  }
  column "brand_names" {
    null = false
    type = text
  }
  column "substitutive_name" {
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
  column "substance_name" {
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
  foreign_key "substance_route_of_administration_substance_name_fkey" {
    columns = [column.substance_name]
    ref_columns = [table.substance.column.name]
    on_update = CASCADE
    on_delete = RESTRICT
  }
  index "substance_route_of_administration_name_substance_name_key" {
    unique = true
    columns = [column.name, column.substance_name]
  }
}
table "route_of_administration_phase" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "classification" {
    null = false
    type = text
  }
  column "min_duration" {
    null = true
    type = integer
  }
  column "max_duration" {
    null = true
    type = integer
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
table "route_of_administration_dosage" {
  schema = schema.main
  column "id" {
    null = false
    type = text
  }
  column "intensivity" {
    null = false
    type = text
  }
  column "amount_min" {
    null = false
    type = real
  }
  column "amount_max" {
    null = false
    type = real
  }
  column "unit" {
    null = false
    type = text
  }
  column "perKilogram" {
    null    = false
    type    = boolean
    default = false
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
    columns = [column.intensivity, column.routeOfAdministrationId]
  }
}
table "Effect" {
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
table "Ingestion" {
  schema = schema.main
  column "id" {
    null = false
    type = text
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
    type = text
  }
  column "dosage_amount" {
    null = true
    type = integer
  }
  column "is_dosage_estimate" {
    null    = true
    type    = boolean
    default = false
  }
  column "ingested_at" {
    null = true
    type = datetime
  }
  column "subject_id" {
    null = true
    type = text
  }
  column "stashId" {
    null = true
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "Ingestion_stashId_fkey" {
    columns = [column.stashId]
    ref_columns = [table.Stash.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
  foreign_key "Ingestion_substance_name_fkey" {
    columns = [column.substance_name]
    ref_columns = [table.substance.column.name]
    on_update = CASCADE
    on_delete = SET_NULL
  }
  foreign_key "Ingestion_subject_id_fkey" {
    columns = [column.subject_id]
    ref_columns = [table.Subject.column.id]
    on_update = CASCADE
    on_delete = SET_NULL
  }
}
table "Stash" {
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
  foreign_key "Stash_substance_id_fkey" {
    columns = [column.substance_id]
    ref_columns = [table.substance.column.name]
    on_update = CASCADE
    on_delete = RESTRICT
  }
  foreign_key "Stash_owner_id_fkey" {
    columns = [column.owner_id]
    ref_columns = [table.Subject.column.id]
    on_update = CASCADE
    on_delete = RESTRICT
  }
}
table "SubstanceInteraction" {
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
table "_EffectToPhase" {
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
    ref_columns = [table.route_of_administration_phase.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
  foreign_key "_EffectToPhase_A_fkey" {
    columns = [column.A]
    ref_columns = [table.Effect.column.id]
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
schema "main" {
}
