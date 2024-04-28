
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 5.0.0
 * Query Engine version: 6b0aef69b7cdfc787f822ecd7cdc76d5f1991584
 */
Prisma.prismaVersion = {
  client: "5.0.0",
  engine: "6b0aef69b7cdfc787f822ecd7cdc76d5f1991584"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password'
};

exports.Prisma.SubjectScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',
  weight: 'weight',
  height: 'height',
  account_id: 'account_id'
};

exports.Prisma.SubstanceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  common_names: 'common_names',
  brand_names: 'brand_names',
  substitutive_name: 'substitutive_name',
  systematic_name: 'systematic_name',
  unii: 'unii',
  cas_number: 'cas_number',
  inchi_key: 'inchi_key',
  iupac: 'iupac',
  smiles: 'smiles',
  psychoactive_class: 'psychoactive_class',
  chemical_class: 'chemical_class',
  description: 'description'
};

exports.Prisma.RouteOfAdministrationScalarFieldEnum = {
  id: 'id',
  substanceName: 'substanceName',
  name: 'name',
  bioavailability: 'bioavailability'
};

exports.Prisma.PhaseScalarFieldEnum = {
  id: 'id',
  from: 'from',
  to: 'to',
  routeOfAdministrationId: 'routeOfAdministrationId'
};

exports.Prisma.DosageScalarFieldEnum = {
  id: 'id',
  intensivity: 'intensivity',
  amount_min: 'amount_min',
  amount_max: 'amount_max',
  unit: 'unit',
  perKilogram: 'perKilogram',
  routeOfAdministrationId: 'routeOfAdministrationId'
};

exports.Prisma.EffectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  category: 'category',
  type: 'type',
  tags: 'tags',
  summary: 'summary',
  description: 'description',
  parameters: 'parameters',
  see_also: 'see_also',
  effectindex: 'effectindex',
  psychonautwiki: 'psychonautwiki'
};

exports.Prisma.IngestionScalarFieldEnum = {
  id: 'id',
  substanceName: 'substanceName',
  routeOfAdministration: 'routeOfAdministration',
  dosage_unit: 'dosage_unit',
  dosage_amount: 'dosage_amount',
  isEstimatedDosage: 'isEstimatedDosage',
  date: 'date',
  subject_id: 'subject_id',
  stashId: 'stashId'
};

exports.Prisma.StashScalarFieldEnum = {
  id: 'id',
  owner_id: 'owner_id',
  substance_id: 'substance_id',
  addedDate: 'addedDate',
  expiration: 'expiration',
  amount: 'amount',
  price: 'price',
  vendor: 'vendor',
  description: 'description',
  purity: 'purity'
};

exports.Prisma.SubstanceInteractionScalarFieldEnum = {
  id: 'id',
  substanceId: 'substanceId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Account: 'Account',
  Subject: 'Subject',
  Substance: 'Substance',
  RouteOfAdministration: 'RouteOfAdministration',
  Phase: 'Phase',
  Dosage: 'Dosage',
  Effect: 'Effect',
  Ingestion: 'Ingestion',
  Stash: 'Stash',
  SubstanceInteraction: 'SubstanceInteraction'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
