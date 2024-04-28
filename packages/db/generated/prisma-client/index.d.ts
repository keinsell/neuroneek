
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type AccountPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Account"
  objects: {
    Subject: SubjectPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    username: string
    password: string
  }, ExtArgs["result"]["account"]>
  composites: {}
}

/**
 * Model Account
 * 
 */
export type Account = runtime.Types.DefaultSelection<AccountPayload>
export type SubjectPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Subject"
  objects: {
    account: AccountPayload<ExtArgs> | null
    Ingestions: IngestionPayload<ExtArgs>[]
    Stash: StashPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    firstName: string | null
    lastName: string | null
    dateOfBirth: Date | null
    weight: number | null
    height: number | null
    account_id: string | null
  }, ExtArgs["result"]["subject"]>
  composites: {}
}

/**
 * Model Subject
 * 
 */
export type Subject = runtime.Types.DefaultSelection<SubjectPayload>
export type SubstancePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Substance"
  objects: {
    routes_of_administration: RouteOfAdministrationPayload<ExtArgs>[]
    Ingestion: IngestionPayload<ExtArgs>[]
    Stash: StashPayload<ExtArgs>[]
    SubstanceInteraction: SubstanceInteractionPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    name: string
    /**
     * Common names are informal names for chemical compounds that are widely used in everyday language, but not necessarily scientifically accurate or consistent. They often reflect the historical or common usage of a compound, rather than its chemical structure or composition.
     */
    common_names: string
    brand_names: string
    /**
     * Substitutive name is a type of chemical nomenclature used for organic compounds. In this system, the substitutive name of a compound is based on the name of the parent hydrocarbon, with the functional group (such as an alcohol or a carboxylic acid) indicated by a prefix or suffix.
     */
    substitutive_name: string | null
    systematic_name: string | null
    unii: string | null
    cas_number: string | null
    inchi_key: string | null
    iupac: string | null
    smiles: string | null
    psychoactive_class: string
    chemical_class: string | null
    description: string | null
  }, ExtArgs["result"]["substance"]>
  composites: {}
}

/**
 * Model Substance
 * 
 */
export type Substance = runtime.Types.DefaultSelection<SubstancePayload>
export type RouteOfAdministrationPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "RouteOfAdministration"
  objects: {
    dosage: DosagePayload<ExtArgs>[]
    phases: PhasePayload<ExtArgs>[]
    Substance: SubstancePayload<ExtArgs> | null
  }
  scalars: $Extensions.GetResult<{
    id: string
    substanceName: string | null
    name: string
    bioavailability: number
  }, ExtArgs["result"]["routeOfAdministration"]>
  composites: {}
}

/**
 * Model RouteOfAdministration
 * 
 */
export type RouteOfAdministration = runtime.Types.DefaultSelection<RouteOfAdministrationPayload>
export type PhasePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Phase"
  objects: {
    RouteOfAdministration: RouteOfAdministrationPayload<ExtArgs> | null
    effects: EffectPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    from: number | null
    to: number | null
    routeOfAdministrationId: string | null
  }, ExtArgs["result"]["phase"]>
  composites: {}
}

/**
 * Model Phase
 * 
 */
export type Phase = runtime.Types.DefaultSelection<PhasePayload>
export type DosagePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Dosage"
  objects: {
    RouteOfAdministration: RouteOfAdministrationPayload<ExtArgs> | null
  }
  scalars: $Extensions.GetResult<{
    id: string
    intensivity: string
    amount_min: number
    amount_max: number
    unit: string
    perKilogram: boolean
    routeOfAdministrationId: string | null
  }, ExtArgs["result"]["dosage"]>
  composites: {}
}

/**
 * Model Dosage
 * 
 */
export type Dosage = runtime.Types.DefaultSelection<DosagePayload>
export type EffectPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Effect"
  objects: {
    Phase: PhasePayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    name: string
    slug: string
    category: string | null
    type: string | null
    tags: string
    summary: string | null
    description: string
    parameters: string
    see_also: string
    effectindex: string | null
    psychonautwiki: string | null
  }, ExtArgs["result"]["effect"]>
  composites: {}
}

/**
 * Model Effect
 * 
 */
export type Effect = runtime.Types.DefaultSelection<EffectPayload>
export type IngestionPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Ingestion"
  objects: {
    Subject: SubjectPayload<ExtArgs> | null
    Substance: SubstancePayload<ExtArgs> | null
    Stash: StashPayload<ExtArgs> | null
  }
  scalars: $Extensions.GetResult<{
    id: string
    substanceName: string | null
    routeOfAdministration: string | null
    dosage_unit: string | null
    dosage_amount: number | null
    isEstimatedDosage: boolean | null
    date: Date | null
    subject_id: string | null
    stashId: string | null
  }, ExtArgs["result"]["ingestion"]>
  composites: {}
}

/**
 * Model Ingestion
 * 
 */
export type Ingestion = runtime.Types.DefaultSelection<IngestionPayload>
export type StashPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Stash"
  objects: {
    Subject: SubjectPayload<ExtArgs> | null
    Substance: SubstancePayload<ExtArgs>
    ingestions: IngestionPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    owner_id: string
    substance_id: string
    addedDate: Date | null
    expiration: Date | null
    amount: number | null
    price: string | null
    vendor: string | null
    description: string | null
    purity: number | null
  }, ExtArgs["result"]["stash"]>
  composites: {}
}

/**
 * Model Stash
 * 
 */
export type Stash = runtime.Types.DefaultSelection<StashPayload>
export type SubstanceInteractionPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "SubstanceInteraction"
  objects: {
    Substance: SubstancePayload<ExtArgs> | null
  }
  scalars: $Extensions.GetResult<{
    id: string
    substanceId: string | null
  }, ExtArgs["result"]["substanceInteraction"]>
  composites: {}
}

/**
 * Model SubstanceInteraction
 * 
 */
export type SubstanceInteraction = runtime.Types.DefaultSelection<SubstanceInteractionPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs>;

  /**
   * `prisma.subject`: Exposes CRUD operations for the **Subject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subjects
    * const subjects = await prisma.subject.findMany()
    * ```
    */
  get subject(): Prisma.SubjectDelegate<ExtArgs>;

  /**
   * `prisma.substance`: Exposes CRUD operations for the **Substance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Substances
    * const substances = await prisma.substance.findMany()
    * ```
    */
  get substance(): Prisma.SubstanceDelegate<ExtArgs>;

  /**
   * `prisma.routeOfAdministration`: Exposes CRUD operations for the **RouteOfAdministration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RouteOfAdministrations
    * const routeOfAdministrations = await prisma.routeOfAdministration.findMany()
    * ```
    */
  get routeOfAdministration(): Prisma.RouteOfAdministrationDelegate<ExtArgs>;

  /**
   * `prisma.phase`: Exposes CRUD operations for the **Phase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Phases
    * const phases = await prisma.phase.findMany()
    * ```
    */
  get phase(): Prisma.PhaseDelegate<ExtArgs>;

  /**
   * `prisma.dosage`: Exposes CRUD operations for the **Dosage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dosages
    * const dosages = await prisma.dosage.findMany()
    * ```
    */
  get dosage(): Prisma.DosageDelegate<ExtArgs>;

  /**
   * `prisma.effect`: Exposes CRUD operations for the **Effect** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Effects
    * const effects = await prisma.effect.findMany()
    * ```
    */
  get effect(): Prisma.EffectDelegate<ExtArgs>;

  /**
   * `prisma.ingestion`: Exposes CRUD operations for the **Ingestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ingestions
    * const ingestions = await prisma.ingestion.findMany()
    * ```
    */
  get ingestion(): Prisma.IngestionDelegate<ExtArgs>;

  /**
   * `prisma.stash`: Exposes CRUD operations for the **Stash** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Stashes
    * const stashes = await prisma.stash.findMany()
    * ```
    */
  get stash(): Prisma.StashDelegate<ExtArgs>;

  /**
   * `prisma.substanceInteraction`: Exposes CRUD operations for the **SubstanceInteraction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubstanceInteractions
    * const substanceInteractions = await prisma.substanceInteraction.findMany()
    * ```
    */
  get substanceInteraction(): Prisma.SubstanceInteractionDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export type Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export type Args<T, F extends $Public.Operation> = $Public.Args<T, F>
  export type Payload<T, F extends $Public.Operation> = $Public.Payload<T, F>
  export type Result<T, A, F extends $Public.Operation> = $Public.Result<T, A, F>
  export type Exact<T, W> = $Public.Exact<T, W>

  /**
   * Prisma Client JS version: 5.0.0
   * Query Engine version: 6b0aef69b7cdfc787f822ecd7cdc76d5f1991584
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'account' | 'subject' | 'substance' | 'routeOfAdministration' | 'phase' | 'dosage' | 'effect' | 'ingestion' | 'stash' | 'substanceInteraction'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      Account: {
        payload: AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload>
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>,
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Subject: {
        payload: SubjectPayload<ExtArgs>
        fields: Prisma.SubjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubjectFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubjectFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload>
          }
          findFirst: {
            args: Prisma.SubjectFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubjectFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload>
          }
          findMany: {
            args: Prisma.SubjectFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload>[]
          }
          create: {
            args: Prisma.SubjectCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload>
          }
          delete: {
            args: Prisma.SubjectDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload>
          }
          update: {
            args: Prisma.SubjectUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload>
          }
          deleteMany: {
            args: Prisma.SubjectDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SubjectUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SubjectUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubjectPayload>
          }
          aggregate: {
            args: Prisma.SubjectAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSubject>
          }
          groupBy: {
            args: Prisma.SubjectGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SubjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubjectCountArgs<ExtArgs>,
            result: $Utils.Optional<SubjectCountAggregateOutputType> | number
          }
        }
      }
      Substance: {
        payload: SubstancePayload<ExtArgs>
        fields: Prisma.SubstanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubstanceFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubstanceFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload>
          }
          findFirst: {
            args: Prisma.SubstanceFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubstanceFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload>
          }
          findMany: {
            args: Prisma.SubstanceFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload>[]
          }
          create: {
            args: Prisma.SubstanceCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload>
          }
          delete: {
            args: Prisma.SubstanceDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload>
          }
          update: {
            args: Prisma.SubstanceUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload>
          }
          deleteMany: {
            args: Prisma.SubstanceDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SubstanceUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SubstanceUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstancePayload>
          }
          aggregate: {
            args: Prisma.SubstanceAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSubstance>
          }
          groupBy: {
            args: Prisma.SubstanceGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SubstanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubstanceCountArgs<ExtArgs>,
            result: $Utils.Optional<SubstanceCountAggregateOutputType> | number
          }
        }
      }
      RouteOfAdministration: {
        payload: RouteOfAdministrationPayload<ExtArgs>
        fields: Prisma.RouteOfAdministrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RouteOfAdministrationFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RouteOfAdministrationFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload>
          }
          findFirst: {
            args: Prisma.RouteOfAdministrationFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RouteOfAdministrationFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload>
          }
          findMany: {
            args: Prisma.RouteOfAdministrationFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload>[]
          }
          create: {
            args: Prisma.RouteOfAdministrationCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload>
          }
          delete: {
            args: Prisma.RouteOfAdministrationDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload>
          }
          update: {
            args: Prisma.RouteOfAdministrationUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload>
          }
          deleteMany: {
            args: Prisma.RouteOfAdministrationDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.RouteOfAdministrationUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.RouteOfAdministrationUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<RouteOfAdministrationPayload>
          }
          aggregate: {
            args: Prisma.RouteOfAdministrationAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateRouteOfAdministration>
          }
          groupBy: {
            args: Prisma.RouteOfAdministrationGroupByArgs<ExtArgs>,
            result: $Utils.Optional<RouteOfAdministrationGroupByOutputType>[]
          }
          count: {
            args: Prisma.RouteOfAdministrationCountArgs<ExtArgs>,
            result: $Utils.Optional<RouteOfAdministrationCountAggregateOutputType> | number
          }
        }
      }
      Phase: {
        payload: PhasePayload<ExtArgs>
        fields: Prisma.PhaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhaseFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhaseFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload>
          }
          findFirst: {
            args: Prisma.PhaseFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhaseFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload>
          }
          findMany: {
            args: Prisma.PhaseFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload>[]
          }
          create: {
            args: Prisma.PhaseCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload>
          }
          delete: {
            args: Prisma.PhaseDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload>
          }
          update: {
            args: Prisma.PhaseUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload>
          }
          deleteMany: {
            args: Prisma.PhaseDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.PhaseUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.PhaseUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<PhasePayload>
          }
          aggregate: {
            args: Prisma.PhaseAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePhase>
          }
          groupBy: {
            args: Prisma.PhaseGroupByArgs<ExtArgs>,
            result: $Utils.Optional<PhaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhaseCountArgs<ExtArgs>,
            result: $Utils.Optional<PhaseCountAggregateOutputType> | number
          }
        }
      }
      Dosage: {
        payload: DosagePayload<ExtArgs>
        fields: Prisma.DosageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DosageFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DosageFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload>
          }
          findFirst: {
            args: Prisma.DosageFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DosageFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload>
          }
          findMany: {
            args: Prisma.DosageFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload>[]
          }
          create: {
            args: Prisma.DosageCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload>
          }
          delete: {
            args: Prisma.DosageDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload>
          }
          update: {
            args: Prisma.DosageUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload>
          }
          deleteMany: {
            args: Prisma.DosageDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DosageUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DosageUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<DosagePayload>
          }
          aggregate: {
            args: Prisma.DosageAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDosage>
          }
          groupBy: {
            args: Prisma.DosageGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DosageGroupByOutputType>[]
          }
          count: {
            args: Prisma.DosageCountArgs<ExtArgs>,
            result: $Utils.Optional<DosageCountAggregateOutputType> | number
          }
        }
      }
      Effect: {
        payload: EffectPayload<ExtArgs>
        fields: Prisma.EffectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EffectFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EffectFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload>
          }
          findFirst: {
            args: Prisma.EffectFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EffectFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload>
          }
          findMany: {
            args: Prisma.EffectFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload>[]
          }
          create: {
            args: Prisma.EffectCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload>
          }
          delete: {
            args: Prisma.EffectDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload>
          }
          update: {
            args: Prisma.EffectUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload>
          }
          deleteMany: {
            args: Prisma.EffectDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.EffectUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.EffectUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EffectPayload>
          }
          aggregate: {
            args: Prisma.EffectAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateEffect>
          }
          groupBy: {
            args: Prisma.EffectGroupByArgs<ExtArgs>,
            result: $Utils.Optional<EffectGroupByOutputType>[]
          }
          count: {
            args: Prisma.EffectCountArgs<ExtArgs>,
            result: $Utils.Optional<EffectCountAggregateOutputType> | number
          }
        }
      }
      Ingestion: {
        payload: IngestionPayload<ExtArgs>
        fields: Prisma.IngestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IngestionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IngestionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload>
          }
          findFirst: {
            args: Prisma.IngestionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IngestionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload>
          }
          findMany: {
            args: Prisma.IngestionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload>[]
          }
          create: {
            args: Prisma.IngestionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload>
          }
          delete: {
            args: Prisma.IngestionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload>
          }
          update: {
            args: Prisma.IngestionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload>
          }
          deleteMany: {
            args: Prisma.IngestionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.IngestionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.IngestionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<IngestionPayload>
          }
          aggregate: {
            args: Prisma.IngestionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateIngestion>
          }
          groupBy: {
            args: Prisma.IngestionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<IngestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.IngestionCountArgs<ExtArgs>,
            result: $Utils.Optional<IngestionCountAggregateOutputType> | number
          }
        }
      }
      Stash: {
        payload: StashPayload<ExtArgs>
        fields: Prisma.StashFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StashFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StashFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload>
          }
          findFirst: {
            args: Prisma.StashFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StashFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload>
          }
          findMany: {
            args: Prisma.StashFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload>[]
          }
          create: {
            args: Prisma.StashCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload>
          }
          delete: {
            args: Prisma.StashDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload>
          }
          update: {
            args: Prisma.StashUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload>
          }
          deleteMany: {
            args: Prisma.StashDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.StashUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.StashUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<StashPayload>
          }
          aggregate: {
            args: Prisma.StashAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateStash>
          }
          groupBy: {
            args: Prisma.StashGroupByArgs<ExtArgs>,
            result: $Utils.Optional<StashGroupByOutputType>[]
          }
          count: {
            args: Prisma.StashCountArgs<ExtArgs>,
            result: $Utils.Optional<StashCountAggregateOutputType> | number
          }
        }
      }
      SubstanceInteraction: {
        payload: SubstanceInteractionPayload<ExtArgs>
        fields: Prisma.SubstanceInteractionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubstanceInteractionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubstanceInteractionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload>
          }
          findFirst: {
            args: Prisma.SubstanceInteractionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubstanceInteractionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload>
          }
          findMany: {
            args: Prisma.SubstanceInteractionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload>[]
          }
          create: {
            args: Prisma.SubstanceInteractionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload>
          }
          delete: {
            args: Prisma.SubstanceInteractionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload>
          }
          update: {
            args: Prisma.SubstanceInteractionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload>
          }
          deleteMany: {
            args: Prisma.SubstanceInteractionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SubstanceInteractionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SubstanceInteractionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<SubstanceInteractionPayload>
          }
          aggregate: {
            args: Prisma.SubstanceInteractionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSubstanceInteraction>
          }
          groupBy: {
            args: Prisma.SubstanceInteractionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SubstanceInteractionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubstanceInteractionCountArgs<ExtArgs>,
            result: $Utils.Optional<SubstanceInteractionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AccountCountOutputType
   */


  export type AccountCountOutputType = {
    Subject: number
  }

  export type AccountCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    Subject?: boolean | AccountCountOutputTypeCountSubjectArgs
  }

  // Custom InputTypes

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCountOutputType
     */
    select?: AccountCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountSubjectArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubjectWhereInput
  }



  /**
   * Count Type SubjectCountOutputType
   */


  export type SubjectCountOutputType = {
    Ingestions: number
    Stash: number
  }

  export type SubjectCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    Ingestions?: boolean | SubjectCountOutputTypeCountIngestionsArgs
    Stash?: boolean | SubjectCountOutputTypeCountStashArgs
  }

  // Custom InputTypes

  /**
   * SubjectCountOutputType without action
   */
  export type SubjectCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjectCountOutputType
     */
    select?: SubjectCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * SubjectCountOutputType without action
   */
  export type SubjectCountOutputTypeCountIngestionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: IngestionWhereInput
  }


  /**
   * SubjectCountOutputType without action
   */
  export type SubjectCountOutputTypeCountStashArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: StashWhereInput
  }



  /**
   * Count Type SubstanceCountOutputType
   */


  export type SubstanceCountOutputType = {
    routes_of_administration: number
    Ingestion: number
    Stash: number
    SubstanceInteraction: number
  }

  export type SubstanceCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    routes_of_administration?: boolean | SubstanceCountOutputTypeCountRoutes_of_administrationArgs
    Ingestion?: boolean | SubstanceCountOutputTypeCountIngestionArgs
    Stash?: boolean | SubstanceCountOutputTypeCountStashArgs
    SubstanceInteraction?: boolean | SubstanceCountOutputTypeCountSubstanceInteractionArgs
  }

  // Custom InputTypes

  /**
   * SubstanceCountOutputType without action
   */
  export type SubstanceCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceCountOutputType
     */
    select?: SubstanceCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * SubstanceCountOutputType without action
   */
  export type SubstanceCountOutputTypeCountRoutes_of_administrationArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: RouteOfAdministrationWhereInput
  }


  /**
   * SubstanceCountOutputType without action
   */
  export type SubstanceCountOutputTypeCountIngestionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: IngestionWhereInput
  }


  /**
   * SubstanceCountOutputType without action
   */
  export type SubstanceCountOutputTypeCountStashArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: StashWhereInput
  }


  /**
   * SubstanceCountOutputType without action
   */
  export type SubstanceCountOutputTypeCountSubstanceInteractionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubstanceInteractionWhereInput
  }



  /**
   * Count Type RouteOfAdministrationCountOutputType
   */


  export type RouteOfAdministrationCountOutputType = {
    dosage: number
    phases: number
  }

  export type RouteOfAdministrationCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    dosage?: boolean | RouteOfAdministrationCountOutputTypeCountDosageArgs
    phases?: boolean | RouteOfAdministrationCountOutputTypeCountPhasesArgs
  }

  // Custom InputTypes

  /**
   * RouteOfAdministrationCountOutputType without action
   */
  export type RouteOfAdministrationCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministrationCountOutputType
     */
    select?: RouteOfAdministrationCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * RouteOfAdministrationCountOutputType without action
   */
  export type RouteOfAdministrationCountOutputTypeCountDosageArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: DosageWhereInput
  }


  /**
   * RouteOfAdministrationCountOutputType without action
   */
  export type RouteOfAdministrationCountOutputTypeCountPhasesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: PhaseWhereInput
  }



  /**
   * Count Type PhaseCountOutputType
   */


  export type PhaseCountOutputType = {
    effects: number
  }

  export type PhaseCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    effects?: boolean | PhaseCountOutputTypeCountEffectsArgs
  }

  // Custom InputTypes

  /**
   * PhaseCountOutputType without action
   */
  export type PhaseCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhaseCountOutputType
     */
    select?: PhaseCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * PhaseCountOutputType without action
   */
  export type PhaseCountOutputTypeCountEffectsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: EffectWhereInput
  }



  /**
   * Count Type EffectCountOutputType
   */


  export type EffectCountOutputType = {
    Phase: number
  }

  export type EffectCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    Phase?: boolean | EffectCountOutputTypeCountPhaseArgs
  }

  // Custom InputTypes

  /**
   * EffectCountOutputType without action
   */
  export type EffectCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EffectCountOutputType
     */
    select?: EffectCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * EffectCountOutputType without action
   */
  export type EffectCountOutputTypeCountPhaseArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: PhaseWhereInput
  }



  /**
   * Count Type StashCountOutputType
   */


  export type StashCountOutputType = {
    ingestions: number
  }

  export type StashCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    ingestions?: boolean | StashCountOutputTypeCountIngestionsArgs
  }

  // Custom InputTypes

  /**
   * StashCountOutputType without action
   */
  export type StashCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StashCountOutputType
     */
    select?: StashCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * StashCountOutputType without action
   */
  export type StashCountOutputTypeCountIngestionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: IngestionWhereInput
  }



  /**
   * Models
   */

  /**
   * Model Account
   */


  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    username: number
    password: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }


  export type AccountGroupByOutputType = {
    id: string
    username: string
    password: string
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    Subject?: boolean | Account$SubjectArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
  }

  export type AccountInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    Subject?: boolean | Account$SubjectArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeArgs<ExtArgs>
  }


  type AccountGetPayload<S extends boolean | null | undefined | AccountArgs> = $Types.GetResult<AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<AccountFindManyArgs, 'select' | 'include'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AccountFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>
    ): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Account that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AccountFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>
    ): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AccountFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<AccountPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
    **/
    create<T extends AccountCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountCreateArgs<ExtArgs>>
    ): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
    **/
    delete<T extends AccountDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>
    ): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AccountUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>
    ): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AccountDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AccountUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
    **/
    upsert<T extends AccountUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>
    ): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    Subject<T extends Account$SubjectArgs<ExtArgs> = {}>(args?: Subset<T, Account$SubjectArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'findMany'>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the Account model
   */ 
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly username: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes

  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }


  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }


  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }


  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }


  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }


  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }


  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }


  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
  }


  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }


  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }


  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
  }


  /**
   * Account.Subject
   */
  export type Account$SubjectArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    where?: SubjectWhereInput
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    cursor?: SubjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }


  /**
   * Account without action
   */
  export type AccountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
  }



  /**
   * Model Subject
   */


  export type AggregateSubject = {
    _count: SubjectCountAggregateOutputType | null
    _avg: SubjectAvgAggregateOutputType | null
    _sum: SubjectSumAggregateOutputType | null
    _min: SubjectMinAggregateOutputType | null
    _max: SubjectMaxAggregateOutputType | null
  }

  export type SubjectAvgAggregateOutputType = {
    weight: number | null
    height: number | null
  }

  export type SubjectSumAggregateOutputType = {
    weight: number | null
    height: number | null
  }

  export type SubjectMinAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    dateOfBirth: Date | null
    weight: number | null
    height: number | null
    account_id: string | null
  }

  export type SubjectMaxAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    dateOfBirth: Date | null
    weight: number | null
    height: number | null
    account_id: string | null
  }

  export type SubjectCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    dateOfBirth: number
    weight: number
    height: number
    account_id: number
    _all: number
  }


  export type SubjectAvgAggregateInputType = {
    weight?: true
    height?: true
  }

  export type SubjectSumAggregateInputType = {
    weight?: true
    height?: true
  }

  export type SubjectMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    dateOfBirth?: true
    weight?: true
    height?: true
    account_id?: true
  }

  export type SubjectMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    dateOfBirth?: true
    weight?: true
    height?: true
    account_id?: true
  }

  export type SubjectCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    dateOfBirth?: true
    weight?: true
    height?: true
    account_id?: true
    _all?: true
  }

  export type SubjectAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subject to aggregate.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subjects
    **/
    _count?: true | SubjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubjectMaxAggregateInputType
  }

  export type GetSubjectAggregateType<T extends SubjectAggregateArgs> = {
        [P in keyof T & keyof AggregateSubject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubject[P]>
      : GetScalarType<T[P], AggregateSubject[P]>
  }




  export type SubjectGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubjectWhereInput
    orderBy?: SubjectOrderByWithAggregationInput | SubjectOrderByWithAggregationInput[]
    by: SubjectScalarFieldEnum[] | SubjectScalarFieldEnum
    having?: SubjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubjectCountAggregateInputType | true
    _avg?: SubjectAvgAggregateInputType
    _sum?: SubjectSumAggregateInputType
    _min?: SubjectMinAggregateInputType
    _max?: SubjectMaxAggregateInputType
  }


  export type SubjectGroupByOutputType = {
    id: string
    firstName: string | null
    lastName: string | null
    dateOfBirth: Date | null
    weight: number | null
    height: number | null
    account_id: string | null
    _count: SubjectCountAggregateOutputType | null
    _avg: SubjectAvgAggregateOutputType | null
    _sum: SubjectSumAggregateOutputType | null
    _min: SubjectMinAggregateOutputType | null
    _max: SubjectMaxAggregateOutputType | null
  }

  type GetSubjectGroupByPayload<T extends SubjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubjectGroupByOutputType[P]>
            : GetScalarType<T[P], SubjectGroupByOutputType[P]>
        }
      >
    >


  export type SubjectSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    dateOfBirth?: boolean
    weight?: boolean
    height?: boolean
    account_id?: boolean
    account?: boolean | Subject$accountArgs<ExtArgs>
    Ingestions?: boolean | Subject$IngestionsArgs<ExtArgs>
    Stash?: boolean | Subject$StashArgs<ExtArgs>
    _count?: boolean | SubjectCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["subject"]>

  export type SubjectSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    dateOfBirth?: boolean
    weight?: boolean
    height?: boolean
    account_id?: boolean
  }

  export type SubjectInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    account?: boolean | Subject$accountArgs<ExtArgs>
    Ingestions?: boolean | Subject$IngestionsArgs<ExtArgs>
    Stash?: boolean | Subject$StashArgs<ExtArgs>
    _count?: boolean | SubjectCountOutputTypeArgs<ExtArgs>
  }


  type SubjectGetPayload<S extends boolean | null | undefined | SubjectArgs> = $Types.GetResult<SubjectPayload, S>

  type SubjectCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<SubjectFindManyArgs, 'select' | 'include'> & {
      select?: SubjectCountAggregateInputType | true
    }

  export interface SubjectDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subject'], meta: { name: 'Subject' } }
    /**
     * Find zero or one Subject that matches the filter.
     * @param {SubjectFindUniqueArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SubjectFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SubjectFindUniqueArgs<ExtArgs>>
    ): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Subject that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SubjectFindUniqueOrThrowArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SubjectFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubjectFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Subject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindFirstArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SubjectFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SubjectFindFirstArgs<ExtArgs>>
    ): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Subject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindFirstOrThrowArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SubjectFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubjectFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Subjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subjects
     * const subjects = await prisma.subject.findMany()
     * 
     * // Get first 10 Subjects
     * const subjects = await prisma.subject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subjectWithIdOnly = await prisma.subject.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SubjectFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubjectFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Subject.
     * @param {SubjectCreateArgs} args - Arguments to create a Subject.
     * @example
     * // Create one Subject
     * const Subject = await prisma.subject.create({
     *   data: {
     *     // ... data to create a Subject
     *   }
     * })
     * 
    **/
    create<T extends SubjectCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SubjectCreateArgs<ExtArgs>>
    ): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a Subject.
     * @param {SubjectDeleteArgs} args - Arguments to delete one Subject.
     * @example
     * // Delete one Subject
     * const Subject = await prisma.subject.delete({
     *   where: {
     *     // ... filter to delete one Subject
     *   }
     * })
     * 
    **/
    delete<T extends SubjectDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SubjectDeleteArgs<ExtArgs>>
    ): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Subject.
     * @param {SubjectUpdateArgs} args - Arguments to update one Subject.
     * @example
     * // Update one Subject
     * const subject = await prisma.subject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SubjectUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SubjectUpdateArgs<ExtArgs>>
    ): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Subjects.
     * @param {SubjectDeleteManyArgs} args - Arguments to filter Subjects to delete.
     * @example
     * // Delete a few Subjects
     * const { count } = await prisma.subject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SubjectDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubjectDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subjects
     * const subject = await prisma.subject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SubjectUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SubjectUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subject.
     * @param {SubjectUpsertArgs} args - Arguments to update or create a Subject.
     * @example
     * // Update or create a Subject
     * const subject = await prisma.subject.upsert({
     *   create: {
     *     // ... data to create a Subject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subject we want to update
     *   }
     * })
    **/
    upsert<T extends SubjectUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SubjectUpsertArgs<ExtArgs>>
    ): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Subjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectCountArgs} args - Arguments to filter Subjects to count.
     * @example
     * // Count the number of Subjects
     * const count = await prisma.subject.count({
     *   where: {
     *     // ... the filter for the Subjects we want to count
     *   }
     * })
    **/
    count<T extends SubjectCountArgs>(
      args?: Subset<T, SubjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubjectAggregateArgs>(args: Subset<T, SubjectAggregateArgs>): Prisma.PrismaPromise<GetSubjectAggregateType<T>>

    /**
     * Group by Subject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubjectGroupByArgs['orderBy'] }
        : { orderBy?: SubjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subject model
   */
  readonly fields: SubjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SubjectClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    account<T extends Subject$accountArgs<ExtArgs> = {}>(args?: Subset<T, Subject$accountArgs<ExtArgs>>): Prisma__AccountClient<$Types.GetResult<AccountPayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    Ingestions<T extends Subject$IngestionsArgs<ExtArgs> = {}>(args?: Subset<T, Subject$IngestionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'findMany'>| Null>;

    Stash<T extends Subject$StashArgs<ExtArgs> = {}>(args?: Subset<T, Subject$StashArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<StashPayload<ExtArgs>, T, 'findMany'>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the Subject model
   */ 
  interface SubjectFieldRefs {
    readonly id: FieldRef<"Subject", 'String'>
    readonly firstName: FieldRef<"Subject", 'String'>
    readonly lastName: FieldRef<"Subject", 'String'>
    readonly dateOfBirth: FieldRef<"Subject", 'DateTime'>
    readonly weight: FieldRef<"Subject", 'Int'>
    readonly height: FieldRef<"Subject", 'Int'>
    readonly account_id: FieldRef<"Subject", 'String'>
  }
    

  // Custom InputTypes

  /**
   * Subject findUnique
   */
  export type SubjectFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where: SubjectWhereUniqueInput
  }


  /**
   * Subject findUniqueOrThrow
   */
  export type SubjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where: SubjectWhereUniqueInput
  }


  /**
   * Subject findFirst
   */
  export type SubjectFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }


  /**
   * Subject findFirstOrThrow
   */
  export type SubjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }


  /**
   * Subject findMany
   */
  export type SubjectFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subjects to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }


  /**
   * Subject create
   */
  export type SubjectCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Subject.
     */
    data?: XOR<SubjectCreateInput, SubjectUncheckedCreateInput>
  }


  /**
   * Subject update
   */
  export type SubjectUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Subject.
     */
    data: XOR<SubjectUpdateInput, SubjectUncheckedUpdateInput>
    /**
     * Choose, which Subject to update.
     */
    where: SubjectWhereUniqueInput
  }


  /**
   * Subject updateMany
   */
  export type SubjectUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subjects.
     */
    data: XOR<SubjectUpdateManyMutationInput, SubjectUncheckedUpdateManyInput>
    /**
     * Filter which Subjects to update
     */
    where?: SubjectWhereInput
  }


  /**
   * Subject upsert
   */
  export type SubjectUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Subject to update in case it exists.
     */
    where: SubjectWhereUniqueInput
    /**
     * In case the Subject found by the `where` argument doesn't exist, create a new Subject with this data.
     */
    create: XOR<SubjectCreateInput, SubjectUncheckedCreateInput>
    /**
     * In case the Subject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubjectUpdateInput, SubjectUncheckedUpdateInput>
  }


  /**
   * Subject delete
   */
  export type SubjectDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter which Subject to delete.
     */
    where: SubjectWhereUniqueInput
  }


  /**
   * Subject deleteMany
   */
  export type SubjectDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subjects to delete
     */
    where?: SubjectWhereInput
  }


  /**
   * Subject.account
   */
  export type Subject$accountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
  }


  /**
   * Subject.Ingestions
   */
  export type Subject$IngestionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    where?: IngestionWhereInput
    orderBy?: IngestionOrderByWithRelationInput | IngestionOrderByWithRelationInput[]
    cursor?: IngestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IngestionScalarFieldEnum | IngestionScalarFieldEnum[]
  }


  /**
   * Subject.Stash
   */
  export type Subject$StashArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    where?: StashWhereInput
    orderBy?: StashOrderByWithRelationInput | StashOrderByWithRelationInput[]
    cursor?: StashWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StashScalarFieldEnum | StashScalarFieldEnum[]
  }


  /**
   * Subject without action
   */
  export type SubjectArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
  }



  /**
   * Model Substance
   */


  export type AggregateSubstance = {
    _count: SubstanceCountAggregateOutputType | null
    _min: SubstanceMinAggregateOutputType | null
    _max: SubstanceMaxAggregateOutputType | null
  }

  export type SubstanceMinAggregateOutputType = {
    id: string | null
    name: string | null
    common_names: string | null
    brand_names: string | null
    substitutive_name: string | null
    systematic_name: string | null
    unii: string | null
    cas_number: string | null
    inchi_key: string | null
    iupac: string | null
    smiles: string | null
    psychoactive_class: string | null
    chemical_class: string | null
    description: string | null
  }

  export type SubstanceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    common_names: string | null
    brand_names: string | null
    substitutive_name: string | null
    systematic_name: string | null
    unii: string | null
    cas_number: string | null
    inchi_key: string | null
    iupac: string | null
    smiles: string | null
    psychoactive_class: string | null
    chemical_class: string | null
    description: string | null
  }

  export type SubstanceCountAggregateOutputType = {
    id: number
    name: number
    common_names: number
    brand_names: number
    substitutive_name: number
    systematic_name: number
    unii: number
    cas_number: number
    inchi_key: number
    iupac: number
    smiles: number
    psychoactive_class: number
    chemical_class: number
    description: number
    _all: number
  }


  export type SubstanceMinAggregateInputType = {
    id?: true
    name?: true
    common_names?: true
    brand_names?: true
    substitutive_name?: true
    systematic_name?: true
    unii?: true
    cas_number?: true
    inchi_key?: true
    iupac?: true
    smiles?: true
    psychoactive_class?: true
    chemical_class?: true
    description?: true
  }

  export type SubstanceMaxAggregateInputType = {
    id?: true
    name?: true
    common_names?: true
    brand_names?: true
    substitutive_name?: true
    systematic_name?: true
    unii?: true
    cas_number?: true
    inchi_key?: true
    iupac?: true
    smiles?: true
    psychoactive_class?: true
    chemical_class?: true
    description?: true
  }

  export type SubstanceCountAggregateInputType = {
    id?: true
    name?: true
    common_names?: true
    brand_names?: true
    substitutive_name?: true
    systematic_name?: true
    unii?: true
    cas_number?: true
    inchi_key?: true
    iupac?: true
    smiles?: true
    psychoactive_class?: true
    chemical_class?: true
    description?: true
    _all?: true
  }

  export type SubstanceAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Substance to aggregate.
     */
    where?: SubstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Substances to fetch.
     */
    orderBy?: SubstanceOrderByWithRelationInput | SubstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Substances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Substances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Substances
    **/
    _count?: true | SubstanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubstanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubstanceMaxAggregateInputType
  }

  export type GetSubstanceAggregateType<T extends SubstanceAggregateArgs> = {
        [P in keyof T & keyof AggregateSubstance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubstance[P]>
      : GetScalarType<T[P], AggregateSubstance[P]>
  }




  export type SubstanceGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubstanceWhereInput
    orderBy?: SubstanceOrderByWithAggregationInput | SubstanceOrderByWithAggregationInput[]
    by: SubstanceScalarFieldEnum[] | SubstanceScalarFieldEnum
    having?: SubstanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubstanceCountAggregateInputType | true
    _min?: SubstanceMinAggregateInputType
    _max?: SubstanceMaxAggregateInputType
  }


  export type SubstanceGroupByOutputType = {
    id: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name: string | null
    systematic_name: string | null
    unii: string | null
    cas_number: string | null
    inchi_key: string | null
    iupac: string | null
    smiles: string | null
    psychoactive_class: string
    chemical_class: string | null
    description: string | null
    _count: SubstanceCountAggregateOutputType | null
    _min: SubstanceMinAggregateOutputType | null
    _max: SubstanceMaxAggregateOutputType | null
  }

  type GetSubstanceGroupByPayload<T extends SubstanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubstanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubstanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubstanceGroupByOutputType[P]>
            : GetScalarType<T[P], SubstanceGroupByOutputType[P]>
        }
      >
    >


  export type SubstanceSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    common_names?: boolean
    brand_names?: boolean
    substitutive_name?: boolean
    systematic_name?: boolean
    unii?: boolean
    cas_number?: boolean
    inchi_key?: boolean
    iupac?: boolean
    smiles?: boolean
    psychoactive_class?: boolean
    chemical_class?: boolean
    description?: boolean
    routes_of_administration?: boolean | Substance$routes_of_administrationArgs<ExtArgs>
    Ingestion?: boolean | Substance$IngestionArgs<ExtArgs>
    Stash?: boolean | Substance$StashArgs<ExtArgs>
    SubstanceInteraction?: boolean | Substance$SubstanceInteractionArgs<ExtArgs>
    _count?: boolean | SubstanceCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["substance"]>

  export type SubstanceSelectScalar = {
    id?: boolean
    name?: boolean
    common_names?: boolean
    brand_names?: boolean
    substitutive_name?: boolean
    systematic_name?: boolean
    unii?: boolean
    cas_number?: boolean
    inchi_key?: boolean
    iupac?: boolean
    smiles?: boolean
    psychoactive_class?: boolean
    chemical_class?: boolean
    description?: boolean
  }

  export type SubstanceInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    routes_of_administration?: boolean | Substance$routes_of_administrationArgs<ExtArgs>
    Ingestion?: boolean | Substance$IngestionArgs<ExtArgs>
    Stash?: boolean | Substance$StashArgs<ExtArgs>
    SubstanceInteraction?: boolean | Substance$SubstanceInteractionArgs<ExtArgs>
    _count?: boolean | SubstanceCountOutputTypeArgs<ExtArgs>
  }


  type SubstanceGetPayload<S extends boolean | null | undefined | SubstanceArgs> = $Types.GetResult<SubstancePayload, S>

  type SubstanceCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<SubstanceFindManyArgs, 'select' | 'include'> & {
      select?: SubstanceCountAggregateInputType | true
    }

  export interface SubstanceDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Substance'], meta: { name: 'Substance' } }
    /**
     * Find zero or one Substance that matches the filter.
     * @param {SubstanceFindUniqueArgs} args - Arguments to find a Substance
     * @example
     * // Get one Substance
     * const substance = await prisma.substance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SubstanceFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceFindUniqueArgs<ExtArgs>>
    ): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Substance that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SubstanceFindUniqueOrThrowArgs} args - Arguments to find a Substance
     * @example
     * // Get one Substance
     * const substance = await prisma.substance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SubstanceFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Substance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceFindFirstArgs} args - Arguments to find a Substance
     * @example
     * // Get one Substance
     * const substance = await prisma.substance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SubstanceFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceFindFirstArgs<ExtArgs>>
    ): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Substance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceFindFirstOrThrowArgs} args - Arguments to find a Substance
     * @example
     * // Get one Substance
     * const substance = await prisma.substance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SubstanceFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Substances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Substances
     * const substances = await prisma.substance.findMany()
     * 
     * // Get first 10 Substances
     * const substances = await prisma.substance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const substanceWithIdOnly = await prisma.substance.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SubstanceFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Substance.
     * @param {SubstanceCreateArgs} args - Arguments to create a Substance.
     * @example
     * // Create one Substance
     * const Substance = await prisma.substance.create({
     *   data: {
     *     // ... data to create a Substance
     *   }
     * })
     * 
    **/
    create<T extends SubstanceCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceCreateArgs<ExtArgs>>
    ): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a Substance.
     * @param {SubstanceDeleteArgs} args - Arguments to delete one Substance.
     * @example
     * // Delete one Substance
     * const Substance = await prisma.substance.delete({
     *   where: {
     *     // ... filter to delete one Substance
     *   }
     * })
     * 
    **/
    delete<T extends SubstanceDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceDeleteArgs<ExtArgs>>
    ): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Substance.
     * @param {SubstanceUpdateArgs} args - Arguments to update one Substance.
     * @example
     * // Update one Substance
     * const substance = await prisma.substance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SubstanceUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceUpdateArgs<ExtArgs>>
    ): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Substances.
     * @param {SubstanceDeleteManyArgs} args - Arguments to filter Substances to delete.
     * @example
     * // Delete a few Substances
     * const { count } = await prisma.substance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SubstanceDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Substances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Substances
     * const substance = await prisma.substance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SubstanceUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Substance.
     * @param {SubstanceUpsertArgs} args - Arguments to update or create a Substance.
     * @example
     * // Update or create a Substance
     * const substance = await prisma.substance.upsert({
     *   create: {
     *     // ... data to create a Substance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Substance we want to update
     *   }
     * })
    **/
    upsert<T extends SubstanceUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceUpsertArgs<ExtArgs>>
    ): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Substances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceCountArgs} args - Arguments to filter Substances to count.
     * @example
     * // Count the number of Substances
     * const count = await prisma.substance.count({
     *   where: {
     *     // ... the filter for the Substances we want to count
     *   }
     * })
    **/
    count<T extends SubstanceCountArgs>(
      args?: Subset<T, SubstanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubstanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Substance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubstanceAggregateArgs>(args: Subset<T, SubstanceAggregateArgs>): Prisma.PrismaPromise<GetSubstanceAggregateType<T>>

    /**
     * Group by Substance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubstanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubstanceGroupByArgs['orderBy'] }
        : { orderBy?: SubstanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubstanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubstanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Substance model
   */
  readonly fields: SubstanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Substance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SubstanceClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    routes_of_administration<T extends Substance$routes_of_administrationArgs<ExtArgs> = {}>(args?: Subset<T, Substance$routes_of_administrationArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'findMany'>| Null>;

    Ingestion<T extends Substance$IngestionArgs<ExtArgs> = {}>(args?: Subset<T, Substance$IngestionArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'findMany'>| Null>;

    Stash<T extends Substance$StashArgs<ExtArgs> = {}>(args?: Subset<T, Substance$StashArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<StashPayload<ExtArgs>, T, 'findMany'>| Null>;

    SubstanceInteraction<T extends Substance$SubstanceInteractionArgs<ExtArgs> = {}>(args?: Subset<T, Substance$SubstanceInteractionArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'findMany'>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the Substance model
   */ 
  interface SubstanceFieldRefs {
    readonly id: FieldRef<"Substance", 'String'>
    readonly name: FieldRef<"Substance", 'String'>
    readonly common_names: FieldRef<"Substance", 'String'>
    readonly brand_names: FieldRef<"Substance", 'String'>
    readonly substitutive_name: FieldRef<"Substance", 'String'>
    readonly systematic_name: FieldRef<"Substance", 'String'>
    readonly unii: FieldRef<"Substance", 'String'>
    readonly cas_number: FieldRef<"Substance", 'String'>
    readonly inchi_key: FieldRef<"Substance", 'String'>
    readonly iupac: FieldRef<"Substance", 'String'>
    readonly smiles: FieldRef<"Substance", 'String'>
    readonly psychoactive_class: FieldRef<"Substance", 'String'>
    readonly chemical_class: FieldRef<"Substance", 'String'>
    readonly description: FieldRef<"Substance", 'String'>
  }
    

  // Custom InputTypes

  /**
   * Substance findUnique
   */
  export type SubstanceFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * Filter, which Substance to fetch.
     */
    where: SubstanceWhereUniqueInput
  }


  /**
   * Substance findUniqueOrThrow
   */
  export type SubstanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * Filter, which Substance to fetch.
     */
    where: SubstanceWhereUniqueInput
  }


  /**
   * Substance findFirst
   */
  export type SubstanceFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * Filter, which Substance to fetch.
     */
    where?: SubstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Substances to fetch.
     */
    orderBy?: SubstanceOrderByWithRelationInput | SubstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Substances.
     */
    cursor?: SubstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Substances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Substances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Substances.
     */
    distinct?: SubstanceScalarFieldEnum | SubstanceScalarFieldEnum[]
  }


  /**
   * Substance findFirstOrThrow
   */
  export type SubstanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * Filter, which Substance to fetch.
     */
    where?: SubstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Substances to fetch.
     */
    orderBy?: SubstanceOrderByWithRelationInput | SubstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Substances.
     */
    cursor?: SubstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Substances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Substances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Substances.
     */
    distinct?: SubstanceScalarFieldEnum | SubstanceScalarFieldEnum[]
  }


  /**
   * Substance findMany
   */
  export type SubstanceFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * Filter, which Substances to fetch.
     */
    where?: SubstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Substances to fetch.
     */
    orderBy?: SubstanceOrderByWithRelationInput | SubstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Substances.
     */
    cursor?: SubstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Substances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Substances.
     */
    skip?: number
    distinct?: SubstanceScalarFieldEnum | SubstanceScalarFieldEnum[]
  }


  /**
   * Substance create
   */
  export type SubstanceCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * The data needed to create a Substance.
     */
    data: XOR<SubstanceCreateInput, SubstanceUncheckedCreateInput>
  }


  /**
   * Substance update
   */
  export type SubstanceUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * The data needed to update a Substance.
     */
    data: XOR<SubstanceUpdateInput, SubstanceUncheckedUpdateInput>
    /**
     * Choose, which Substance to update.
     */
    where: SubstanceWhereUniqueInput
  }


  /**
   * Substance updateMany
   */
  export type SubstanceUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Substances.
     */
    data: XOR<SubstanceUpdateManyMutationInput, SubstanceUncheckedUpdateManyInput>
    /**
     * Filter which Substances to update
     */
    where?: SubstanceWhereInput
  }


  /**
   * Substance upsert
   */
  export type SubstanceUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * The filter to search for the Substance to update in case it exists.
     */
    where: SubstanceWhereUniqueInput
    /**
     * In case the Substance found by the `where` argument doesn't exist, create a new Substance with this data.
     */
    create: XOR<SubstanceCreateInput, SubstanceUncheckedCreateInput>
    /**
     * In case the Substance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubstanceUpdateInput, SubstanceUncheckedUpdateInput>
  }


  /**
   * Substance delete
   */
  export type SubstanceDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    /**
     * Filter which Substance to delete.
     */
    where: SubstanceWhereUniqueInput
  }


  /**
   * Substance deleteMany
   */
  export type SubstanceDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Substances to delete
     */
    where?: SubstanceWhereInput
  }


  /**
   * Substance.routes_of_administration
   */
  export type Substance$routes_of_administrationArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    where?: RouteOfAdministrationWhereInput
    orderBy?: RouteOfAdministrationOrderByWithRelationInput | RouteOfAdministrationOrderByWithRelationInput[]
    cursor?: RouteOfAdministrationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RouteOfAdministrationScalarFieldEnum | RouteOfAdministrationScalarFieldEnum[]
  }


  /**
   * Substance.Ingestion
   */
  export type Substance$IngestionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    where?: IngestionWhereInput
    orderBy?: IngestionOrderByWithRelationInput | IngestionOrderByWithRelationInput[]
    cursor?: IngestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IngestionScalarFieldEnum | IngestionScalarFieldEnum[]
  }


  /**
   * Substance.Stash
   */
  export type Substance$StashArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    where?: StashWhereInput
    orderBy?: StashOrderByWithRelationInput | StashOrderByWithRelationInput[]
    cursor?: StashWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StashScalarFieldEnum | StashScalarFieldEnum[]
  }


  /**
   * Substance.SubstanceInteraction
   */
  export type Substance$SubstanceInteractionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    where?: SubstanceInteractionWhereInput
    orderBy?: SubstanceInteractionOrderByWithRelationInput | SubstanceInteractionOrderByWithRelationInput[]
    cursor?: SubstanceInteractionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubstanceInteractionScalarFieldEnum | SubstanceInteractionScalarFieldEnum[]
  }


  /**
   * Substance without action
   */
  export type SubstanceArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
  }



  /**
   * Model RouteOfAdministration
   */


  export type AggregateRouteOfAdministration = {
    _count: RouteOfAdministrationCountAggregateOutputType | null
    _avg: RouteOfAdministrationAvgAggregateOutputType | null
    _sum: RouteOfAdministrationSumAggregateOutputType | null
    _min: RouteOfAdministrationMinAggregateOutputType | null
    _max: RouteOfAdministrationMaxAggregateOutputType | null
  }

  export type RouteOfAdministrationAvgAggregateOutputType = {
    bioavailability: number | null
  }

  export type RouteOfAdministrationSumAggregateOutputType = {
    bioavailability: number | null
  }

  export type RouteOfAdministrationMinAggregateOutputType = {
    id: string | null
    substanceName: string | null
    name: string | null
    bioavailability: number | null
  }

  export type RouteOfAdministrationMaxAggregateOutputType = {
    id: string | null
    substanceName: string | null
    name: string | null
    bioavailability: number | null
  }

  export type RouteOfAdministrationCountAggregateOutputType = {
    id: number
    substanceName: number
    name: number
    bioavailability: number
    _all: number
  }


  export type RouteOfAdministrationAvgAggregateInputType = {
    bioavailability?: true
  }

  export type RouteOfAdministrationSumAggregateInputType = {
    bioavailability?: true
  }

  export type RouteOfAdministrationMinAggregateInputType = {
    id?: true
    substanceName?: true
    name?: true
    bioavailability?: true
  }

  export type RouteOfAdministrationMaxAggregateInputType = {
    id?: true
    substanceName?: true
    name?: true
    bioavailability?: true
  }

  export type RouteOfAdministrationCountAggregateInputType = {
    id?: true
    substanceName?: true
    name?: true
    bioavailability?: true
    _all?: true
  }

  export type RouteOfAdministrationAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which RouteOfAdministration to aggregate.
     */
    where?: RouteOfAdministrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RouteOfAdministrations to fetch.
     */
    orderBy?: RouteOfAdministrationOrderByWithRelationInput | RouteOfAdministrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RouteOfAdministrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RouteOfAdministrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RouteOfAdministrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RouteOfAdministrations
    **/
    _count?: true | RouteOfAdministrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RouteOfAdministrationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RouteOfAdministrationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RouteOfAdministrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RouteOfAdministrationMaxAggregateInputType
  }

  export type GetRouteOfAdministrationAggregateType<T extends RouteOfAdministrationAggregateArgs> = {
        [P in keyof T & keyof AggregateRouteOfAdministration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRouteOfAdministration[P]>
      : GetScalarType<T[P], AggregateRouteOfAdministration[P]>
  }




  export type RouteOfAdministrationGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: RouteOfAdministrationWhereInput
    orderBy?: RouteOfAdministrationOrderByWithAggregationInput | RouteOfAdministrationOrderByWithAggregationInput[]
    by: RouteOfAdministrationScalarFieldEnum[] | RouteOfAdministrationScalarFieldEnum
    having?: RouteOfAdministrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RouteOfAdministrationCountAggregateInputType | true
    _avg?: RouteOfAdministrationAvgAggregateInputType
    _sum?: RouteOfAdministrationSumAggregateInputType
    _min?: RouteOfAdministrationMinAggregateInputType
    _max?: RouteOfAdministrationMaxAggregateInputType
  }


  export type RouteOfAdministrationGroupByOutputType = {
    id: string
    substanceName: string | null
    name: string
    bioavailability: number
    _count: RouteOfAdministrationCountAggregateOutputType | null
    _avg: RouteOfAdministrationAvgAggregateOutputType | null
    _sum: RouteOfAdministrationSumAggregateOutputType | null
    _min: RouteOfAdministrationMinAggregateOutputType | null
    _max: RouteOfAdministrationMaxAggregateOutputType | null
  }

  type GetRouteOfAdministrationGroupByPayload<T extends RouteOfAdministrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RouteOfAdministrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RouteOfAdministrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RouteOfAdministrationGroupByOutputType[P]>
            : GetScalarType<T[P], RouteOfAdministrationGroupByOutputType[P]>
        }
      >
    >


  export type RouteOfAdministrationSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    substanceName?: boolean
    name?: boolean
    bioavailability?: boolean
    dosage?: boolean | RouteOfAdministration$dosageArgs<ExtArgs>
    phases?: boolean | RouteOfAdministration$phasesArgs<ExtArgs>
    Substance?: boolean | RouteOfAdministration$SubstanceArgs<ExtArgs>
    _count?: boolean | RouteOfAdministrationCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["routeOfAdministration"]>

  export type RouteOfAdministrationSelectScalar = {
    id?: boolean
    substanceName?: boolean
    name?: boolean
    bioavailability?: boolean
  }

  export type RouteOfAdministrationInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    dosage?: boolean | RouteOfAdministration$dosageArgs<ExtArgs>
    phases?: boolean | RouteOfAdministration$phasesArgs<ExtArgs>
    Substance?: boolean | RouteOfAdministration$SubstanceArgs<ExtArgs>
    _count?: boolean | RouteOfAdministrationCountOutputTypeArgs<ExtArgs>
  }


  type RouteOfAdministrationGetPayload<S extends boolean | null | undefined | RouteOfAdministrationArgs> = $Types.GetResult<RouteOfAdministrationPayload, S>

  type RouteOfAdministrationCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<RouteOfAdministrationFindManyArgs, 'select' | 'include'> & {
      select?: RouteOfAdministrationCountAggregateInputType | true
    }

  export interface RouteOfAdministrationDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RouteOfAdministration'], meta: { name: 'RouteOfAdministration' } }
    /**
     * Find zero or one RouteOfAdministration that matches the filter.
     * @param {RouteOfAdministrationFindUniqueArgs} args - Arguments to find a RouteOfAdministration
     * @example
     * // Get one RouteOfAdministration
     * const routeOfAdministration = await prisma.routeOfAdministration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends RouteOfAdministrationFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, RouteOfAdministrationFindUniqueArgs<ExtArgs>>
    ): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one RouteOfAdministration that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {RouteOfAdministrationFindUniqueOrThrowArgs} args - Arguments to find a RouteOfAdministration
     * @example
     * // Get one RouteOfAdministration
     * const routeOfAdministration = await prisma.routeOfAdministration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends RouteOfAdministrationFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, RouteOfAdministrationFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first RouteOfAdministration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RouteOfAdministrationFindFirstArgs} args - Arguments to find a RouteOfAdministration
     * @example
     * // Get one RouteOfAdministration
     * const routeOfAdministration = await prisma.routeOfAdministration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends RouteOfAdministrationFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, RouteOfAdministrationFindFirstArgs<ExtArgs>>
    ): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first RouteOfAdministration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RouteOfAdministrationFindFirstOrThrowArgs} args - Arguments to find a RouteOfAdministration
     * @example
     * // Get one RouteOfAdministration
     * const routeOfAdministration = await prisma.routeOfAdministration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends RouteOfAdministrationFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, RouteOfAdministrationFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more RouteOfAdministrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RouteOfAdministrationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RouteOfAdministrations
     * const routeOfAdministrations = await prisma.routeOfAdministration.findMany()
     * 
     * // Get first 10 RouteOfAdministrations
     * const routeOfAdministrations = await prisma.routeOfAdministration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const routeOfAdministrationWithIdOnly = await prisma.routeOfAdministration.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends RouteOfAdministrationFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, RouteOfAdministrationFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a RouteOfAdministration.
     * @param {RouteOfAdministrationCreateArgs} args - Arguments to create a RouteOfAdministration.
     * @example
     * // Create one RouteOfAdministration
     * const RouteOfAdministration = await prisma.routeOfAdministration.create({
     *   data: {
     *     // ... data to create a RouteOfAdministration
     *   }
     * })
     * 
    **/
    create<T extends RouteOfAdministrationCreateArgs<ExtArgs>>(
      args: SelectSubset<T, RouteOfAdministrationCreateArgs<ExtArgs>>
    ): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a RouteOfAdministration.
     * @param {RouteOfAdministrationDeleteArgs} args - Arguments to delete one RouteOfAdministration.
     * @example
     * // Delete one RouteOfAdministration
     * const RouteOfAdministration = await prisma.routeOfAdministration.delete({
     *   where: {
     *     // ... filter to delete one RouteOfAdministration
     *   }
     * })
     * 
    **/
    delete<T extends RouteOfAdministrationDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, RouteOfAdministrationDeleteArgs<ExtArgs>>
    ): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one RouteOfAdministration.
     * @param {RouteOfAdministrationUpdateArgs} args - Arguments to update one RouteOfAdministration.
     * @example
     * // Update one RouteOfAdministration
     * const routeOfAdministration = await prisma.routeOfAdministration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends RouteOfAdministrationUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, RouteOfAdministrationUpdateArgs<ExtArgs>>
    ): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more RouteOfAdministrations.
     * @param {RouteOfAdministrationDeleteManyArgs} args - Arguments to filter RouteOfAdministrations to delete.
     * @example
     * // Delete a few RouteOfAdministrations
     * const { count } = await prisma.routeOfAdministration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends RouteOfAdministrationDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, RouteOfAdministrationDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RouteOfAdministrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RouteOfAdministrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RouteOfAdministrations
     * const routeOfAdministration = await prisma.routeOfAdministration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends RouteOfAdministrationUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, RouteOfAdministrationUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RouteOfAdministration.
     * @param {RouteOfAdministrationUpsertArgs} args - Arguments to update or create a RouteOfAdministration.
     * @example
     * // Update or create a RouteOfAdministration
     * const routeOfAdministration = await prisma.routeOfAdministration.upsert({
     *   create: {
     *     // ... data to create a RouteOfAdministration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RouteOfAdministration we want to update
     *   }
     * })
    **/
    upsert<T extends RouteOfAdministrationUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, RouteOfAdministrationUpsertArgs<ExtArgs>>
    ): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of RouteOfAdministrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RouteOfAdministrationCountArgs} args - Arguments to filter RouteOfAdministrations to count.
     * @example
     * // Count the number of RouteOfAdministrations
     * const count = await prisma.routeOfAdministration.count({
     *   where: {
     *     // ... the filter for the RouteOfAdministrations we want to count
     *   }
     * })
    **/
    count<T extends RouteOfAdministrationCountArgs>(
      args?: Subset<T, RouteOfAdministrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RouteOfAdministrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RouteOfAdministration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RouteOfAdministrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RouteOfAdministrationAggregateArgs>(args: Subset<T, RouteOfAdministrationAggregateArgs>): Prisma.PrismaPromise<GetRouteOfAdministrationAggregateType<T>>

    /**
     * Group by RouteOfAdministration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RouteOfAdministrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RouteOfAdministrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RouteOfAdministrationGroupByArgs['orderBy'] }
        : { orderBy?: RouteOfAdministrationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RouteOfAdministrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRouteOfAdministrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RouteOfAdministration model
   */
  readonly fields: RouteOfAdministrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RouteOfAdministration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__RouteOfAdministrationClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    dosage<T extends RouteOfAdministration$dosageArgs<ExtArgs> = {}>(args?: Subset<T, RouteOfAdministration$dosageArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<DosagePayload<ExtArgs>, T, 'findMany'>| Null>;

    phases<T extends RouteOfAdministration$phasesArgs<ExtArgs> = {}>(args?: Subset<T, RouteOfAdministration$phasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<PhasePayload<ExtArgs>, T, 'findMany'>| Null>;

    Substance<T extends RouteOfAdministration$SubstanceArgs<ExtArgs> = {}>(args?: Subset<T, RouteOfAdministration$SubstanceArgs<ExtArgs>>): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the RouteOfAdministration model
   */ 
  interface RouteOfAdministrationFieldRefs {
    readonly id: FieldRef<"RouteOfAdministration", 'String'>
    readonly substanceName: FieldRef<"RouteOfAdministration", 'String'>
    readonly name: FieldRef<"RouteOfAdministration", 'String'>
    readonly bioavailability: FieldRef<"RouteOfAdministration", 'Float'>
  }
    

  // Custom InputTypes

  /**
   * RouteOfAdministration findUnique
   */
  export type RouteOfAdministrationFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * Filter, which RouteOfAdministration to fetch.
     */
    where: RouteOfAdministrationWhereUniqueInput
  }


  /**
   * RouteOfAdministration findUniqueOrThrow
   */
  export type RouteOfAdministrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * Filter, which RouteOfAdministration to fetch.
     */
    where: RouteOfAdministrationWhereUniqueInput
  }


  /**
   * RouteOfAdministration findFirst
   */
  export type RouteOfAdministrationFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * Filter, which RouteOfAdministration to fetch.
     */
    where?: RouteOfAdministrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RouteOfAdministrations to fetch.
     */
    orderBy?: RouteOfAdministrationOrderByWithRelationInput | RouteOfAdministrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RouteOfAdministrations.
     */
    cursor?: RouteOfAdministrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RouteOfAdministrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RouteOfAdministrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RouteOfAdministrations.
     */
    distinct?: RouteOfAdministrationScalarFieldEnum | RouteOfAdministrationScalarFieldEnum[]
  }


  /**
   * RouteOfAdministration findFirstOrThrow
   */
  export type RouteOfAdministrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * Filter, which RouteOfAdministration to fetch.
     */
    where?: RouteOfAdministrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RouteOfAdministrations to fetch.
     */
    orderBy?: RouteOfAdministrationOrderByWithRelationInput | RouteOfAdministrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RouteOfAdministrations.
     */
    cursor?: RouteOfAdministrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RouteOfAdministrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RouteOfAdministrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RouteOfAdministrations.
     */
    distinct?: RouteOfAdministrationScalarFieldEnum | RouteOfAdministrationScalarFieldEnum[]
  }


  /**
   * RouteOfAdministration findMany
   */
  export type RouteOfAdministrationFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * Filter, which RouteOfAdministrations to fetch.
     */
    where?: RouteOfAdministrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RouteOfAdministrations to fetch.
     */
    orderBy?: RouteOfAdministrationOrderByWithRelationInput | RouteOfAdministrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RouteOfAdministrations.
     */
    cursor?: RouteOfAdministrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RouteOfAdministrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RouteOfAdministrations.
     */
    skip?: number
    distinct?: RouteOfAdministrationScalarFieldEnum | RouteOfAdministrationScalarFieldEnum[]
  }


  /**
   * RouteOfAdministration create
   */
  export type RouteOfAdministrationCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * The data needed to create a RouteOfAdministration.
     */
    data: XOR<RouteOfAdministrationCreateInput, RouteOfAdministrationUncheckedCreateInput>
  }


  /**
   * RouteOfAdministration update
   */
  export type RouteOfAdministrationUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * The data needed to update a RouteOfAdministration.
     */
    data: XOR<RouteOfAdministrationUpdateInput, RouteOfAdministrationUncheckedUpdateInput>
    /**
     * Choose, which RouteOfAdministration to update.
     */
    where: RouteOfAdministrationWhereUniqueInput
  }


  /**
   * RouteOfAdministration updateMany
   */
  export type RouteOfAdministrationUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RouteOfAdministrations.
     */
    data: XOR<RouteOfAdministrationUpdateManyMutationInput, RouteOfAdministrationUncheckedUpdateManyInput>
    /**
     * Filter which RouteOfAdministrations to update
     */
    where?: RouteOfAdministrationWhereInput
  }


  /**
   * RouteOfAdministration upsert
   */
  export type RouteOfAdministrationUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * The filter to search for the RouteOfAdministration to update in case it exists.
     */
    where: RouteOfAdministrationWhereUniqueInput
    /**
     * In case the RouteOfAdministration found by the `where` argument doesn't exist, create a new RouteOfAdministration with this data.
     */
    create: XOR<RouteOfAdministrationCreateInput, RouteOfAdministrationUncheckedCreateInput>
    /**
     * In case the RouteOfAdministration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RouteOfAdministrationUpdateInput, RouteOfAdministrationUncheckedUpdateInput>
  }


  /**
   * RouteOfAdministration delete
   */
  export type RouteOfAdministrationDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    /**
     * Filter which RouteOfAdministration to delete.
     */
    where: RouteOfAdministrationWhereUniqueInput
  }


  /**
   * RouteOfAdministration deleteMany
   */
  export type RouteOfAdministrationDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which RouteOfAdministrations to delete
     */
    where?: RouteOfAdministrationWhereInput
  }


  /**
   * RouteOfAdministration.dosage
   */
  export type RouteOfAdministration$dosageArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    where?: DosageWhereInput
    orderBy?: DosageOrderByWithRelationInput | DosageOrderByWithRelationInput[]
    cursor?: DosageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DosageScalarFieldEnum | DosageScalarFieldEnum[]
  }


  /**
   * RouteOfAdministration.phases
   */
  export type RouteOfAdministration$phasesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    where?: PhaseWhereInput
    orderBy?: PhaseOrderByWithRelationInput | PhaseOrderByWithRelationInput[]
    cursor?: PhaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PhaseScalarFieldEnum | PhaseScalarFieldEnum[]
  }


  /**
   * RouteOfAdministration.Substance
   */
  export type RouteOfAdministration$SubstanceArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    where?: SubstanceWhereInput
  }


  /**
   * RouteOfAdministration without action
   */
  export type RouteOfAdministrationArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
  }



  /**
   * Model Phase
   */


  export type AggregatePhase = {
    _count: PhaseCountAggregateOutputType | null
    _avg: PhaseAvgAggregateOutputType | null
    _sum: PhaseSumAggregateOutputType | null
    _min: PhaseMinAggregateOutputType | null
    _max: PhaseMaxAggregateOutputType | null
  }

  export type PhaseAvgAggregateOutputType = {
    from: number | null
    to: number | null
  }

  export type PhaseSumAggregateOutputType = {
    from: number | null
    to: number | null
  }

  export type PhaseMinAggregateOutputType = {
    id: string | null
    from: number | null
    to: number | null
    routeOfAdministrationId: string | null
  }

  export type PhaseMaxAggregateOutputType = {
    id: string | null
    from: number | null
    to: number | null
    routeOfAdministrationId: string | null
  }

  export type PhaseCountAggregateOutputType = {
    id: number
    from: number
    to: number
    routeOfAdministrationId: number
    _all: number
  }


  export type PhaseAvgAggregateInputType = {
    from?: true
    to?: true
  }

  export type PhaseSumAggregateInputType = {
    from?: true
    to?: true
  }

  export type PhaseMinAggregateInputType = {
    id?: true
    from?: true
    to?: true
    routeOfAdministrationId?: true
  }

  export type PhaseMaxAggregateInputType = {
    id?: true
    from?: true
    to?: true
    routeOfAdministrationId?: true
  }

  export type PhaseCountAggregateInputType = {
    id?: true
    from?: true
    to?: true
    routeOfAdministrationId?: true
    _all?: true
  }

  export type PhaseAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Phase to aggregate.
     */
    where?: PhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Phases to fetch.
     */
    orderBy?: PhaseOrderByWithRelationInput | PhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Phases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Phases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Phases
    **/
    _count?: true | PhaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhaseMaxAggregateInputType
  }

  export type GetPhaseAggregateType<T extends PhaseAggregateArgs> = {
        [P in keyof T & keyof AggregatePhase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhase[P]>
      : GetScalarType<T[P], AggregatePhase[P]>
  }




  export type PhaseGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: PhaseWhereInput
    orderBy?: PhaseOrderByWithAggregationInput | PhaseOrderByWithAggregationInput[]
    by: PhaseScalarFieldEnum[] | PhaseScalarFieldEnum
    having?: PhaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhaseCountAggregateInputType | true
    _avg?: PhaseAvgAggregateInputType
    _sum?: PhaseSumAggregateInputType
    _min?: PhaseMinAggregateInputType
    _max?: PhaseMaxAggregateInputType
  }


  export type PhaseGroupByOutputType = {
    id: string
    from: number | null
    to: number | null
    routeOfAdministrationId: string | null
    _count: PhaseCountAggregateOutputType | null
    _avg: PhaseAvgAggregateOutputType | null
    _sum: PhaseSumAggregateOutputType | null
    _min: PhaseMinAggregateOutputType | null
    _max: PhaseMaxAggregateOutputType | null
  }

  type GetPhaseGroupByPayload<T extends PhaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhaseGroupByOutputType[P]>
            : GetScalarType<T[P], PhaseGroupByOutputType[P]>
        }
      >
    >


  export type PhaseSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    from?: boolean
    to?: boolean
    routeOfAdministrationId?: boolean
    RouteOfAdministration?: boolean | Phase$RouteOfAdministrationArgs<ExtArgs>
    effects?: boolean | Phase$effectsArgs<ExtArgs>
    _count?: boolean | PhaseCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["phase"]>

  export type PhaseSelectScalar = {
    id?: boolean
    from?: boolean
    to?: boolean
    routeOfAdministrationId?: boolean
  }

  export type PhaseInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    RouteOfAdministration?: boolean | Phase$RouteOfAdministrationArgs<ExtArgs>
    effects?: boolean | Phase$effectsArgs<ExtArgs>
    _count?: boolean | PhaseCountOutputTypeArgs<ExtArgs>
  }


  type PhaseGetPayload<S extends boolean | null | undefined | PhaseArgs> = $Types.GetResult<PhasePayload, S>

  type PhaseCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<PhaseFindManyArgs, 'select' | 'include'> & {
      select?: PhaseCountAggregateInputType | true
    }

  export interface PhaseDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Phase'], meta: { name: 'Phase' } }
    /**
     * Find zero or one Phase that matches the filter.
     * @param {PhaseFindUniqueArgs} args - Arguments to find a Phase
     * @example
     * // Get one Phase
     * const phase = await prisma.phase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PhaseFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, PhaseFindUniqueArgs<ExtArgs>>
    ): Prisma__PhaseClient<$Types.GetResult<PhasePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Phase that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {PhaseFindUniqueOrThrowArgs} args - Arguments to find a Phase
     * @example
     * // Get one Phase
     * const phase = await prisma.phase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PhaseFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PhaseFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PhaseClient<$Types.GetResult<PhasePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Phase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseFindFirstArgs} args - Arguments to find a Phase
     * @example
     * // Get one Phase
     * const phase = await prisma.phase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PhaseFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, PhaseFindFirstArgs<ExtArgs>>
    ): Prisma__PhaseClient<$Types.GetResult<PhasePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Phase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseFindFirstOrThrowArgs} args - Arguments to find a Phase
     * @example
     * // Get one Phase
     * const phase = await prisma.phase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PhaseFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PhaseFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PhaseClient<$Types.GetResult<PhasePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Phases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Phases
     * const phases = await prisma.phase.findMany()
     * 
     * // Get first 10 Phases
     * const phases = await prisma.phase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const phaseWithIdOnly = await prisma.phase.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends PhaseFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PhaseFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<PhasePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Phase.
     * @param {PhaseCreateArgs} args - Arguments to create a Phase.
     * @example
     * // Create one Phase
     * const Phase = await prisma.phase.create({
     *   data: {
     *     // ... data to create a Phase
     *   }
     * })
     * 
    **/
    create<T extends PhaseCreateArgs<ExtArgs>>(
      args: SelectSubset<T, PhaseCreateArgs<ExtArgs>>
    ): Prisma__PhaseClient<$Types.GetResult<PhasePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a Phase.
     * @param {PhaseDeleteArgs} args - Arguments to delete one Phase.
     * @example
     * // Delete one Phase
     * const Phase = await prisma.phase.delete({
     *   where: {
     *     // ... filter to delete one Phase
     *   }
     * })
     * 
    **/
    delete<T extends PhaseDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, PhaseDeleteArgs<ExtArgs>>
    ): Prisma__PhaseClient<$Types.GetResult<PhasePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Phase.
     * @param {PhaseUpdateArgs} args - Arguments to update one Phase.
     * @example
     * // Update one Phase
     * const phase = await prisma.phase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PhaseUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, PhaseUpdateArgs<ExtArgs>>
    ): Prisma__PhaseClient<$Types.GetResult<PhasePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Phases.
     * @param {PhaseDeleteManyArgs} args - Arguments to filter Phases to delete.
     * @example
     * // Delete a few Phases
     * const { count } = await prisma.phase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PhaseDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PhaseDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Phases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Phases
     * const phase = await prisma.phase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PhaseUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, PhaseUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Phase.
     * @param {PhaseUpsertArgs} args - Arguments to update or create a Phase.
     * @example
     * // Update or create a Phase
     * const phase = await prisma.phase.upsert({
     *   create: {
     *     // ... data to create a Phase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Phase we want to update
     *   }
     * })
    **/
    upsert<T extends PhaseUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, PhaseUpsertArgs<ExtArgs>>
    ): Prisma__PhaseClient<$Types.GetResult<PhasePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Phases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseCountArgs} args - Arguments to filter Phases to count.
     * @example
     * // Count the number of Phases
     * const count = await prisma.phase.count({
     *   where: {
     *     // ... the filter for the Phases we want to count
     *   }
     * })
    **/
    count<T extends PhaseCountArgs>(
      args?: Subset<T, PhaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Phase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhaseAggregateArgs>(args: Subset<T, PhaseAggregateArgs>): Prisma.PrismaPromise<GetPhaseAggregateType<T>>

    /**
     * Group by Phase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhaseGroupByArgs['orderBy'] }
        : { orderBy?: PhaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Phase model
   */
  readonly fields: PhaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Phase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PhaseClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    RouteOfAdministration<T extends Phase$RouteOfAdministrationArgs<ExtArgs> = {}>(args?: Subset<T, Phase$RouteOfAdministrationArgs<ExtArgs>>): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    effects<T extends Phase$effectsArgs<ExtArgs> = {}>(args?: Subset<T, Phase$effectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<EffectPayload<ExtArgs>, T, 'findMany'>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the Phase model
   */ 
  interface PhaseFieldRefs {
    readonly id: FieldRef<"Phase", 'String'>
    readonly from: FieldRef<"Phase", 'Int'>
    readonly to: FieldRef<"Phase", 'Int'>
    readonly routeOfAdministrationId: FieldRef<"Phase", 'String'>
  }
    

  // Custom InputTypes

  /**
   * Phase findUnique
   */
  export type PhaseFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * Filter, which Phase to fetch.
     */
    where: PhaseWhereUniqueInput
  }


  /**
   * Phase findUniqueOrThrow
   */
  export type PhaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * Filter, which Phase to fetch.
     */
    where: PhaseWhereUniqueInput
  }


  /**
   * Phase findFirst
   */
  export type PhaseFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * Filter, which Phase to fetch.
     */
    where?: PhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Phases to fetch.
     */
    orderBy?: PhaseOrderByWithRelationInput | PhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Phases.
     */
    cursor?: PhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Phases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Phases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Phases.
     */
    distinct?: PhaseScalarFieldEnum | PhaseScalarFieldEnum[]
  }


  /**
   * Phase findFirstOrThrow
   */
  export type PhaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * Filter, which Phase to fetch.
     */
    where?: PhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Phases to fetch.
     */
    orderBy?: PhaseOrderByWithRelationInput | PhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Phases.
     */
    cursor?: PhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Phases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Phases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Phases.
     */
    distinct?: PhaseScalarFieldEnum | PhaseScalarFieldEnum[]
  }


  /**
   * Phase findMany
   */
  export type PhaseFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * Filter, which Phases to fetch.
     */
    where?: PhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Phases to fetch.
     */
    orderBy?: PhaseOrderByWithRelationInput | PhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Phases.
     */
    cursor?: PhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Phases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Phases.
     */
    skip?: number
    distinct?: PhaseScalarFieldEnum | PhaseScalarFieldEnum[]
  }


  /**
   * Phase create
   */
  export type PhaseCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Phase.
     */
    data?: XOR<PhaseCreateInput, PhaseUncheckedCreateInput>
  }


  /**
   * Phase update
   */
  export type PhaseUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Phase.
     */
    data: XOR<PhaseUpdateInput, PhaseUncheckedUpdateInput>
    /**
     * Choose, which Phase to update.
     */
    where: PhaseWhereUniqueInput
  }


  /**
   * Phase updateMany
   */
  export type PhaseUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Phases.
     */
    data: XOR<PhaseUpdateManyMutationInput, PhaseUncheckedUpdateManyInput>
    /**
     * Filter which Phases to update
     */
    where?: PhaseWhereInput
  }


  /**
   * Phase upsert
   */
  export type PhaseUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Phase to update in case it exists.
     */
    where: PhaseWhereUniqueInput
    /**
     * In case the Phase found by the `where` argument doesn't exist, create a new Phase with this data.
     */
    create: XOR<PhaseCreateInput, PhaseUncheckedCreateInput>
    /**
     * In case the Phase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhaseUpdateInput, PhaseUncheckedUpdateInput>
  }


  /**
   * Phase delete
   */
  export type PhaseDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    /**
     * Filter which Phase to delete.
     */
    where: PhaseWhereUniqueInput
  }


  /**
   * Phase deleteMany
   */
  export type PhaseDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Phases to delete
     */
    where?: PhaseWhereInput
  }


  /**
   * Phase.RouteOfAdministration
   */
  export type Phase$RouteOfAdministrationArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    where?: RouteOfAdministrationWhereInput
  }


  /**
   * Phase.effects
   */
  export type Phase$effectsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    where?: EffectWhereInput
    orderBy?: EffectOrderByWithRelationInput | EffectOrderByWithRelationInput[]
    cursor?: EffectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EffectScalarFieldEnum | EffectScalarFieldEnum[]
  }


  /**
   * Phase without action
   */
  export type PhaseArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
  }



  /**
   * Model Dosage
   */


  export type AggregateDosage = {
    _count: DosageCountAggregateOutputType | null
    _avg: DosageAvgAggregateOutputType | null
    _sum: DosageSumAggregateOutputType | null
    _min: DosageMinAggregateOutputType | null
    _max: DosageMaxAggregateOutputType | null
  }

  export type DosageAvgAggregateOutputType = {
    amount_min: number | null
    amount_max: number | null
  }

  export type DosageSumAggregateOutputType = {
    amount_min: number | null
    amount_max: number | null
  }

  export type DosageMinAggregateOutputType = {
    id: string | null
    intensivity: string | null
    amount_min: number | null
    amount_max: number | null
    unit: string | null
    perKilogram: boolean | null
    routeOfAdministrationId: string | null
  }

  export type DosageMaxAggregateOutputType = {
    id: string | null
    intensivity: string | null
    amount_min: number | null
    amount_max: number | null
    unit: string | null
    perKilogram: boolean | null
    routeOfAdministrationId: string | null
  }

  export type DosageCountAggregateOutputType = {
    id: number
    intensivity: number
    amount_min: number
    amount_max: number
    unit: number
    perKilogram: number
    routeOfAdministrationId: number
    _all: number
  }


  export type DosageAvgAggregateInputType = {
    amount_min?: true
    amount_max?: true
  }

  export type DosageSumAggregateInputType = {
    amount_min?: true
    amount_max?: true
  }

  export type DosageMinAggregateInputType = {
    id?: true
    intensivity?: true
    amount_min?: true
    amount_max?: true
    unit?: true
    perKilogram?: true
    routeOfAdministrationId?: true
  }

  export type DosageMaxAggregateInputType = {
    id?: true
    intensivity?: true
    amount_min?: true
    amount_max?: true
    unit?: true
    perKilogram?: true
    routeOfAdministrationId?: true
  }

  export type DosageCountAggregateInputType = {
    id?: true
    intensivity?: true
    amount_min?: true
    amount_max?: true
    unit?: true
    perKilogram?: true
    routeOfAdministrationId?: true
    _all?: true
  }

  export type DosageAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dosage to aggregate.
     */
    where?: DosageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dosages to fetch.
     */
    orderBy?: DosageOrderByWithRelationInput | DosageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DosageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dosages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dosages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Dosages
    **/
    _count?: true | DosageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DosageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DosageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DosageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DosageMaxAggregateInputType
  }

  export type GetDosageAggregateType<T extends DosageAggregateArgs> = {
        [P in keyof T & keyof AggregateDosage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDosage[P]>
      : GetScalarType<T[P], AggregateDosage[P]>
  }




  export type DosageGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: DosageWhereInput
    orderBy?: DosageOrderByWithAggregationInput | DosageOrderByWithAggregationInput[]
    by: DosageScalarFieldEnum[] | DosageScalarFieldEnum
    having?: DosageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DosageCountAggregateInputType | true
    _avg?: DosageAvgAggregateInputType
    _sum?: DosageSumAggregateInputType
    _min?: DosageMinAggregateInputType
    _max?: DosageMaxAggregateInputType
  }


  export type DosageGroupByOutputType = {
    id: string
    intensivity: string
    amount_min: number
    amount_max: number
    unit: string
    perKilogram: boolean
    routeOfAdministrationId: string | null
    _count: DosageCountAggregateOutputType | null
    _avg: DosageAvgAggregateOutputType | null
    _sum: DosageSumAggregateOutputType | null
    _min: DosageMinAggregateOutputType | null
    _max: DosageMaxAggregateOutputType | null
  }

  type GetDosageGroupByPayload<T extends DosageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DosageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DosageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DosageGroupByOutputType[P]>
            : GetScalarType<T[P], DosageGroupByOutputType[P]>
        }
      >
    >


  export type DosageSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    intensivity?: boolean
    amount_min?: boolean
    amount_max?: boolean
    unit?: boolean
    perKilogram?: boolean
    routeOfAdministrationId?: boolean
    RouteOfAdministration?: boolean | Dosage$RouteOfAdministrationArgs<ExtArgs>
  }, ExtArgs["result"]["dosage"]>

  export type DosageSelectScalar = {
    id?: boolean
    intensivity?: boolean
    amount_min?: boolean
    amount_max?: boolean
    unit?: boolean
    perKilogram?: boolean
    routeOfAdministrationId?: boolean
  }

  export type DosageInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    RouteOfAdministration?: boolean | Dosage$RouteOfAdministrationArgs<ExtArgs>
  }


  type DosageGetPayload<S extends boolean | null | undefined | DosageArgs> = $Types.GetResult<DosagePayload, S>

  type DosageCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<DosageFindManyArgs, 'select' | 'include'> & {
      select?: DosageCountAggregateInputType | true
    }

  export interface DosageDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dosage'], meta: { name: 'Dosage' } }
    /**
     * Find zero or one Dosage that matches the filter.
     * @param {DosageFindUniqueArgs} args - Arguments to find a Dosage
     * @example
     * // Get one Dosage
     * const dosage = await prisma.dosage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DosageFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DosageFindUniqueArgs<ExtArgs>>
    ): Prisma__DosageClient<$Types.GetResult<DosagePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Dosage that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {DosageFindUniqueOrThrowArgs} args - Arguments to find a Dosage
     * @example
     * // Get one Dosage
     * const dosage = await prisma.dosage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DosageFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DosageFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DosageClient<$Types.GetResult<DosagePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Dosage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DosageFindFirstArgs} args - Arguments to find a Dosage
     * @example
     * // Get one Dosage
     * const dosage = await prisma.dosage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DosageFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DosageFindFirstArgs<ExtArgs>>
    ): Prisma__DosageClient<$Types.GetResult<DosagePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Dosage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DosageFindFirstOrThrowArgs} args - Arguments to find a Dosage
     * @example
     * // Get one Dosage
     * const dosage = await prisma.dosage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DosageFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DosageFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DosageClient<$Types.GetResult<DosagePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Dosages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DosageFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dosages
     * const dosages = await prisma.dosage.findMany()
     * 
     * // Get first 10 Dosages
     * const dosages = await prisma.dosage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dosageWithIdOnly = await prisma.dosage.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DosageFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DosageFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<DosagePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Dosage.
     * @param {DosageCreateArgs} args - Arguments to create a Dosage.
     * @example
     * // Create one Dosage
     * const Dosage = await prisma.dosage.create({
     *   data: {
     *     // ... data to create a Dosage
     *   }
     * })
     * 
    **/
    create<T extends DosageCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DosageCreateArgs<ExtArgs>>
    ): Prisma__DosageClient<$Types.GetResult<DosagePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a Dosage.
     * @param {DosageDeleteArgs} args - Arguments to delete one Dosage.
     * @example
     * // Delete one Dosage
     * const Dosage = await prisma.dosage.delete({
     *   where: {
     *     // ... filter to delete one Dosage
     *   }
     * })
     * 
    **/
    delete<T extends DosageDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DosageDeleteArgs<ExtArgs>>
    ): Prisma__DosageClient<$Types.GetResult<DosagePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Dosage.
     * @param {DosageUpdateArgs} args - Arguments to update one Dosage.
     * @example
     * // Update one Dosage
     * const dosage = await prisma.dosage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DosageUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DosageUpdateArgs<ExtArgs>>
    ): Prisma__DosageClient<$Types.GetResult<DosagePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Dosages.
     * @param {DosageDeleteManyArgs} args - Arguments to filter Dosages to delete.
     * @example
     * // Delete a few Dosages
     * const { count } = await prisma.dosage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DosageDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DosageDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dosages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DosageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dosages
     * const dosage = await prisma.dosage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DosageUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DosageUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dosage.
     * @param {DosageUpsertArgs} args - Arguments to update or create a Dosage.
     * @example
     * // Update or create a Dosage
     * const dosage = await prisma.dosage.upsert({
     *   create: {
     *     // ... data to create a Dosage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dosage we want to update
     *   }
     * })
    **/
    upsert<T extends DosageUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DosageUpsertArgs<ExtArgs>>
    ): Prisma__DosageClient<$Types.GetResult<DosagePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Dosages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DosageCountArgs} args - Arguments to filter Dosages to count.
     * @example
     * // Count the number of Dosages
     * const count = await prisma.dosage.count({
     *   where: {
     *     // ... the filter for the Dosages we want to count
     *   }
     * })
    **/
    count<T extends DosageCountArgs>(
      args?: Subset<T, DosageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DosageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dosage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DosageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DosageAggregateArgs>(args: Subset<T, DosageAggregateArgs>): Prisma.PrismaPromise<GetDosageAggregateType<T>>

    /**
     * Group by Dosage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DosageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DosageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DosageGroupByArgs['orderBy'] }
        : { orderBy?: DosageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DosageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDosageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dosage model
   */
  readonly fields: DosageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dosage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__DosageClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    RouteOfAdministration<T extends Dosage$RouteOfAdministrationArgs<ExtArgs> = {}>(args?: Subset<T, Dosage$RouteOfAdministrationArgs<ExtArgs>>): Prisma__RouteOfAdministrationClient<$Types.GetResult<RouteOfAdministrationPayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the Dosage model
   */ 
  interface DosageFieldRefs {
    readonly id: FieldRef<"Dosage", 'String'>
    readonly intensivity: FieldRef<"Dosage", 'String'>
    readonly amount_min: FieldRef<"Dosage", 'Float'>
    readonly amount_max: FieldRef<"Dosage", 'Float'>
    readonly unit: FieldRef<"Dosage", 'String'>
    readonly perKilogram: FieldRef<"Dosage", 'Boolean'>
    readonly routeOfAdministrationId: FieldRef<"Dosage", 'String'>
  }
    

  // Custom InputTypes

  /**
   * Dosage findUnique
   */
  export type DosageFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * Filter, which Dosage to fetch.
     */
    where: DosageWhereUniqueInput
  }


  /**
   * Dosage findUniqueOrThrow
   */
  export type DosageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * Filter, which Dosage to fetch.
     */
    where: DosageWhereUniqueInput
  }


  /**
   * Dosage findFirst
   */
  export type DosageFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * Filter, which Dosage to fetch.
     */
    where?: DosageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dosages to fetch.
     */
    orderBy?: DosageOrderByWithRelationInput | DosageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dosages.
     */
    cursor?: DosageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dosages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dosages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dosages.
     */
    distinct?: DosageScalarFieldEnum | DosageScalarFieldEnum[]
  }


  /**
   * Dosage findFirstOrThrow
   */
  export type DosageFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * Filter, which Dosage to fetch.
     */
    where?: DosageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dosages to fetch.
     */
    orderBy?: DosageOrderByWithRelationInput | DosageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dosages.
     */
    cursor?: DosageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dosages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dosages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dosages.
     */
    distinct?: DosageScalarFieldEnum | DosageScalarFieldEnum[]
  }


  /**
   * Dosage findMany
   */
  export type DosageFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * Filter, which Dosages to fetch.
     */
    where?: DosageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dosages to fetch.
     */
    orderBy?: DosageOrderByWithRelationInput | DosageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Dosages.
     */
    cursor?: DosageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dosages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dosages.
     */
    skip?: number
    distinct?: DosageScalarFieldEnum | DosageScalarFieldEnum[]
  }


  /**
   * Dosage create
   */
  export type DosageCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * The data needed to create a Dosage.
     */
    data: XOR<DosageCreateInput, DosageUncheckedCreateInput>
  }


  /**
   * Dosage update
   */
  export type DosageUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * The data needed to update a Dosage.
     */
    data: XOR<DosageUpdateInput, DosageUncheckedUpdateInput>
    /**
     * Choose, which Dosage to update.
     */
    where: DosageWhereUniqueInput
  }


  /**
   * Dosage updateMany
   */
  export type DosageUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Dosages.
     */
    data: XOR<DosageUpdateManyMutationInput, DosageUncheckedUpdateManyInput>
    /**
     * Filter which Dosages to update
     */
    where?: DosageWhereInput
  }


  /**
   * Dosage upsert
   */
  export type DosageUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * The filter to search for the Dosage to update in case it exists.
     */
    where: DosageWhereUniqueInput
    /**
     * In case the Dosage found by the `where` argument doesn't exist, create a new Dosage with this data.
     */
    create: XOR<DosageCreateInput, DosageUncheckedCreateInput>
    /**
     * In case the Dosage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DosageUpdateInput, DosageUncheckedUpdateInput>
  }


  /**
   * Dosage delete
   */
  export type DosageDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
    /**
     * Filter which Dosage to delete.
     */
    where: DosageWhereUniqueInput
  }


  /**
   * Dosage deleteMany
   */
  export type DosageDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dosages to delete
     */
    where?: DosageWhereInput
  }


  /**
   * Dosage.RouteOfAdministration
   */
  export type Dosage$RouteOfAdministrationArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RouteOfAdministration
     */
    select?: RouteOfAdministrationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RouteOfAdministrationInclude<ExtArgs> | null
    where?: RouteOfAdministrationWhereInput
  }


  /**
   * Dosage without action
   */
  export type DosageArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dosage
     */
    select?: DosageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DosageInclude<ExtArgs> | null
  }



  /**
   * Model Effect
   */


  export type AggregateEffect = {
    _count: EffectCountAggregateOutputType | null
    _min: EffectMinAggregateOutputType | null
    _max: EffectMaxAggregateOutputType | null
  }

  export type EffectMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    category: string | null
    type: string | null
    tags: string | null
    summary: string | null
    description: string | null
    parameters: string | null
    see_also: string | null
    effectindex: string | null
    psychonautwiki: string | null
  }

  export type EffectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    category: string | null
    type: string | null
    tags: string | null
    summary: string | null
    description: string | null
    parameters: string | null
    see_also: string | null
    effectindex: string | null
    psychonautwiki: string | null
  }

  export type EffectCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    category: number
    type: number
    tags: number
    summary: number
    description: number
    parameters: number
    see_also: number
    effectindex: number
    psychonautwiki: number
    _all: number
  }


  export type EffectMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    category?: true
    type?: true
    tags?: true
    summary?: true
    description?: true
    parameters?: true
    see_also?: true
    effectindex?: true
    psychonautwiki?: true
  }

  export type EffectMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    category?: true
    type?: true
    tags?: true
    summary?: true
    description?: true
    parameters?: true
    see_also?: true
    effectindex?: true
    psychonautwiki?: true
  }

  export type EffectCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    category?: true
    type?: true
    tags?: true
    summary?: true
    description?: true
    parameters?: true
    see_also?: true
    effectindex?: true
    psychonautwiki?: true
    _all?: true
  }

  export type EffectAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Effect to aggregate.
     */
    where?: EffectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Effects to fetch.
     */
    orderBy?: EffectOrderByWithRelationInput | EffectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EffectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Effects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Effects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Effects
    **/
    _count?: true | EffectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EffectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EffectMaxAggregateInputType
  }

  export type GetEffectAggregateType<T extends EffectAggregateArgs> = {
        [P in keyof T & keyof AggregateEffect]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEffect[P]>
      : GetScalarType<T[P], AggregateEffect[P]>
  }




  export type EffectGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: EffectWhereInput
    orderBy?: EffectOrderByWithAggregationInput | EffectOrderByWithAggregationInput[]
    by: EffectScalarFieldEnum[] | EffectScalarFieldEnum
    having?: EffectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EffectCountAggregateInputType | true
    _min?: EffectMinAggregateInputType
    _max?: EffectMaxAggregateInputType
  }


  export type EffectGroupByOutputType = {
    id: string
    name: string
    slug: string
    category: string | null
    type: string | null
    tags: string
    summary: string | null
    description: string
    parameters: string
    see_also: string
    effectindex: string | null
    psychonautwiki: string | null
    _count: EffectCountAggregateOutputType | null
    _min: EffectMinAggregateOutputType | null
    _max: EffectMaxAggregateOutputType | null
  }

  type GetEffectGroupByPayload<T extends EffectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EffectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EffectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EffectGroupByOutputType[P]>
            : GetScalarType<T[P], EffectGroupByOutputType[P]>
        }
      >
    >


  export type EffectSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    category?: boolean
    type?: boolean
    tags?: boolean
    summary?: boolean
    description?: boolean
    parameters?: boolean
    see_also?: boolean
    effectindex?: boolean
    psychonautwiki?: boolean
    Phase?: boolean | Effect$PhaseArgs<ExtArgs>
    _count?: boolean | EffectCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["effect"]>

  export type EffectSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    category?: boolean
    type?: boolean
    tags?: boolean
    summary?: boolean
    description?: boolean
    parameters?: boolean
    see_also?: boolean
    effectindex?: boolean
    psychonautwiki?: boolean
  }

  export type EffectInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    Phase?: boolean | Effect$PhaseArgs<ExtArgs>
    _count?: boolean | EffectCountOutputTypeArgs<ExtArgs>
  }


  type EffectGetPayload<S extends boolean | null | undefined | EffectArgs> = $Types.GetResult<EffectPayload, S>

  type EffectCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<EffectFindManyArgs, 'select' | 'include'> & {
      select?: EffectCountAggregateInputType | true
    }

  export interface EffectDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Effect'], meta: { name: 'Effect' } }
    /**
     * Find zero or one Effect that matches the filter.
     * @param {EffectFindUniqueArgs} args - Arguments to find a Effect
     * @example
     * // Get one Effect
     * const effect = await prisma.effect.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EffectFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, EffectFindUniqueArgs<ExtArgs>>
    ): Prisma__EffectClient<$Types.GetResult<EffectPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Effect that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {EffectFindUniqueOrThrowArgs} args - Arguments to find a Effect
     * @example
     * // Get one Effect
     * const effect = await prisma.effect.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends EffectFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, EffectFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EffectClient<$Types.GetResult<EffectPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Effect that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EffectFindFirstArgs} args - Arguments to find a Effect
     * @example
     * // Get one Effect
     * const effect = await prisma.effect.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EffectFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, EffectFindFirstArgs<ExtArgs>>
    ): Prisma__EffectClient<$Types.GetResult<EffectPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Effect that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EffectFindFirstOrThrowArgs} args - Arguments to find a Effect
     * @example
     * // Get one Effect
     * const effect = await prisma.effect.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends EffectFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, EffectFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EffectClient<$Types.GetResult<EffectPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Effects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EffectFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Effects
     * const effects = await prisma.effect.findMany()
     * 
     * // Get first 10 Effects
     * const effects = await prisma.effect.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const effectWithIdOnly = await prisma.effect.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends EffectFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EffectFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<EffectPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Effect.
     * @param {EffectCreateArgs} args - Arguments to create a Effect.
     * @example
     * // Create one Effect
     * const Effect = await prisma.effect.create({
     *   data: {
     *     // ... data to create a Effect
     *   }
     * })
     * 
    **/
    create<T extends EffectCreateArgs<ExtArgs>>(
      args: SelectSubset<T, EffectCreateArgs<ExtArgs>>
    ): Prisma__EffectClient<$Types.GetResult<EffectPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a Effect.
     * @param {EffectDeleteArgs} args - Arguments to delete one Effect.
     * @example
     * // Delete one Effect
     * const Effect = await prisma.effect.delete({
     *   where: {
     *     // ... filter to delete one Effect
     *   }
     * })
     * 
    **/
    delete<T extends EffectDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, EffectDeleteArgs<ExtArgs>>
    ): Prisma__EffectClient<$Types.GetResult<EffectPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Effect.
     * @param {EffectUpdateArgs} args - Arguments to update one Effect.
     * @example
     * // Update one Effect
     * const effect = await prisma.effect.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EffectUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, EffectUpdateArgs<ExtArgs>>
    ): Prisma__EffectClient<$Types.GetResult<EffectPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Effects.
     * @param {EffectDeleteManyArgs} args - Arguments to filter Effects to delete.
     * @example
     * // Delete a few Effects
     * const { count } = await prisma.effect.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EffectDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EffectDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Effects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EffectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Effects
     * const effect = await prisma.effect.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EffectUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, EffectUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Effect.
     * @param {EffectUpsertArgs} args - Arguments to update or create a Effect.
     * @example
     * // Update or create a Effect
     * const effect = await prisma.effect.upsert({
     *   create: {
     *     // ... data to create a Effect
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Effect we want to update
     *   }
     * })
    **/
    upsert<T extends EffectUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, EffectUpsertArgs<ExtArgs>>
    ): Prisma__EffectClient<$Types.GetResult<EffectPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Effects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EffectCountArgs} args - Arguments to filter Effects to count.
     * @example
     * // Count the number of Effects
     * const count = await prisma.effect.count({
     *   where: {
     *     // ... the filter for the Effects we want to count
     *   }
     * })
    **/
    count<T extends EffectCountArgs>(
      args?: Subset<T, EffectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EffectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Effect.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EffectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EffectAggregateArgs>(args: Subset<T, EffectAggregateArgs>): Prisma.PrismaPromise<GetEffectAggregateType<T>>

    /**
     * Group by Effect.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EffectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EffectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EffectGroupByArgs['orderBy'] }
        : { orderBy?: EffectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EffectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEffectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Effect model
   */
  readonly fields: EffectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Effect.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EffectClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    Phase<T extends Effect$PhaseArgs<ExtArgs> = {}>(args?: Subset<T, Effect$PhaseArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<PhasePayload<ExtArgs>, T, 'findMany'>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the Effect model
   */ 
  interface EffectFieldRefs {
    readonly id: FieldRef<"Effect", 'String'>
    readonly name: FieldRef<"Effect", 'String'>
    readonly slug: FieldRef<"Effect", 'String'>
    readonly category: FieldRef<"Effect", 'String'>
    readonly type: FieldRef<"Effect", 'String'>
    readonly tags: FieldRef<"Effect", 'String'>
    readonly summary: FieldRef<"Effect", 'String'>
    readonly description: FieldRef<"Effect", 'String'>
    readonly parameters: FieldRef<"Effect", 'String'>
    readonly see_also: FieldRef<"Effect", 'String'>
    readonly effectindex: FieldRef<"Effect", 'String'>
    readonly psychonautwiki: FieldRef<"Effect", 'String'>
  }
    

  // Custom InputTypes

  /**
   * Effect findUnique
   */
  export type EffectFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * Filter, which Effect to fetch.
     */
    where: EffectWhereUniqueInput
  }


  /**
   * Effect findUniqueOrThrow
   */
  export type EffectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * Filter, which Effect to fetch.
     */
    where: EffectWhereUniqueInput
  }


  /**
   * Effect findFirst
   */
  export type EffectFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * Filter, which Effect to fetch.
     */
    where?: EffectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Effects to fetch.
     */
    orderBy?: EffectOrderByWithRelationInput | EffectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Effects.
     */
    cursor?: EffectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Effects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Effects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Effects.
     */
    distinct?: EffectScalarFieldEnum | EffectScalarFieldEnum[]
  }


  /**
   * Effect findFirstOrThrow
   */
  export type EffectFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * Filter, which Effect to fetch.
     */
    where?: EffectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Effects to fetch.
     */
    orderBy?: EffectOrderByWithRelationInput | EffectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Effects.
     */
    cursor?: EffectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Effects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Effects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Effects.
     */
    distinct?: EffectScalarFieldEnum | EffectScalarFieldEnum[]
  }


  /**
   * Effect findMany
   */
  export type EffectFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * Filter, which Effects to fetch.
     */
    where?: EffectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Effects to fetch.
     */
    orderBy?: EffectOrderByWithRelationInput | EffectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Effects.
     */
    cursor?: EffectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Effects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Effects.
     */
    skip?: number
    distinct?: EffectScalarFieldEnum | EffectScalarFieldEnum[]
  }


  /**
   * Effect create
   */
  export type EffectCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * The data needed to create a Effect.
     */
    data: XOR<EffectCreateInput, EffectUncheckedCreateInput>
  }


  /**
   * Effect update
   */
  export type EffectUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * The data needed to update a Effect.
     */
    data: XOR<EffectUpdateInput, EffectUncheckedUpdateInput>
    /**
     * Choose, which Effect to update.
     */
    where: EffectWhereUniqueInput
  }


  /**
   * Effect updateMany
   */
  export type EffectUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Effects.
     */
    data: XOR<EffectUpdateManyMutationInput, EffectUncheckedUpdateManyInput>
    /**
     * Filter which Effects to update
     */
    where?: EffectWhereInput
  }


  /**
   * Effect upsert
   */
  export type EffectUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * The filter to search for the Effect to update in case it exists.
     */
    where: EffectWhereUniqueInput
    /**
     * In case the Effect found by the `where` argument doesn't exist, create a new Effect with this data.
     */
    create: XOR<EffectCreateInput, EffectUncheckedCreateInput>
    /**
     * In case the Effect was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EffectUpdateInput, EffectUncheckedUpdateInput>
  }


  /**
   * Effect delete
   */
  export type EffectDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
    /**
     * Filter which Effect to delete.
     */
    where: EffectWhereUniqueInput
  }


  /**
   * Effect deleteMany
   */
  export type EffectDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Effects to delete
     */
    where?: EffectWhereInput
  }


  /**
   * Effect.Phase
   */
  export type Effect$PhaseArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Phase
     */
    select?: PhaseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PhaseInclude<ExtArgs> | null
    where?: PhaseWhereInput
    orderBy?: PhaseOrderByWithRelationInput | PhaseOrderByWithRelationInput[]
    cursor?: PhaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PhaseScalarFieldEnum | PhaseScalarFieldEnum[]
  }


  /**
   * Effect without action
   */
  export type EffectArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Effect
     */
    select?: EffectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EffectInclude<ExtArgs> | null
  }



  /**
   * Model Ingestion
   */


  export type AggregateIngestion = {
    _count: IngestionCountAggregateOutputType | null
    _avg: IngestionAvgAggregateOutputType | null
    _sum: IngestionSumAggregateOutputType | null
    _min: IngestionMinAggregateOutputType | null
    _max: IngestionMaxAggregateOutputType | null
  }

  export type IngestionAvgAggregateOutputType = {
    dosage_amount: number | null
  }

  export type IngestionSumAggregateOutputType = {
    dosage_amount: number | null
  }

  export type IngestionMinAggregateOutputType = {
    id: string | null
    substanceName: string | null
    routeOfAdministration: string | null
    dosage_unit: string | null
    dosage_amount: number | null
    isEstimatedDosage: boolean | null
    date: Date | null
    subject_id: string | null
    stashId: string | null
  }

  export type IngestionMaxAggregateOutputType = {
    id: string | null
    substanceName: string | null
    routeOfAdministration: string | null
    dosage_unit: string | null
    dosage_amount: number | null
    isEstimatedDosage: boolean | null
    date: Date | null
    subject_id: string | null
    stashId: string | null
  }

  export type IngestionCountAggregateOutputType = {
    id: number
    substanceName: number
    routeOfAdministration: number
    dosage_unit: number
    dosage_amount: number
    isEstimatedDosage: number
    date: number
    subject_id: number
    stashId: number
    _all: number
  }


  export type IngestionAvgAggregateInputType = {
    dosage_amount?: true
  }

  export type IngestionSumAggregateInputType = {
    dosage_amount?: true
  }

  export type IngestionMinAggregateInputType = {
    id?: true
    substanceName?: true
    routeOfAdministration?: true
    dosage_unit?: true
    dosage_amount?: true
    isEstimatedDosage?: true
    date?: true
    subject_id?: true
    stashId?: true
  }

  export type IngestionMaxAggregateInputType = {
    id?: true
    substanceName?: true
    routeOfAdministration?: true
    dosage_unit?: true
    dosage_amount?: true
    isEstimatedDosage?: true
    date?: true
    subject_id?: true
    stashId?: true
  }

  export type IngestionCountAggregateInputType = {
    id?: true
    substanceName?: true
    routeOfAdministration?: true
    dosage_unit?: true
    dosage_amount?: true
    isEstimatedDosage?: true
    date?: true
    subject_id?: true
    stashId?: true
    _all?: true
  }

  export type IngestionAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ingestion to aggregate.
     */
    where?: IngestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingestions to fetch.
     */
    orderBy?: IngestionOrderByWithRelationInput | IngestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IngestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ingestions
    **/
    _count?: true | IngestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IngestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IngestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IngestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IngestionMaxAggregateInputType
  }

  export type GetIngestionAggregateType<T extends IngestionAggregateArgs> = {
        [P in keyof T & keyof AggregateIngestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIngestion[P]>
      : GetScalarType<T[P], AggregateIngestion[P]>
  }




  export type IngestionGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: IngestionWhereInput
    orderBy?: IngestionOrderByWithAggregationInput | IngestionOrderByWithAggregationInput[]
    by: IngestionScalarFieldEnum[] | IngestionScalarFieldEnum
    having?: IngestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IngestionCountAggregateInputType | true
    _avg?: IngestionAvgAggregateInputType
    _sum?: IngestionSumAggregateInputType
    _min?: IngestionMinAggregateInputType
    _max?: IngestionMaxAggregateInputType
  }


  export type IngestionGroupByOutputType = {
    id: string
    substanceName: string | null
    routeOfAdministration: string | null
    dosage_unit: string | null
    dosage_amount: number | null
    isEstimatedDosage: boolean | null
    date: Date | null
    subject_id: string | null
    stashId: string | null
    _count: IngestionCountAggregateOutputType | null
    _avg: IngestionAvgAggregateOutputType | null
    _sum: IngestionSumAggregateOutputType | null
    _min: IngestionMinAggregateOutputType | null
    _max: IngestionMaxAggregateOutputType | null
  }

  type GetIngestionGroupByPayload<T extends IngestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IngestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IngestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IngestionGroupByOutputType[P]>
            : GetScalarType<T[P], IngestionGroupByOutputType[P]>
        }
      >
    >


  export type IngestionSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    substanceName?: boolean
    routeOfAdministration?: boolean
    dosage_unit?: boolean
    dosage_amount?: boolean
    isEstimatedDosage?: boolean
    date?: boolean
    subject_id?: boolean
    stashId?: boolean
    Subject?: boolean | Ingestion$SubjectArgs<ExtArgs>
    Substance?: boolean | Ingestion$SubstanceArgs<ExtArgs>
    Stash?: boolean | Ingestion$StashArgs<ExtArgs>
  }, ExtArgs["result"]["ingestion"]>

  export type IngestionSelectScalar = {
    id?: boolean
    substanceName?: boolean
    routeOfAdministration?: boolean
    dosage_unit?: boolean
    dosage_amount?: boolean
    isEstimatedDosage?: boolean
    date?: boolean
    subject_id?: boolean
    stashId?: boolean
  }

  export type IngestionInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    Subject?: boolean | Ingestion$SubjectArgs<ExtArgs>
    Substance?: boolean | Ingestion$SubstanceArgs<ExtArgs>
    Stash?: boolean | Ingestion$StashArgs<ExtArgs>
  }


  type IngestionGetPayload<S extends boolean | null | undefined | IngestionArgs> = $Types.GetResult<IngestionPayload, S>

  type IngestionCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<IngestionFindManyArgs, 'select' | 'include'> & {
      select?: IngestionCountAggregateInputType | true
    }

  export interface IngestionDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ingestion'], meta: { name: 'Ingestion' } }
    /**
     * Find zero or one Ingestion that matches the filter.
     * @param {IngestionFindUniqueArgs} args - Arguments to find a Ingestion
     * @example
     * // Get one Ingestion
     * const ingestion = await prisma.ingestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends IngestionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, IngestionFindUniqueArgs<ExtArgs>>
    ): Prisma__IngestionClient<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Ingestion that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {IngestionFindUniqueOrThrowArgs} args - Arguments to find a Ingestion
     * @example
     * // Get one Ingestion
     * const ingestion = await prisma.ingestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends IngestionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, IngestionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__IngestionClient<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Ingestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionFindFirstArgs} args - Arguments to find a Ingestion
     * @example
     * // Get one Ingestion
     * const ingestion = await prisma.ingestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends IngestionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, IngestionFindFirstArgs<ExtArgs>>
    ): Prisma__IngestionClient<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Ingestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionFindFirstOrThrowArgs} args - Arguments to find a Ingestion
     * @example
     * // Get one Ingestion
     * const ingestion = await prisma.ingestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends IngestionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, IngestionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__IngestionClient<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Ingestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ingestions
     * const ingestions = await prisma.ingestion.findMany()
     * 
     * // Get first 10 Ingestions
     * const ingestions = await prisma.ingestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ingestionWithIdOnly = await prisma.ingestion.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends IngestionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, IngestionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Ingestion.
     * @param {IngestionCreateArgs} args - Arguments to create a Ingestion.
     * @example
     * // Create one Ingestion
     * const Ingestion = await prisma.ingestion.create({
     *   data: {
     *     // ... data to create a Ingestion
     *   }
     * })
     * 
    **/
    create<T extends IngestionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, IngestionCreateArgs<ExtArgs>>
    ): Prisma__IngestionClient<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a Ingestion.
     * @param {IngestionDeleteArgs} args - Arguments to delete one Ingestion.
     * @example
     * // Delete one Ingestion
     * const Ingestion = await prisma.ingestion.delete({
     *   where: {
     *     // ... filter to delete one Ingestion
     *   }
     * })
     * 
    **/
    delete<T extends IngestionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, IngestionDeleteArgs<ExtArgs>>
    ): Prisma__IngestionClient<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Ingestion.
     * @param {IngestionUpdateArgs} args - Arguments to update one Ingestion.
     * @example
     * // Update one Ingestion
     * const ingestion = await prisma.ingestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends IngestionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, IngestionUpdateArgs<ExtArgs>>
    ): Prisma__IngestionClient<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Ingestions.
     * @param {IngestionDeleteManyArgs} args - Arguments to filter Ingestions to delete.
     * @example
     * // Delete a few Ingestions
     * const { count } = await prisma.ingestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends IngestionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, IngestionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ingestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ingestions
     * const ingestion = await prisma.ingestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends IngestionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, IngestionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ingestion.
     * @param {IngestionUpsertArgs} args - Arguments to update or create a Ingestion.
     * @example
     * // Update or create a Ingestion
     * const ingestion = await prisma.ingestion.upsert({
     *   create: {
     *     // ... data to create a Ingestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ingestion we want to update
     *   }
     * })
    **/
    upsert<T extends IngestionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, IngestionUpsertArgs<ExtArgs>>
    ): Prisma__IngestionClient<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Ingestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionCountArgs} args - Arguments to filter Ingestions to count.
     * @example
     * // Count the number of Ingestions
     * const count = await prisma.ingestion.count({
     *   where: {
     *     // ... the filter for the Ingestions we want to count
     *   }
     * })
    **/
    count<T extends IngestionCountArgs>(
      args?: Subset<T, IngestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IngestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ingestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IngestionAggregateArgs>(args: Subset<T, IngestionAggregateArgs>): Prisma.PrismaPromise<GetIngestionAggregateType<T>>

    /**
     * Group by Ingestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IngestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IngestionGroupByArgs['orderBy'] }
        : { orderBy?: IngestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IngestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ingestion model
   */
  readonly fields: IngestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ingestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__IngestionClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    Subject<T extends Ingestion$SubjectArgs<ExtArgs> = {}>(args?: Subset<T, Ingestion$SubjectArgs<ExtArgs>>): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    Substance<T extends Ingestion$SubstanceArgs<ExtArgs> = {}>(args?: Subset<T, Ingestion$SubstanceArgs<ExtArgs>>): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    Stash<T extends Ingestion$StashArgs<ExtArgs> = {}>(args?: Subset<T, Ingestion$StashArgs<ExtArgs>>): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the Ingestion model
   */ 
  interface IngestionFieldRefs {
    readonly id: FieldRef<"Ingestion", 'String'>
    readonly substanceName: FieldRef<"Ingestion", 'String'>
    readonly routeOfAdministration: FieldRef<"Ingestion", 'String'>
    readonly dosage_unit: FieldRef<"Ingestion", 'String'>
    readonly dosage_amount: FieldRef<"Ingestion", 'Int'>
    readonly isEstimatedDosage: FieldRef<"Ingestion", 'Boolean'>
    readonly date: FieldRef<"Ingestion", 'DateTime'>
    readonly subject_id: FieldRef<"Ingestion", 'String'>
    readonly stashId: FieldRef<"Ingestion", 'String'>
  }
    

  // Custom InputTypes

  /**
   * Ingestion findUnique
   */
  export type IngestionFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * Filter, which Ingestion to fetch.
     */
    where: IngestionWhereUniqueInput
  }


  /**
   * Ingestion findUniqueOrThrow
   */
  export type IngestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * Filter, which Ingestion to fetch.
     */
    where: IngestionWhereUniqueInput
  }


  /**
   * Ingestion findFirst
   */
  export type IngestionFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * Filter, which Ingestion to fetch.
     */
    where?: IngestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingestions to fetch.
     */
    orderBy?: IngestionOrderByWithRelationInput | IngestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ingestions.
     */
    cursor?: IngestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ingestions.
     */
    distinct?: IngestionScalarFieldEnum | IngestionScalarFieldEnum[]
  }


  /**
   * Ingestion findFirstOrThrow
   */
  export type IngestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * Filter, which Ingestion to fetch.
     */
    where?: IngestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingestions to fetch.
     */
    orderBy?: IngestionOrderByWithRelationInput | IngestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ingestions.
     */
    cursor?: IngestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ingestions.
     */
    distinct?: IngestionScalarFieldEnum | IngestionScalarFieldEnum[]
  }


  /**
   * Ingestion findMany
   */
  export type IngestionFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * Filter, which Ingestions to fetch.
     */
    where?: IngestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingestions to fetch.
     */
    orderBy?: IngestionOrderByWithRelationInput | IngestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ingestions.
     */
    cursor?: IngestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingestions.
     */
    skip?: number
    distinct?: IngestionScalarFieldEnum | IngestionScalarFieldEnum[]
  }


  /**
   * Ingestion create
   */
  export type IngestionCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * The data needed to create a Ingestion.
     */
    data?: XOR<IngestionCreateInput, IngestionUncheckedCreateInput>
  }


  /**
   * Ingestion update
   */
  export type IngestionUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * The data needed to update a Ingestion.
     */
    data: XOR<IngestionUpdateInput, IngestionUncheckedUpdateInput>
    /**
     * Choose, which Ingestion to update.
     */
    where: IngestionWhereUniqueInput
  }


  /**
   * Ingestion updateMany
   */
  export type IngestionUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ingestions.
     */
    data: XOR<IngestionUpdateManyMutationInput, IngestionUncheckedUpdateManyInput>
    /**
     * Filter which Ingestions to update
     */
    where?: IngestionWhereInput
  }


  /**
   * Ingestion upsert
   */
  export type IngestionUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * The filter to search for the Ingestion to update in case it exists.
     */
    where: IngestionWhereUniqueInput
    /**
     * In case the Ingestion found by the `where` argument doesn't exist, create a new Ingestion with this data.
     */
    create: XOR<IngestionCreateInput, IngestionUncheckedCreateInput>
    /**
     * In case the Ingestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IngestionUpdateInput, IngestionUncheckedUpdateInput>
  }


  /**
   * Ingestion delete
   */
  export type IngestionDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    /**
     * Filter which Ingestion to delete.
     */
    where: IngestionWhereUniqueInput
  }


  /**
   * Ingestion deleteMany
   */
  export type IngestionDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ingestions to delete
     */
    where?: IngestionWhereInput
  }


  /**
   * Ingestion.Subject
   */
  export type Ingestion$SubjectArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    where?: SubjectWhereInput
  }


  /**
   * Ingestion.Substance
   */
  export type Ingestion$SubstanceArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    where?: SubstanceWhereInput
  }


  /**
   * Ingestion.Stash
   */
  export type Ingestion$StashArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    where?: StashWhereInput
  }


  /**
   * Ingestion without action
   */
  export type IngestionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
  }



  /**
   * Model Stash
   */


  export type AggregateStash = {
    _count: StashCountAggregateOutputType | null
    _avg: StashAvgAggregateOutputType | null
    _sum: StashSumAggregateOutputType | null
    _min: StashMinAggregateOutputType | null
    _max: StashMaxAggregateOutputType | null
  }

  export type StashAvgAggregateOutputType = {
    amount: number | null
    purity: number | null
  }

  export type StashSumAggregateOutputType = {
    amount: number | null
    purity: number | null
  }

  export type StashMinAggregateOutputType = {
    id: string | null
    owner_id: string | null
    substance_id: string | null
    addedDate: Date | null
    expiration: Date | null
    amount: number | null
    price: string | null
    vendor: string | null
    description: string | null
    purity: number | null
  }

  export type StashMaxAggregateOutputType = {
    id: string | null
    owner_id: string | null
    substance_id: string | null
    addedDate: Date | null
    expiration: Date | null
    amount: number | null
    price: string | null
    vendor: string | null
    description: string | null
    purity: number | null
  }

  export type StashCountAggregateOutputType = {
    id: number
    owner_id: number
    substance_id: number
    addedDate: number
    expiration: number
    amount: number
    price: number
    vendor: number
    description: number
    purity: number
    _all: number
  }


  export type StashAvgAggregateInputType = {
    amount?: true
    purity?: true
  }

  export type StashSumAggregateInputType = {
    amount?: true
    purity?: true
  }

  export type StashMinAggregateInputType = {
    id?: true
    owner_id?: true
    substance_id?: true
    addedDate?: true
    expiration?: true
    amount?: true
    price?: true
    vendor?: true
    description?: true
    purity?: true
  }

  export type StashMaxAggregateInputType = {
    id?: true
    owner_id?: true
    substance_id?: true
    addedDate?: true
    expiration?: true
    amount?: true
    price?: true
    vendor?: true
    description?: true
    purity?: true
  }

  export type StashCountAggregateInputType = {
    id?: true
    owner_id?: true
    substance_id?: true
    addedDate?: true
    expiration?: true
    amount?: true
    price?: true
    vendor?: true
    description?: true
    purity?: true
    _all?: true
  }

  export type StashAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stash to aggregate.
     */
    where?: StashWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stashes to fetch.
     */
    orderBy?: StashOrderByWithRelationInput | StashOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StashWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stashes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stashes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Stashes
    **/
    _count?: true | StashCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StashAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StashSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StashMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StashMaxAggregateInputType
  }

  export type GetStashAggregateType<T extends StashAggregateArgs> = {
        [P in keyof T & keyof AggregateStash]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStash[P]>
      : GetScalarType<T[P], AggregateStash[P]>
  }




  export type StashGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: StashWhereInput
    orderBy?: StashOrderByWithAggregationInput | StashOrderByWithAggregationInput[]
    by: StashScalarFieldEnum[] | StashScalarFieldEnum
    having?: StashScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StashCountAggregateInputType | true
    _avg?: StashAvgAggregateInputType
    _sum?: StashSumAggregateInputType
    _min?: StashMinAggregateInputType
    _max?: StashMaxAggregateInputType
  }


  export type StashGroupByOutputType = {
    id: string
    owner_id: string
    substance_id: string
    addedDate: Date | null
    expiration: Date | null
    amount: number | null
    price: string | null
    vendor: string | null
    description: string | null
    purity: number | null
    _count: StashCountAggregateOutputType | null
    _avg: StashAvgAggregateOutputType | null
    _sum: StashSumAggregateOutputType | null
    _min: StashMinAggregateOutputType | null
    _max: StashMaxAggregateOutputType | null
  }

  type GetStashGroupByPayload<T extends StashGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StashGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StashGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StashGroupByOutputType[P]>
            : GetScalarType<T[P], StashGroupByOutputType[P]>
        }
      >
    >


  export type StashSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    owner_id?: boolean
    substance_id?: boolean
    addedDate?: boolean
    expiration?: boolean
    amount?: boolean
    price?: boolean
    vendor?: boolean
    description?: boolean
    purity?: boolean
    Subject?: boolean | Stash$SubjectArgs<ExtArgs>
    Substance?: boolean | SubstanceArgs<ExtArgs>
    ingestions?: boolean | Stash$ingestionsArgs<ExtArgs>
    _count?: boolean | StashCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["stash"]>

  export type StashSelectScalar = {
    id?: boolean
    owner_id?: boolean
    substance_id?: boolean
    addedDate?: boolean
    expiration?: boolean
    amount?: boolean
    price?: boolean
    vendor?: boolean
    description?: boolean
    purity?: boolean
  }

  export type StashInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    Subject?: boolean | Stash$SubjectArgs<ExtArgs>
    Substance?: boolean | SubstanceArgs<ExtArgs>
    ingestions?: boolean | Stash$ingestionsArgs<ExtArgs>
    _count?: boolean | StashCountOutputTypeArgs<ExtArgs>
  }


  type StashGetPayload<S extends boolean | null | undefined | StashArgs> = $Types.GetResult<StashPayload, S>

  type StashCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<StashFindManyArgs, 'select' | 'include'> & {
      select?: StashCountAggregateInputType | true
    }

  export interface StashDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Stash'], meta: { name: 'Stash' } }
    /**
     * Find zero or one Stash that matches the filter.
     * @param {StashFindUniqueArgs} args - Arguments to find a Stash
     * @example
     * // Get one Stash
     * const stash = await prisma.stash.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends StashFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, StashFindUniqueArgs<ExtArgs>>
    ): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Stash that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {StashFindUniqueOrThrowArgs} args - Arguments to find a Stash
     * @example
     * // Get one Stash
     * const stash = await prisma.stash.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends StashFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, StashFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Stash that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StashFindFirstArgs} args - Arguments to find a Stash
     * @example
     * // Get one Stash
     * const stash = await prisma.stash.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends StashFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, StashFindFirstArgs<ExtArgs>>
    ): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Stash that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StashFindFirstOrThrowArgs} args - Arguments to find a Stash
     * @example
     * // Get one Stash
     * const stash = await prisma.stash.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends StashFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, StashFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Stashes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StashFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stashes
     * const stashes = await prisma.stash.findMany()
     * 
     * // Get first 10 Stashes
     * const stashes = await prisma.stash.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stashWithIdOnly = await prisma.stash.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends StashFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, StashFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<StashPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Stash.
     * @param {StashCreateArgs} args - Arguments to create a Stash.
     * @example
     * // Create one Stash
     * const Stash = await prisma.stash.create({
     *   data: {
     *     // ... data to create a Stash
     *   }
     * })
     * 
    **/
    create<T extends StashCreateArgs<ExtArgs>>(
      args: SelectSubset<T, StashCreateArgs<ExtArgs>>
    ): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a Stash.
     * @param {StashDeleteArgs} args - Arguments to delete one Stash.
     * @example
     * // Delete one Stash
     * const Stash = await prisma.stash.delete({
     *   where: {
     *     // ... filter to delete one Stash
     *   }
     * })
     * 
    **/
    delete<T extends StashDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, StashDeleteArgs<ExtArgs>>
    ): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Stash.
     * @param {StashUpdateArgs} args - Arguments to update one Stash.
     * @example
     * // Update one Stash
     * const stash = await prisma.stash.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends StashUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, StashUpdateArgs<ExtArgs>>
    ): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Stashes.
     * @param {StashDeleteManyArgs} args - Arguments to filter Stashes to delete.
     * @example
     * // Delete a few Stashes
     * const { count } = await prisma.stash.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends StashDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, StashDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stashes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StashUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stashes
     * const stash = await prisma.stash.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends StashUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, StashUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Stash.
     * @param {StashUpsertArgs} args - Arguments to update or create a Stash.
     * @example
     * // Update or create a Stash
     * const stash = await prisma.stash.upsert({
     *   create: {
     *     // ... data to create a Stash
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Stash we want to update
     *   }
     * })
    **/
    upsert<T extends StashUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, StashUpsertArgs<ExtArgs>>
    ): Prisma__StashClient<$Types.GetResult<StashPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Stashes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StashCountArgs} args - Arguments to filter Stashes to count.
     * @example
     * // Count the number of Stashes
     * const count = await prisma.stash.count({
     *   where: {
     *     // ... the filter for the Stashes we want to count
     *   }
     * })
    **/
    count<T extends StashCountArgs>(
      args?: Subset<T, StashCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StashCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Stash.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StashAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StashAggregateArgs>(args: Subset<T, StashAggregateArgs>): Prisma.PrismaPromise<GetStashAggregateType<T>>

    /**
     * Group by Stash.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StashGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StashGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StashGroupByArgs['orderBy'] }
        : { orderBy?: StashGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StashGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStashGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Stash model
   */
  readonly fields: StashFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Stash.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__StashClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    Subject<T extends Stash$SubjectArgs<ExtArgs> = {}>(args?: Subset<T, Stash$SubjectArgs<ExtArgs>>): Prisma__SubjectClient<$Types.GetResult<SubjectPayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    Substance<T extends SubstanceArgs<ExtArgs> = {}>(args?: Subset<T, SubstanceArgs<ExtArgs>>): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    ingestions<T extends Stash$ingestionsArgs<ExtArgs> = {}>(args?: Subset<T, Stash$ingestionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<IngestionPayload<ExtArgs>, T, 'findMany'>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the Stash model
   */ 
  interface StashFieldRefs {
    readonly id: FieldRef<"Stash", 'String'>
    readonly owner_id: FieldRef<"Stash", 'String'>
    readonly substance_id: FieldRef<"Stash", 'String'>
    readonly addedDate: FieldRef<"Stash", 'DateTime'>
    readonly expiration: FieldRef<"Stash", 'DateTime'>
    readonly amount: FieldRef<"Stash", 'Int'>
    readonly price: FieldRef<"Stash", 'String'>
    readonly vendor: FieldRef<"Stash", 'String'>
    readonly description: FieldRef<"Stash", 'String'>
    readonly purity: FieldRef<"Stash", 'Int'>
  }
    

  // Custom InputTypes

  /**
   * Stash findUnique
   */
  export type StashFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * Filter, which Stash to fetch.
     */
    where: StashWhereUniqueInput
  }


  /**
   * Stash findUniqueOrThrow
   */
  export type StashFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * Filter, which Stash to fetch.
     */
    where: StashWhereUniqueInput
  }


  /**
   * Stash findFirst
   */
  export type StashFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * Filter, which Stash to fetch.
     */
    where?: StashWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stashes to fetch.
     */
    orderBy?: StashOrderByWithRelationInput | StashOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stashes.
     */
    cursor?: StashWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stashes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stashes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stashes.
     */
    distinct?: StashScalarFieldEnum | StashScalarFieldEnum[]
  }


  /**
   * Stash findFirstOrThrow
   */
  export type StashFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * Filter, which Stash to fetch.
     */
    where?: StashWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stashes to fetch.
     */
    orderBy?: StashOrderByWithRelationInput | StashOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stashes.
     */
    cursor?: StashWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stashes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stashes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stashes.
     */
    distinct?: StashScalarFieldEnum | StashScalarFieldEnum[]
  }


  /**
   * Stash findMany
   */
  export type StashFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * Filter, which Stashes to fetch.
     */
    where?: StashWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stashes to fetch.
     */
    orderBy?: StashOrderByWithRelationInput | StashOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Stashes.
     */
    cursor?: StashWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stashes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stashes.
     */
    skip?: number
    distinct?: StashScalarFieldEnum | StashScalarFieldEnum[]
  }


  /**
   * Stash create
   */
  export type StashCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * The data needed to create a Stash.
     */
    data: XOR<StashCreateInput, StashUncheckedCreateInput>
  }


  /**
   * Stash update
   */
  export type StashUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * The data needed to update a Stash.
     */
    data: XOR<StashUpdateInput, StashUncheckedUpdateInput>
    /**
     * Choose, which Stash to update.
     */
    where: StashWhereUniqueInput
  }


  /**
   * Stash updateMany
   */
  export type StashUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Stashes.
     */
    data: XOR<StashUpdateManyMutationInput, StashUncheckedUpdateManyInput>
    /**
     * Filter which Stashes to update
     */
    where?: StashWhereInput
  }


  /**
   * Stash upsert
   */
  export type StashUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * The filter to search for the Stash to update in case it exists.
     */
    where: StashWhereUniqueInput
    /**
     * In case the Stash found by the `where` argument doesn't exist, create a new Stash with this data.
     */
    create: XOR<StashCreateInput, StashUncheckedCreateInput>
    /**
     * In case the Stash was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StashUpdateInput, StashUncheckedUpdateInput>
  }


  /**
   * Stash delete
   */
  export type StashDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
    /**
     * Filter which Stash to delete.
     */
    where: StashWhereUniqueInput
  }


  /**
   * Stash deleteMany
   */
  export type StashDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stashes to delete
     */
    where?: StashWhereInput
  }


  /**
   * Stash.Subject
   */
  export type Stash$SubjectArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubjectInclude<ExtArgs> | null
    where?: SubjectWhereInput
  }


  /**
   * Stash.ingestions
   */
  export type Stash$ingestionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingestion
     */
    select?: IngestionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: IngestionInclude<ExtArgs> | null
    where?: IngestionWhereInput
    orderBy?: IngestionOrderByWithRelationInput | IngestionOrderByWithRelationInput[]
    cursor?: IngestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IngestionScalarFieldEnum | IngestionScalarFieldEnum[]
  }


  /**
   * Stash without action
   */
  export type StashArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stash
     */
    select?: StashSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: StashInclude<ExtArgs> | null
  }



  /**
   * Model SubstanceInteraction
   */


  export type AggregateSubstanceInteraction = {
    _count: SubstanceInteractionCountAggregateOutputType | null
    _min: SubstanceInteractionMinAggregateOutputType | null
    _max: SubstanceInteractionMaxAggregateOutputType | null
  }

  export type SubstanceInteractionMinAggregateOutputType = {
    id: string | null
    substanceId: string | null
  }

  export type SubstanceInteractionMaxAggregateOutputType = {
    id: string | null
    substanceId: string | null
  }

  export type SubstanceInteractionCountAggregateOutputType = {
    id: number
    substanceId: number
    _all: number
  }


  export type SubstanceInteractionMinAggregateInputType = {
    id?: true
    substanceId?: true
  }

  export type SubstanceInteractionMaxAggregateInputType = {
    id?: true
    substanceId?: true
  }

  export type SubstanceInteractionCountAggregateInputType = {
    id?: true
    substanceId?: true
    _all?: true
  }

  export type SubstanceInteractionAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubstanceInteraction to aggregate.
     */
    where?: SubstanceInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubstanceInteractions to fetch.
     */
    orderBy?: SubstanceInteractionOrderByWithRelationInput | SubstanceInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubstanceInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubstanceInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubstanceInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubstanceInteractions
    **/
    _count?: true | SubstanceInteractionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubstanceInteractionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubstanceInteractionMaxAggregateInputType
  }

  export type GetSubstanceInteractionAggregateType<T extends SubstanceInteractionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubstanceInteraction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubstanceInteraction[P]>
      : GetScalarType<T[P], AggregateSubstanceInteraction[P]>
  }




  export type SubstanceInteractionGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: SubstanceInteractionWhereInput
    orderBy?: SubstanceInteractionOrderByWithAggregationInput | SubstanceInteractionOrderByWithAggregationInput[]
    by: SubstanceInteractionScalarFieldEnum[] | SubstanceInteractionScalarFieldEnum
    having?: SubstanceInteractionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubstanceInteractionCountAggregateInputType | true
    _min?: SubstanceInteractionMinAggregateInputType
    _max?: SubstanceInteractionMaxAggregateInputType
  }


  export type SubstanceInteractionGroupByOutputType = {
    id: string
    substanceId: string | null
    _count: SubstanceInteractionCountAggregateOutputType | null
    _min: SubstanceInteractionMinAggregateOutputType | null
    _max: SubstanceInteractionMaxAggregateOutputType | null
  }

  type GetSubstanceInteractionGroupByPayload<T extends SubstanceInteractionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubstanceInteractionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubstanceInteractionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubstanceInteractionGroupByOutputType[P]>
            : GetScalarType<T[P], SubstanceInteractionGroupByOutputType[P]>
        }
      >
    >


  export type SubstanceInteractionSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    substanceId?: boolean
    Substance?: boolean | SubstanceInteraction$SubstanceArgs<ExtArgs>
  }, ExtArgs["result"]["substanceInteraction"]>

  export type SubstanceInteractionSelectScalar = {
    id?: boolean
    substanceId?: boolean
  }

  export type SubstanceInteractionInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    Substance?: boolean | SubstanceInteraction$SubstanceArgs<ExtArgs>
  }


  type SubstanceInteractionGetPayload<S extends boolean | null | undefined | SubstanceInteractionArgs> = $Types.GetResult<SubstanceInteractionPayload, S>

  type SubstanceInteractionCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<SubstanceInteractionFindManyArgs, 'select' | 'include'> & {
      select?: SubstanceInteractionCountAggregateInputType | true
    }

  export interface SubstanceInteractionDelegate<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubstanceInteraction'], meta: { name: 'SubstanceInteraction' } }
    /**
     * Find zero or one SubstanceInteraction that matches the filter.
     * @param {SubstanceInteractionFindUniqueArgs} args - Arguments to find a SubstanceInteraction
     * @example
     * // Get one SubstanceInteraction
     * const substanceInteraction = await prisma.substanceInteraction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SubstanceInteractionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceInteractionFindUniqueArgs<ExtArgs>>
    ): Prisma__SubstanceInteractionClient<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one SubstanceInteraction that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SubstanceInteractionFindUniqueOrThrowArgs} args - Arguments to find a SubstanceInteraction
     * @example
     * // Get one SubstanceInteraction
     * const substanceInteraction = await prisma.substanceInteraction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SubstanceInteractionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceInteractionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SubstanceInteractionClient<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first SubstanceInteraction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceInteractionFindFirstArgs} args - Arguments to find a SubstanceInteraction
     * @example
     * // Get one SubstanceInteraction
     * const substanceInteraction = await prisma.substanceInteraction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SubstanceInteractionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceInteractionFindFirstArgs<ExtArgs>>
    ): Prisma__SubstanceInteractionClient<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first SubstanceInteraction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceInteractionFindFirstOrThrowArgs} args - Arguments to find a SubstanceInteraction
     * @example
     * // Get one SubstanceInteraction
     * const substanceInteraction = await prisma.substanceInteraction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SubstanceInteractionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceInteractionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SubstanceInteractionClient<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more SubstanceInteractions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceInteractionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubstanceInteractions
     * const substanceInteractions = await prisma.substanceInteraction.findMany()
     * 
     * // Get first 10 SubstanceInteractions
     * const substanceInteractions = await prisma.substanceInteraction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const substanceInteractionWithIdOnly = await prisma.substanceInteraction.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SubstanceInteractionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceInteractionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a SubstanceInteraction.
     * @param {SubstanceInteractionCreateArgs} args - Arguments to create a SubstanceInteraction.
     * @example
     * // Create one SubstanceInteraction
     * const SubstanceInteraction = await prisma.substanceInteraction.create({
     *   data: {
     *     // ... data to create a SubstanceInteraction
     *   }
     * })
     * 
    **/
    create<T extends SubstanceInteractionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceInteractionCreateArgs<ExtArgs>>
    ): Prisma__SubstanceInteractionClient<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Delete a SubstanceInteraction.
     * @param {SubstanceInteractionDeleteArgs} args - Arguments to delete one SubstanceInteraction.
     * @example
     * // Delete one SubstanceInteraction
     * const SubstanceInteraction = await prisma.substanceInteraction.delete({
     *   where: {
     *     // ... filter to delete one SubstanceInteraction
     *   }
     * })
     * 
    **/
    delete<T extends SubstanceInteractionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceInteractionDeleteArgs<ExtArgs>>
    ): Prisma__SubstanceInteractionClient<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one SubstanceInteraction.
     * @param {SubstanceInteractionUpdateArgs} args - Arguments to update one SubstanceInteraction.
     * @example
     * // Update one SubstanceInteraction
     * const substanceInteraction = await prisma.substanceInteraction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SubstanceInteractionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceInteractionUpdateArgs<ExtArgs>>
    ): Prisma__SubstanceInteractionClient<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more SubstanceInteractions.
     * @param {SubstanceInteractionDeleteManyArgs} args - Arguments to filter SubstanceInteractions to delete.
     * @example
     * // Delete a few SubstanceInteractions
     * const { count } = await prisma.substanceInteraction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SubstanceInteractionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubstanceInteractionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubstanceInteractions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceInteractionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubstanceInteractions
     * const substanceInteraction = await prisma.substanceInteraction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SubstanceInteractionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceInteractionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SubstanceInteraction.
     * @param {SubstanceInteractionUpsertArgs} args - Arguments to update or create a SubstanceInteraction.
     * @example
     * // Update or create a SubstanceInteraction
     * const substanceInteraction = await prisma.substanceInteraction.upsert({
     *   create: {
     *     // ... data to create a SubstanceInteraction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubstanceInteraction we want to update
     *   }
     * })
    **/
    upsert<T extends SubstanceInteractionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SubstanceInteractionUpsertArgs<ExtArgs>>
    ): Prisma__SubstanceInteractionClient<$Types.GetResult<SubstanceInteractionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of SubstanceInteractions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceInteractionCountArgs} args - Arguments to filter SubstanceInteractions to count.
     * @example
     * // Count the number of SubstanceInteractions
     * const count = await prisma.substanceInteraction.count({
     *   where: {
     *     // ... the filter for the SubstanceInteractions we want to count
     *   }
     * })
    **/
    count<T extends SubstanceInteractionCountArgs>(
      args?: Subset<T, SubstanceInteractionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubstanceInteractionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubstanceInteraction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceInteractionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubstanceInteractionAggregateArgs>(args: Subset<T, SubstanceInteractionAggregateArgs>): Prisma.PrismaPromise<GetSubstanceInteractionAggregateType<T>>

    /**
     * Group by SubstanceInteraction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubstanceInteractionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubstanceInteractionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubstanceInteractionGroupByArgs['orderBy'] }
        : { orderBy?: SubstanceInteractionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubstanceInteractionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubstanceInteractionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubstanceInteraction model
   */
  readonly fields: SubstanceInteractionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubstanceInteraction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SubstanceInteractionClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    Substance<T extends SubstanceInteraction$SubstanceArgs<ExtArgs> = {}>(args?: Subset<T, SubstanceInteraction$SubstanceArgs<ExtArgs>>): Prisma__SubstanceClient<$Types.GetResult<SubstancePayload<ExtArgs>, T, 'findUnique'> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  /**
   * Fields of the SubstanceInteraction model
   */ 
  interface SubstanceInteractionFieldRefs {
    readonly id: FieldRef<"SubstanceInteraction", 'String'>
    readonly substanceId: FieldRef<"SubstanceInteraction", 'String'>
  }
    

  // Custom InputTypes

  /**
   * SubstanceInteraction findUnique
   */
  export type SubstanceInteractionFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * Filter, which SubstanceInteraction to fetch.
     */
    where: SubstanceInteractionWhereUniqueInput
  }


  /**
   * SubstanceInteraction findUniqueOrThrow
   */
  export type SubstanceInteractionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * Filter, which SubstanceInteraction to fetch.
     */
    where: SubstanceInteractionWhereUniqueInput
  }


  /**
   * SubstanceInteraction findFirst
   */
  export type SubstanceInteractionFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * Filter, which SubstanceInteraction to fetch.
     */
    where?: SubstanceInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubstanceInteractions to fetch.
     */
    orderBy?: SubstanceInteractionOrderByWithRelationInput | SubstanceInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubstanceInteractions.
     */
    cursor?: SubstanceInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubstanceInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubstanceInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubstanceInteractions.
     */
    distinct?: SubstanceInteractionScalarFieldEnum | SubstanceInteractionScalarFieldEnum[]
  }


  /**
   * SubstanceInteraction findFirstOrThrow
   */
  export type SubstanceInteractionFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * Filter, which SubstanceInteraction to fetch.
     */
    where?: SubstanceInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubstanceInteractions to fetch.
     */
    orderBy?: SubstanceInteractionOrderByWithRelationInput | SubstanceInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubstanceInteractions.
     */
    cursor?: SubstanceInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubstanceInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubstanceInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubstanceInteractions.
     */
    distinct?: SubstanceInteractionScalarFieldEnum | SubstanceInteractionScalarFieldEnum[]
  }


  /**
   * SubstanceInteraction findMany
   */
  export type SubstanceInteractionFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * Filter, which SubstanceInteractions to fetch.
     */
    where?: SubstanceInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubstanceInteractions to fetch.
     */
    orderBy?: SubstanceInteractionOrderByWithRelationInput | SubstanceInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubstanceInteractions.
     */
    cursor?: SubstanceInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubstanceInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubstanceInteractions.
     */
    skip?: number
    distinct?: SubstanceInteractionScalarFieldEnum | SubstanceInteractionScalarFieldEnum[]
  }


  /**
   * SubstanceInteraction create
   */
  export type SubstanceInteractionCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * The data needed to create a SubstanceInteraction.
     */
    data?: XOR<SubstanceInteractionCreateInput, SubstanceInteractionUncheckedCreateInput>
  }


  /**
   * SubstanceInteraction update
   */
  export type SubstanceInteractionUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * The data needed to update a SubstanceInteraction.
     */
    data: XOR<SubstanceInteractionUpdateInput, SubstanceInteractionUncheckedUpdateInput>
    /**
     * Choose, which SubstanceInteraction to update.
     */
    where: SubstanceInteractionWhereUniqueInput
  }


  /**
   * SubstanceInteraction updateMany
   */
  export type SubstanceInteractionUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubstanceInteractions.
     */
    data: XOR<SubstanceInteractionUpdateManyMutationInput, SubstanceInteractionUncheckedUpdateManyInput>
    /**
     * Filter which SubstanceInteractions to update
     */
    where?: SubstanceInteractionWhereInput
  }


  /**
   * SubstanceInteraction upsert
   */
  export type SubstanceInteractionUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * The filter to search for the SubstanceInteraction to update in case it exists.
     */
    where: SubstanceInteractionWhereUniqueInput
    /**
     * In case the SubstanceInteraction found by the `where` argument doesn't exist, create a new SubstanceInteraction with this data.
     */
    create: XOR<SubstanceInteractionCreateInput, SubstanceInteractionUncheckedCreateInput>
    /**
     * In case the SubstanceInteraction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubstanceInteractionUpdateInput, SubstanceInteractionUncheckedUpdateInput>
  }


  /**
   * SubstanceInteraction delete
   */
  export type SubstanceInteractionDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
    /**
     * Filter which SubstanceInteraction to delete.
     */
    where: SubstanceInteractionWhereUniqueInput
  }


  /**
   * SubstanceInteraction deleteMany
   */
  export type SubstanceInteractionDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubstanceInteractions to delete
     */
    where?: SubstanceInteractionWhereInput
  }


  /**
   * SubstanceInteraction.Substance
   */
  export type SubstanceInteraction$SubstanceArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Substance
     */
    select?: SubstanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInclude<ExtArgs> | null
    where?: SubstanceWhereInput
  }


  /**
   * SubstanceInteraction without action
   */
  export type SubstanceInteractionArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubstanceInteraction
     */
    select?: SubstanceInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: SubstanceInteractionInclude<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SubjectScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    dateOfBirth: 'dateOfBirth',
    weight: 'weight',
    height: 'height',
    account_id: 'account_id'
  };

  export type SubjectScalarFieldEnum = (typeof SubjectScalarFieldEnum)[keyof typeof SubjectScalarFieldEnum]


  export const SubstanceScalarFieldEnum: {
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

  export type SubstanceScalarFieldEnum = (typeof SubstanceScalarFieldEnum)[keyof typeof SubstanceScalarFieldEnum]


  export const RouteOfAdministrationScalarFieldEnum: {
    id: 'id',
    substanceName: 'substanceName',
    name: 'name',
    bioavailability: 'bioavailability'
  };

  export type RouteOfAdministrationScalarFieldEnum = (typeof RouteOfAdministrationScalarFieldEnum)[keyof typeof RouteOfAdministrationScalarFieldEnum]


  export const PhaseScalarFieldEnum: {
    id: 'id',
    from: 'from',
    to: 'to',
    routeOfAdministrationId: 'routeOfAdministrationId'
  };

  export type PhaseScalarFieldEnum = (typeof PhaseScalarFieldEnum)[keyof typeof PhaseScalarFieldEnum]


  export const DosageScalarFieldEnum: {
    id: 'id',
    intensivity: 'intensivity',
    amount_min: 'amount_min',
    amount_max: 'amount_max',
    unit: 'unit',
    perKilogram: 'perKilogram',
    routeOfAdministrationId: 'routeOfAdministrationId'
  };

  export type DosageScalarFieldEnum = (typeof DosageScalarFieldEnum)[keyof typeof DosageScalarFieldEnum]


  export const EffectScalarFieldEnum: {
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

  export type EffectScalarFieldEnum = (typeof EffectScalarFieldEnum)[keyof typeof EffectScalarFieldEnum]


  export const IngestionScalarFieldEnum: {
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

  export type IngestionScalarFieldEnum = (typeof IngestionScalarFieldEnum)[keyof typeof IngestionScalarFieldEnum]


  export const StashScalarFieldEnum: {
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

  export type StashScalarFieldEnum = (typeof StashScalarFieldEnum)[keyof typeof StashScalarFieldEnum]


  export const SubstanceInteractionScalarFieldEnum: {
    id: 'id',
    substanceId: 'substanceId'
  };

  export type SubstanceInteractionScalarFieldEnum = (typeof SubstanceInteractionScalarFieldEnum)[keyof typeof SubstanceInteractionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    username?: StringFilter<"Account"> | string
    password?: StringFilter<"Account"> | string
    Subject?: SubjectListRelationFilter
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    Subject?: SubjectOrderByRelationAggregateInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    password?: StringFilter<"Account"> | string
    Subject?: SubjectListRelationFilter
  }, "id" | "username">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    username?: StringWithAggregatesFilter<"Account"> | string
    password?: StringWithAggregatesFilter<"Account"> | string
  }

  export type SubjectWhereInput = {
    AND?: SubjectWhereInput | SubjectWhereInput[]
    OR?: SubjectWhereInput[]
    NOT?: SubjectWhereInput | SubjectWhereInput[]
    id?: StringFilter<"Subject"> | string
    firstName?: StringNullableFilter<"Subject"> | string | null
    lastName?: StringNullableFilter<"Subject"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"Subject"> | Date | string | null
    weight?: IntNullableFilter<"Subject"> | number | null
    height?: IntNullableFilter<"Subject"> | number | null
    account_id?: StringNullableFilter<"Subject"> | string | null
    account?: XOR<AccountNullableRelationFilter, AccountWhereInput> | null
    Ingestions?: IngestionListRelationFilter
    Stash?: StashListRelationFilter
  }

  export type SubjectOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    account_id?: SortOrderInput | SortOrder
    account?: AccountOrderByWithRelationInput
    Ingestions?: IngestionOrderByRelationAggregateInput
    Stash?: StashOrderByRelationAggregateInput
  }

  export type SubjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    account_id?: string
    AND?: SubjectWhereInput | SubjectWhereInput[]
    OR?: SubjectWhereInput[]
    NOT?: SubjectWhereInput | SubjectWhereInput[]
    firstName?: StringNullableFilter<"Subject"> | string | null
    lastName?: StringNullableFilter<"Subject"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"Subject"> | Date | string | null
    weight?: IntNullableFilter<"Subject"> | number | null
    height?: IntNullableFilter<"Subject"> | number | null
    account?: XOR<AccountNullableRelationFilter, AccountWhereInput> | null
    Ingestions?: IngestionListRelationFilter
    Stash?: StashListRelationFilter
  }, "id" | "account_id">

  export type SubjectOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    account_id?: SortOrderInput | SortOrder
    _count?: SubjectCountOrderByAggregateInput
    _avg?: SubjectAvgOrderByAggregateInput
    _max?: SubjectMaxOrderByAggregateInput
    _min?: SubjectMinOrderByAggregateInput
    _sum?: SubjectSumOrderByAggregateInput
  }

  export type SubjectScalarWhereWithAggregatesInput = {
    AND?: SubjectScalarWhereWithAggregatesInput | SubjectScalarWhereWithAggregatesInput[]
    OR?: SubjectScalarWhereWithAggregatesInput[]
    NOT?: SubjectScalarWhereWithAggregatesInput | SubjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subject"> | string
    firstName?: StringNullableWithAggregatesFilter<"Subject"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"Subject"> | string | null
    dateOfBirth?: DateTimeNullableWithAggregatesFilter<"Subject"> | Date | string | null
    weight?: IntNullableWithAggregatesFilter<"Subject"> | number | null
    height?: IntNullableWithAggregatesFilter<"Subject"> | number | null
    account_id?: StringNullableWithAggregatesFilter<"Subject"> | string | null
  }

  export type SubstanceWhereInput = {
    AND?: SubstanceWhereInput | SubstanceWhereInput[]
    OR?: SubstanceWhereInput[]
    NOT?: SubstanceWhereInput | SubstanceWhereInput[]
    id?: StringFilter<"Substance"> | string
    name?: StringFilter<"Substance"> | string
    common_names?: StringFilter<"Substance"> | string
    brand_names?: StringFilter<"Substance"> | string
    substitutive_name?: StringNullableFilter<"Substance"> | string | null
    systematic_name?: StringNullableFilter<"Substance"> | string | null
    unii?: StringNullableFilter<"Substance"> | string | null
    cas_number?: StringNullableFilter<"Substance"> | string | null
    inchi_key?: StringNullableFilter<"Substance"> | string | null
    iupac?: StringNullableFilter<"Substance"> | string | null
    smiles?: StringNullableFilter<"Substance"> | string | null
    psychoactive_class?: StringFilter<"Substance"> | string
    chemical_class?: StringNullableFilter<"Substance"> | string | null
    description?: StringNullableFilter<"Substance"> | string | null
    routes_of_administration?: RouteOfAdministrationListRelationFilter
    Ingestion?: IngestionListRelationFilter
    Stash?: StashListRelationFilter
    SubstanceInteraction?: SubstanceInteractionListRelationFilter
  }

  export type SubstanceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    common_names?: SortOrder
    brand_names?: SortOrder
    substitutive_name?: SortOrderInput | SortOrder
    systematic_name?: SortOrderInput | SortOrder
    unii?: SortOrderInput | SortOrder
    cas_number?: SortOrderInput | SortOrder
    inchi_key?: SortOrderInput | SortOrder
    iupac?: SortOrderInput | SortOrder
    smiles?: SortOrderInput | SortOrder
    psychoactive_class?: SortOrder
    chemical_class?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    routes_of_administration?: RouteOfAdministrationOrderByRelationAggregateInput
    Ingestion?: IngestionOrderByRelationAggregateInput
    Stash?: StashOrderByRelationAggregateInput
    SubstanceInteraction?: SubstanceInteractionOrderByRelationAggregateInput
  }

  export type SubstanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    substitutive_name?: string
    systematic_name?: string
    cas_number?: string
    AND?: SubstanceWhereInput | SubstanceWhereInput[]
    OR?: SubstanceWhereInput[]
    NOT?: SubstanceWhereInput | SubstanceWhereInput[]
    common_names?: StringFilter<"Substance"> | string
    brand_names?: StringFilter<"Substance"> | string
    unii?: StringNullableFilter<"Substance"> | string | null
    inchi_key?: StringNullableFilter<"Substance"> | string | null
    iupac?: StringNullableFilter<"Substance"> | string | null
    smiles?: StringNullableFilter<"Substance"> | string | null
    psychoactive_class?: StringFilter<"Substance"> | string
    chemical_class?: StringNullableFilter<"Substance"> | string | null
    description?: StringNullableFilter<"Substance"> | string | null
    routes_of_administration?: RouteOfAdministrationListRelationFilter
    Ingestion?: IngestionListRelationFilter
    Stash?: StashListRelationFilter
    SubstanceInteraction?: SubstanceInteractionListRelationFilter
  }, "id" | "name" | "substitutive_name" | "systematic_name" | "cas_number">

  export type SubstanceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    common_names?: SortOrder
    brand_names?: SortOrder
    substitutive_name?: SortOrderInput | SortOrder
    systematic_name?: SortOrderInput | SortOrder
    unii?: SortOrderInput | SortOrder
    cas_number?: SortOrderInput | SortOrder
    inchi_key?: SortOrderInput | SortOrder
    iupac?: SortOrderInput | SortOrder
    smiles?: SortOrderInput | SortOrder
    psychoactive_class?: SortOrder
    chemical_class?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    _count?: SubstanceCountOrderByAggregateInput
    _max?: SubstanceMaxOrderByAggregateInput
    _min?: SubstanceMinOrderByAggregateInput
  }

  export type SubstanceScalarWhereWithAggregatesInput = {
    AND?: SubstanceScalarWhereWithAggregatesInput | SubstanceScalarWhereWithAggregatesInput[]
    OR?: SubstanceScalarWhereWithAggregatesInput[]
    NOT?: SubstanceScalarWhereWithAggregatesInput | SubstanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Substance"> | string
    name?: StringWithAggregatesFilter<"Substance"> | string
    common_names?: StringWithAggregatesFilter<"Substance"> | string
    brand_names?: StringWithAggregatesFilter<"Substance"> | string
    substitutive_name?: StringNullableWithAggregatesFilter<"Substance"> | string | null
    systematic_name?: StringNullableWithAggregatesFilter<"Substance"> | string | null
    unii?: StringNullableWithAggregatesFilter<"Substance"> | string | null
    cas_number?: StringNullableWithAggregatesFilter<"Substance"> | string | null
    inchi_key?: StringNullableWithAggregatesFilter<"Substance"> | string | null
    iupac?: StringNullableWithAggregatesFilter<"Substance"> | string | null
    smiles?: StringNullableWithAggregatesFilter<"Substance"> | string | null
    psychoactive_class?: StringWithAggregatesFilter<"Substance"> | string
    chemical_class?: StringNullableWithAggregatesFilter<"Substance"> | string | null
    description?: StringNullableWithAggregatesFilter<"Substance"> | string | null
  }

  export type RouteOfAdministrationWhereInput = {
    AND?: RouteOfAdministrationWhereInput | RouteOfAdministrationWhereInput[]
    OR?: RouteOfAdministrationWhereInput[]
    NOT?: RouteOfAdministrationWhereInput | RouteOfAdministrationWhereInput[]
    id?: StringFilter<"RouteOfAdministration"> | string
    substanceName?: StringNullableFilter<"RouteOfAdministration"> | string | null
    name?: StringFilter<"RouteOfAdministration"> | string
    bioavailability?: FloatFilter<"RouteOfAdministration"> | number
    dosage?: DosageListRelationFilter
    phases?: PhaseListRelationFilter
    Substance?: XOR<SubstanceNullableRelationFilter, SubstanceWhereInput> | null
  }

  export type RouteOfAdministrationOrderByWithRelationInput = {
    id?: SortOrder
    substanceName?: SortOrderInput | SortOrder
    name?: SortOrder
    bioavailability?: SortOrder
    dosage?: DosageOrderByRelationAggregateInput
    phases?: PhaseOrderByRelationAggregateInput
    Substance?: SubstanceOrderByWithRelationInput
  }

  export type RouteOfAdministrationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name_substanceName?: RouteOfAdministrationNameSubstanceNameCompoundUniqueInput
    AND?: RouteOfAdministrationWhereInput | RouteOfAdministrationWhereInput[]
    OR?: RouteOfAdministrationWhereInput[]
    NOT?: RouteOfAdministrationWhereInput | RouteOfAdministrationWhereInput[]
    substanceName?: StringNullableFilter<"RouteOfAdministration"> | string | null
    name?: StringFilter<"RouteOfAdministration"> | string
    bioavailability?: FloatFilter<"RouteOfAdministration"> | number
    dosage?: DosageListRelationFilter
    phases?: PhaseListRelationFilter
    Substance?: XOR<SubstanceNullableRelationFilter, SubstanceWhereInput> | null
  }, "id" | "name_substanceName">

  export type RouteOfAdministrationOrderByWithAggregationInput = {
    id?: SortOrder
    substanceName?: SortOrderInput | SortOrder
    name?: SortOrder
    bioavailability?: SortOrder
    _count?: RouteOfAdministrationCountOrderByAggregateInput
    _avg?: RouteOfAdministrationAvgOrderByAggregateInput
    _max?: RouteOfAdministrationMaxOrderByAggregateInput
    _min?: RouteOfAdministrationMinOrderByAggregateInput
    _sum?: RouteOfAdministrationSumOrderByAggregateInput
  }

  export type RouteOfAdministrationScalarWhereWithAggregatesInput = {
    AND?: RouteOfAdministrationScalarWhereWithAggregatesInput | RouteOfAdministrationScalarWhereWithAggregatesInput[]
    OR?: RouteOfAdministrationScalarWhereWithAggregatesInput[]
    NOT?: RouteOfAdministrationScalarWhereWithAggregatesInput | RouteOfAdministrationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RouteOfAdministration"> | string
    substanceName?: StringNullableWithAggregatesFilter<"RouteOfAdministration"> | string | null
    name?: StringWithAggregatesFilter<"RouteOfAdministration"> | string
    bioavailability?: FloatWithAggregatesFilter<"RouteOfAdministration"> | number
  }

  export type PhaseWhereInput = {
    AND?: PhaseWhereInput | PhaseWhereInput[]
    OR?: PhaseWhereInput[]
    NOT?: PhaseWhereInput | PhaseWhereInput[]
    id?: StringFilter<"Phase"> | string
    from?: IntNullableFilter<"Phase"> | number | null
    to?: IntNullableFilter<"Phase"> | number | null
    routeOfAdministrationId?: StringNullableFilter<"Phase"> | string | null
    RouteOfAdministration?: XOR<RouteOfAdministrationNullableRelationFilter, RouteOfAdministrationWhereInput> | null
    effects?: EffectListRelationFilter
  }

  export type PhaseOrderByWithRelationInput = {
    id?: SortOrder
    from?: SortOrderInput | SortOrder
    to?: SortOrderInput | SortOrder
    routeOfAdministrationId?: SortOrderInput | SortOrder
    RouteOfAdministration?: RouteOfAdministrationOrderByWithRelationInput
    effects?: EffectOrderByRelationAggregateInput
  }

  export type PhaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PhaseWhereInput | PhaseWhereInput[]
    OR?: PhaseWhereInput[]
    NOT?: PhaseWhereInput | PhaseWhereInput[]
    from?: IntNullableFilter<"Phase"> | number | null
    to?: IntNullableFilter<"Phase"> | number | null
    routeOfAdministrationId?: StringNullableFilter<"Phase"> | string | null
    RouteOfAdministration?: XOR<RouteOfAdministrationNullableRelationFilter, RouteOfAdministrationWhereInput> | null
    effects?: EffectListRelationFilter
  }, "id">

  export type PhaseOrderByWithAggregationInput = {
    id?: SortOrder
    from?: SortOrderInput | SortOrder
    to?: SortOrderInput | SortOrder
    routeOfAdministrationId?: SortOrderInput | SortOrder
    _count?: PhaseCountOrderByAggregateInput
    _avg?: PhaseAvgOrderByAggregateInput
    _max?: PhaseMaxOrderByAggregateInput
    _min?: PhaseMinOrderByAggregateInput
    _sum?: PhaseSumOrderByAggregateInput
  }

  export type PhaseScalarWhereWithAggregatesInput = {
    AND?: PhaseScalarWhereWithAggregatesInput | PhaseScalarWhereWithAggregatesInput[]
    OR?: PhaseScalarWhereWithAggregatesInput[]
    NOT?: PhaseScalarWhereWithAggregatesInput | PhaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Phase"> | string
    from?: IntNullableWithAggregatesFilter<"Phase"> | number | null
    to?: IntNullableWithAggregatesFilter<"Phase"> | number | null
    routeOfAdministrationId?: StringNullableWithAggregatesFilter<"Phase"> | string | null
  }

  export type DosageWhereInput = {
    AND?: DosageWhereInput | DosageWhereInput[]
    OR?: DosageWhereInput[]
    NOT?: DosageWhereInput | DosageWhereInput[]
    id?: StringFilter<"Dosage"> | string
    intensivity?: StringFilter<"Dosage"> | string
    amount_min?: FloatFilter<"Dosage"> | number
    amount_max?: FloatFilter<"Dosage"> | number
    unit?: StringFilter<"Dosage"> | string
    perKilogram?: BoolFilter<"Dosage"> | boolean
    routeOfAdministrationId?: StringNullableFilter<"Dosage"> | string | null
    RouteOfAdministration?: XOR<RouteOfAdministrationNullableRelationFilter, RouteOfAdministrationWhereInput> | null
  }

  export type DosageOrderByWithRelationInput = {
    id?: SortOrder
    intensivity?: SortOrder
    amount_min?: SortOrder
    amount_max?: SortOrder
    unit?: SortOrder
    perKilogram?: SortOrder
    routeOfAdministrationId?: SortOrderInput | SortOrder
    RouteOfAdministration?: RouteOfAdministrationOrderByWithRelationInput
  }

  export type DosageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    intensivity_routeOfAdministrationId?: DosageIntensivityRouteOfAdministrationIdCompoundUniqueInput
    AND?: DosageWhereInput | DosageWhereInput[]
    OR?: DosageWhereInput[]
    NOT?: DosageWhereInput | DosageWhereInput[]
    intensivity?: StringFilter<"Dosage"> | string
    amount_min?: FloatFilter<"Dosage"> | number
    amount_max?: FloatFilter<"Dosage"> | number
    unit?: StringFilter<"Dosage"> | string
    perKilogram?: BoolFilter<"Dosage"> | boolean
    routeOfAdministrationId?: StringNullableFilter<"Dosage"> | string | null
    RouteOfAdministration?: XOR<RouteOfAdministrationNullableRelationFilter, RouteOfAdministrationWhereInput> | null
  }, "id" | "intensivity_routeOfAdministrationId">

  export type DosageOrderByWithAggregationInput = {
    id?: SortOrder
    intensivity?: SortOrder
    amount_min?: SortOrder
    amount_max?: SortOrder
    unit?: SortOrder
    perKilogram?: SortOrder
    routeOfAdministrationId?: SortOrderInput | SortOrder
    _count?: DosageCountOrderByAggregateInput
    _avg?: DosageAvgOrderByAggregateInput
    _max?: DosageMaxOrderByAggregateInput
    _min?: DosageMinOrderByAggregateInput
    _sum?: DosageSumOrderByAggregateInput
  }

  export type DosageScalarWhereWithAggregatesInput = {
    AND?: DosageScalarWhereWithAggregatesInput | DosageScalarWhereWithAggregatesInput[]
    OR?: DosageScalarWhereWithAggregatesInput[]
    NOT?: DosageScalarWhereWithAggregatesInput | DosageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Dosage"> | string
    intensivity?: StringWithAggregatesFilter<"Dosage"> | string
    amount_min?: FloatWithAggregatesFilter<"Dosage"> | number
    amount_max?: FloatWithAggregatesFilter<"Dosage"> | number
    unit?: StringWithAggregatesFilter<"Dosage"> | string
    perKilogram?: BoolWithAggregatesFilter<"Dosage"> | boolean
    routeOfAdministrationId?: StringNullableWithAggregatesFilter<"Dosage"> | string | null
  }

  export type EffectWhereInput = {
    AND?: EffectWhereInput | EffectWhereInput[]
    OR?: EffectWhereInput[]
    NOT?: EffectWhereInput | EffectWhereInput[]
    id?: StringFilter<"Effect"> | string
    name?: StringFilter<"Effect"> | string
    slug?: StringFilter<"Effect"> | string
    category?: StringNullableFilter<"Effect"> | string | null
    type?: StringNullableFilter<"Effect"> | string | null
    tags?: StringFilter<"Effect"> | string
    summary?: StringNullableFilter<"Effect"> | string | null
    description?: StringFilter<"Effect"> | string
    parameters?: StringFilter<"Effect"> | string
    see_also?: StringFilter<"Effect"> | string
    effectindex?: StringNullableFilter<"Effect"> | string | null
    psychonautwiki?: StringNullableFilter<"Effect"> | string | null
    Phase?: PhaseListRelationFilter
  }

  export type EffectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    category?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    tags?: SortOrder
    summary?: SortOrderInput | SortOrder
    description?: SortOrder
    parameters?: SortOrder
    see_also?: SortOrder
    effectindex?: SortOrderInput | SortOrder
    psychonautwiki?: SortOrderInput | SortOrder
    Phase?: PhaseOrderByRelationAggregateInput
  }

  export type EffectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    slug?: string
    AND?: EffectWhereInput | EffectWhereInput[]
    OR?: EffectWhereInput[]
    NOT?: EffectWhereInput | EffectWhereInput[]
    category?: StringNullableFilter<"Effect"> | string | null
    type?: StringNullableFilter<"Effect"> | string | null
    tags?: StringFilter<"Effect"> | string
    summary?: StringNullableFilter<"Effect"> | string | null
    description?: StringFilter<"Effect"> | string
    parameters?: StringFilter<"Effect"> | string
    see_also?: StringFilter<"Effect"> | string
    effectindex?: StringNullableFilter<"Effect"> | string | null
    psychonautwiki?: StringNullableFilter<"Effect"> | string | null
    Phase?: PhaseListRelationFilter
  }, "id" | "name" | "slug">

  export type EffectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    category?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    tags?: SortOrder
    summary?: SortOrderInput | SortOrder
    description?: SortOrder
    parameters?: SortOrder
    see_also?: SortOrder
    effectindex?: SortOrderInput | SortOrder
    psychonautwiki?: SortOrderInput | SortOrder
    _count?: EffectCountOrderByAggregateInput
    _max?: EffectMaxOrderByAggregateInput
    _min?: EffectMinOrderByAggregateInput
  }

  export type EffectScalarWhereWithAggregatesInput = {
    AND?: EffectScalarWhereWithAggregatesInput | EffectScalarWhereWithAggregatesInput[]
    OR?: EffectScalarWhereWithAggregatesInput[]
    NOT?: EffectScalarWhereWithAggregatesInput | EffectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Effect"> | string
    name?: StringWithAggregatesFilter<"Effect"> | string
    slug?: StringWithAggregatesFilter<"Effect"> | string
    category?: StringNullableWithAggregatesFilter<"Effect"> | string | null
    type?: StringNullableWithAggregatesFilter<"Effect"> | string | null
    tags?: StringWithAggregatesFilter<"Effect"> | string
    summary?: StringNullableWithAggregatesFilter<"Effect"> | string | null
    description?: StringWithAggregatesFilter<"Effect"> | string
    parameters?: StringWithAggregatesFilter<"Effect"> | string
    see_also?: StringWithAggregatesFilter<"Effect"> | string
    effectindex?: StringNullableWithAggregatesFilter<"Effect"> | string | null
    psychonautwiki?: StringNullableWithAggregatesFilter<"Effect"> | string | null
  }

  export type IngestionWhereInput = {
    AND?: IngestionWhereInput | IngestionWhereInput[]
    OR?: IngestionWhereInput[]
    NOT?: IngestionWhereInput | IngestionWhereInput[]
    id?: StringFilter<"Ingestion"> | string
    substanceName?: StringNullableFilter<"Ingestion"> | string | null
    routeOfAdministration?: StringNullableFilter<"Ingestion"> | string | null
    dosage_unit?: StringNullableFilter<"Ingestion"> | string | null
    dosage_amount?: IntNullableFilter<"Ingestion"> | number | null
    isEstimatedDosage?: BoolNullableFilter<"Ingestion"> | boolean | null
    date?: DateTimeNullableFilter<"Ingestion"> | Date | string | null
    subject_id?: StringNullableFilter<"Ingestion"> | string | null
    stashId?: StringNullableFilter<"Ingestion"> | string | null
    Subject?: XOR<SubjectNullableRelationFilter, SubjectWhereInput> | null
    Substance?: XOR<SubstanceNullableRelationFilter, SubstanceWhereInput> | null
    Stash?: XOR<StashNullableRelationFilter, StashWhereInput> | null
  }

  export type IngestionOrderByWithRelationInput = {
    id?: SortOrder
    substanceName?: SortOrderInput | SortOrder
    routeOfAdministration?: SortOrderInput | SortOrder
    dosage_unit?: SortOrderInput | SortOrder
    dosage_amount?: SortOrderInput | SortOrder
    isEstimatedDosage?: SortOrderInput | SortOrder
    date?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
    stashId?: SortOrderInput | SortOrder
    Subject?: SubjectOrderByWithRelationInput
    Substance?: SubstanceOrderByWithRelationInput
    Stash?: StashOrderByWithRelationInput
  }

  export type IngestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IngestionWhereInput | IngestionWhereInput[]
    OR?: IngestionWhereInput[]
    NOT?: IngestionWhereInput | IngestionWhereInput[]
    substanceName?: StringNullableFilter<"Ingestion"> | string | null
    routeOfAdministration?: StringNullableFilter<"Ingestion"> | string | null
    dosage_unit?: StringNullableFilter<"Ingestion"> | string | null
    dosage_amount?: IntNullableFilter<"Ingestion"> | number | null
    isEstimatedDosage?: BoolNullableFilter<"Ingestion"> | boolean | null
    date?: DateTimeNullableFilter<"Ingestion"> | Date | string | null
    subject_id?: StringNullableFilter<"Ingestion"> | string | null
    stashId?: StringNullableFilter<"Ingestion"> | string | null
    Subject?: XOR<SubjectNullableRelationFilter, SubjectWhereInput> | null
    Substance?: XOR<SubstanceNullableRelationFilter, SubstanceWhereInput> | null
    Stash?: XOR<StashNullableRelationFilter, StashWhereInput> | null
  }, "id">

  export type IngestionOrderByWithAggregationInput = {
    id?: SortOrder
    substanceName?: SortOrderInput | SortOrder
    routeOfAdministration?: SortOrderInput | SortOrder
    dosage_unit?: SortOrderInput | SortOrder
    dosage_amount?: SortOrderInput | SortOrder
    isEstimatedDosage?: SortOrderInput | SortOrder
    date?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
    stashId?: SortOrderInput | SortOrder
    _count?: IngestionCountOrderByAggregateInput
    _avg?: IngestionAvgOrderByAggregateInput
    _max?: IngestionMaxOrderByAggregateInput
    _min?: IngestionMinOrderByAggregateInput
    _sum?: IngestionSumOrderByAggregateInput
  }

  export type IngestionScalarWhereWithAggregatesInput = {
    AND?: IngestionScalarWhereWithAggregatesInput | IngestionScalarWhereWithAggregatesInput[]
    OR?: IngestionScalarWhereWithAggregatesInput[]
    NOT?: IngestionScalarWhereWithAggregatesInput | IngestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ingestion"> | string
    substanceName?: StringNullableWithAggregatesFilter<"Ingestion"> | string | null
    routeOfAdministration?: StringNullableWithAggregatesFilter<"Ingestion"> | string | null
    dosage_unit?: StringNullableWithAggregatesFilter<"Ingestion"> | string | null
    dosage_amount?: IntNullableWithAggregatesFilter<"Ingestion"> | number | null
    isEstimatedDosage?: BoolNullableWithAggregatesFilter<"Ingestion"> | boolean | null
    date?: DateTimeNullableWithAggregatesFilter<"Ingestion"> | Date | string | null
    subject_id?: StringNullableWithAggregatesFilter<"Ingestion"> | string | null
    stashId?: StringNullableWithAggregatesFilter<"Ingestion"> | string | null
  }

  export type StashWhereInput = {
    AND?: StashWhereInput | StashWhereInput[]
    OR?: StashWhereInput[]
    NOT?: StashWhereInput | StashWhereInput[]
    id?: StringFilter<"Stash"> | string
    owner_id?: StringFilter<"Stash"> | string
    substance_id?: StringFilter<"Stash"> | string
    addedDate?: DateTimeNullableFilter<"Stash"> | Date | string | null
    expiration?: DateTimeNullableFilter<"Stash"> | Date | string | null
    amount?: IntNullableFilter<"Stash"> | number | null
    price?: StringNullableFilter<"Stash"> | string | null
    vendor?: StringNullableFilter<"Stash"> | string | null
    description?: StringNullableFilter<"Stash"> | string | null
    purity?: IntNullableFilter<"Stash"> | number | null
    Subject?: XOR<SubjectNullableRelationFilter, SubjectWhereInput> | null
    Substance?: XOR<SubstanceRelationFilter, SubstanceWhereInput>
    ingestions?: IngestionListRelationFilter
  }

  export type StashOrderByWithRelationInput = {
    id?: SortOrder
    owner_id?: SortOrder
    substance_id?: SortOrder
    addedDate?: SortOrderInput | SortOrder
    expiration?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    vendor?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    purity?: SortOrderInput | SortOrder
    Subject?: SubjectOrderByWithRelationInput
    Substance?: SubstanceOrderByWithRelationInput
    ingestions?: IngestionOrderByRelationAggregateInput
  }

  export type StashWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StashWhereInput | StashWhereInput[]
    OR?: StashWhereInput[]
    NOT?: StashWhereInput | StashWhereInput[]
    owner_id?: StringFilter<"Stash"> | string
    substance_id?: StringFilter<"Stash"> | string
    addedDate?: DateTimeNullableFilter<"Stash"> | Date | string | null
    expiration?: DateTimeNullableFilter<"Stash"> | Date | string | null
    amount?: IntNullableFilter<"Stash"> | number | null
    price?: StringNullableFilter<"Stash"> | string | null
    vendor?: StringNullableFilter<"Stash"> | string | null
    description?: StringNullableFilter<"Stash"> | string | null
    purity?: IntNullableFilter<"Stash"> | number | null
    Subject?: XOR<SubjectNullableRelationFilter, SubjectWhereInput> | null
    Substance?: XOR<SubstanceRelationFilter, SubstanceWhereInput>
    ingestions?: IngestionListRelationFilter
  }, "id">

  export type StashOrderByWithAggregationInput = {
    id?: SortOrder
    owner_id?: SortOrder
    substance_id?: SortOrder
    addedDate?: SortOrderInput | SortOrder
    expiration?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    vendor?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    purity?: SortOrderInput | SortOrder
    _count?: StashCountOrderByAggregateInput
    _avg?: StashAvgOrderByAggregateInput
    _max?: StashMaxOrderByAggregateInput
    _min?: StashMinOrderByAggregateInput
    _sum?: StashSumOrderByAggregateInput
  }

  export type StashScalarWhereWithAggregatesInput = {
    AND?: StashScalarWhereWithAggregatesInput | StashScalarWhereWithAggregatesInput[]
    OR?: StashScalarWhereWithAggregatesInput[]
    NOT?: StashScalarWhereWithAggregatesInput | StashScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Stash"> | string
    owner_id?: StringWithAggregatesFilter<"Stash"> | string
    substance_id?: StringWithAggregatesFilter<"Stash"> | string
    addedDate?: DateTimeNullableWithAggregatesFilter<"Stash"> | Date | string | null
    expiration?: DateTimeNullableWithAggregatesFilter<"Stash"> | Date | string | null
    amount?: IntNullableWithAggregatesFilter<"Stash"> | number | null
    price?: StringNullableWithAggregatesFilter<"Stash"> | string | null
    vendor?: StringNullableWithAggregatesFilter<"Stash"> | string | null
    description?: StringNullableWithAggregatesFilter<"Stash"> | string | null
    purity?: IntNullableWithAggregatesFilter<"Stash"> | number | null
  }

  export type SubstanceInteractionWhereInput = {
    AND?: SubstanceInteractionWhereInput | SubstanceInteractionWhereInput[]
    OR?: SubstanceInteractionWhereInput[]
    NOT?: SubstanceInteractionWhereInput | SubstanceInteractionWhereInput[]
    id?: StringFilter<"SubstanceInteraction"> | string
    substanceId?: StringNullableFilter<"SubstanceInteraction"> | string | null
    Substance?: XOR<SubstanceNullableRelationFilter, SubstanceWhereInput> | null
  }

  export type SubstanceInteractionOrderByWithRelationInput = {
    id?: SortOrder
    substanceId?: SortOrderInput | SortOrder
    Substance?: SubstanceOrderByWithRelationInput
  }

  export type SubstanceInteractionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubstanceInteractionWhereInput | SubstanceInteractionWhereInput[]
    OR?: SubstanceInteractionWhereInput[]
    NOT?: SubstanceInteractionWhereInput | SubstanceInteractionWhereInput[]
    substanceId?: StringNullableFilter<"SubstanceInteraction"> | string | null
    Substance?: XOR<SubstanceNullableRelationFilter, SubstanceWhereInput> | null
  }, "id">

  export type SubstanceInteractionOrderByWithAggregationInput = {
    id?: SortOrder
    substanceId?: SortOrderInput | SortOrder
    _count?: SubstanceInteractionCountOrderByAggregateInput
    _max?: SubstanceInteractionMaxOrderByAggregateInput
    _min?: SubstanceInteractionMinOrderByAggregateInput
  }

  export type SubstanceInteractionScalarWhereWithAggregatesInput = {
    AND?: SubstanceInteractionScalarWhereWithAggregatesInput | SubstanceInteractionScalarWhereWithAggregatesInput[]
    OR?: SubstanceInteractionScalarWhereWithAggregatesInput[]
    NOT?: SubstanceInteractionScalarWhereWithAggregatesInput | SubstanceInteractionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubstanceInteraction"> | string
    substanceId?: StringNullableWithAggregatesFilter<"SubstanceInteraction"> | string | null
  }

  export type AccountCreateInput = {
    id?: string
    username: string
    password: string
    Subject?: SubjectCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    username: string
    password: string
    Subject?: SubjectUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    Subject?: SubjectUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    Subject?: SubjectUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type SubjectCreateInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    dateOfBirth?: Date | string | null
    weight?: number | null
    height?: number | null
    account?: AccountCreateNestedOneWithoutSubjectInput
    Ingestions?: IngestionCreateNestedManyWithoutSubjectInput
    Stash?: StashCreateNestedManyWithoutSubjectInput
  }

  export type SubjectUncheckedCreateInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    dateOfBirth?: Date | string | null
    weight?: number | null
    height?: number | null
    account_id?: string | null
    Ingestions?: IngestionUncheckedCreateNestedManyWithoutSubjectInput
    Stash?: StashUncheckedCreateNestedManyWithoutSubjectInput
  }

  export type SubjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    account?: AccountUpdateOneWithoutSubjectNestedInput
    Ingestions?: IngestionUpdateManyWithoutSubjectNestedInput
    Stash?: StashUpdateManyWithoutSubjectNestedInput
  }

  export type SubjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    account_id?: NullableStringFieldUpdateOperationsInput | string | null
    Ingestions?: IngestionUncheckedUpdateManyWithoutSubjectNestedInput
    Stash?: StashUncheckedUpdateManyWithoutSubjectNestedInput
  }

  export type SubjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SubjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    account_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubstanceCreateInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    routes_of_administration?: RouteOfAdministrationCreateNestedManyWithoutSubstanceInput
    Ingestion?: IngestionCreateNestedManyWithoutSubstanceInput
    Stash?: StashCreateNestedManyWithoutSubstanceInput
    SubstanceInteraction?: SubstanceInteractionCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceUncheckedCreateInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    routes_of_administration?: RouteOfAdministrationUncheckedCreateNestedManyWithoutSubstanceInput
    Ingestion?: IngestionUncheckedCreateNestedManyWithoutSubstanceInput
    Stash?: StashUncheckedCreateNestedManyWithoutSubstanceInput
    SubstanceInteraction?: SubstanceInteractionUncheckedCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routes_of_administration?: RouteOfAdministrationUpdateManyWithoutSubstanceNestedInput
    Ingestion?: IngestionUpdateManyWithoutSubstanceNestedInput
    Stash?: StashUpdateManyWithoutSubstanceNestedInput
    SubstanceInteraction?: SubstanceInteractionUpdateManyWithoutSubstanceNestedInput
  }

  export type SubstanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routes_of_administration?: RouteOfAdministrationUncheckedUpdateManyWithoutSubstanceNestedInput
    Ingestion?: IngestionUncheckedUpdateManyWithoutSubstanceNestedInput
    Stash?: StashUncheckedUpdateManyWithoutSubstanceNestedInput
    SubstanceInteraction?: SubstanceInteractionUncheckedUpdateManyWithoutSubstanceNestedInput
  }

  export type SubstanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubstanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RouteOfAdministrationCreateInput = {
    id?: string
    name: string
    bioavailability: number
    dosage?: DosageCreateNestedManyWithoutRouteOfAdministrationInput
    phases?: PhaseCreateNestedManyWithoutRouteOfAdministrationInput
    Substance?: SubstanceCreateNestedOneWithoutRoutes_of_administrationInput
  }

  export type RouteOfAdministrationUncheckedCreateInput = {
    id?: string
    substanceName?: string | null
    name: string
    bioavailability: number
    dosage?: DosageUncheckedCreateNestedManyWithoutRouteOfAdministrationInput
    phases?: PhaseUncheckedCreateNestedManyWithoutRouteOfAdministrationInput
  }

  export type RouteOfAdministrationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
    dosage?: DosageUpdateManyWithoutRouteOfAdministrationNestedInput
    phases?: PhaseUpdateManyWithoutRouteOfAdministrationNestedInput
    Substance?: SubstanceUpdateOneWithoutRoutes_of_administrationNestedInput
  }

  export type RouteOfAdministrationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
    dosage?: DosageUncheckedUpdateManyWithoutRouteOfAdministrationNestedInput
    phases?: PhaseUncheckedUpdateManyWithoutRouteOfAdministrationNestedInput
  }

  export type RouteOfAdministrationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
  }

  export type RouteOfAdministrationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
  }

  export type PhaseCreateInput = {
    id?: string
    from?: number | null
    to?: number | null
    RouteOfAdministration?: RouteOfAdministrationCreateNestedOneWithoutPhasesInput
    effects?: EffectCreateNestedManyWithoutPhaseInput
  }

  export type PhaseUncheckedCreateInput = {
    id?: string
    from?: number | null
    to?: number | null
    routeOfAdministrationId?: string | null
    effects?: EffectUncheckedCreateNestedManyWithoutPhaseInput
  }

  export type PhaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
    RouteOfAdministration?: RouteOfAdministrationUpdateOneWithoutPhasesNestedInput
    effects?: EffectUpdateManyWithoutPhaseNestedInput
  }

  export type PhaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
    routeOfAdministrationId?: NullableStringFieldUpdateOperationsInput | string | null
    effects?: EffectUncheckedUpdateManyWithoutPhaseNestedInput
  }

  export type PhaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PhaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
    routeOfAdministrationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DosageCreateInput = {
    id?: string
    intensivity: string
    amount_min: number
    amount_max: number
    unit: string
    perKilogram?: boolean
    RouteOfAdministration?: RouteOfAdministrationCreateNestedOneWithoutDosageInput
  }

  export type DosageUncheckedCreateInput = {
    id?: string
    intensivity: string
    amount_min: number
    amount_max: number
    unit: string
    perKilogram?: boolean
    routeOfAdministrationId?: string | null
  }

  export type DosageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    intensivity?: StringFieldUpdateOperationsInput | string
    amount_min?: FloatFieldUpdateOperationsInput | number
    amount_max?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    perKilogram?: BoolFieldUpdateOperationsInput | boolean
    RouteOfAdministration?: RouteOfAdministrationUpdateOneWithoutDosageNestedInput
  }

  export type DosageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    intensivity?: StringFieldUpdateOperationsInput | string
    amount_min?: FloatFieldUpdateOperationsInput | number
    amount_max?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    perKilogram?: BoolFieldUpdateOperationsInput | boolean
    routeOfAdministrationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DosageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    intensivity?: StringFieldUpdateOperationsInput | string
    amount_min?: FloatFieldUpdateOperationsInput | number
    amount_max?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    perKilogram?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DosageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    intensivity?: StringFieldUpdateOperationsInput | string
    amount_min?: FloatFieldUpdateOperationsInput | number
    amount_max?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    perKilogram?: BoolFieldUpdateOperationsInput | boolean
    routeOfAdministrationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EffectCreateInput = {
    id?: string
    name: string
    slug: string
    category?: string | null
    type?: string | null
    tags: string
    summary?: string | null
    description: string
    parameters: string
    see_also: string
    effectindex?: string | null
    psychonautwiki?: string | null
    Phase?: PhaseCreateNestedManyWithoutEffectsInput
  }

  export type EffectUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    category?: string | null
    type?: string | null
    tags: string
    summary?: string | null
    description: string
    parameters: string
    see_also: string
    effectindex?: string | null
    psychonautwiki?: string | null
    Phase?: PhaseUncheckedCreateNestedManyWithoutEffectsInput
  }

  export type EffectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    see_also?: StringFieldUpdateOperationsInput | string
    effectindex?: NullableStringFieldUpdateOperationsInput | string | null
    psychonautwiki?: NullableStringFieldUpdateOperationsInput | string | null
    Phase?: PhaseUpdateManyWithoutEffectsNestedInput
  }

  export type EffectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    see_also?: StringFieldUpdateOperationsInput | string
    effectindex?: NullableStringFieldUpdateOperationsInput | string | null
    psychonautwiki?: NullableStringFieldUpdateOperationsInput | string | null
    Phase?: PhaseUncheckedUpdateManyWithoutEffectsNestedInput
  }

  export type EffectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    see_also?: StringFieldUpdateOperationsInput | string
    effectindex?: NullableStringFieldUpdateOperationsInput | string | null
    psychonautwiki?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EffectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    see_also?: StringFieldUpdateOperationsInput | string
    effectindex?: NullableStringFieldUpdateOperationsInput | string | null
    psychonautwiki?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IngestionCreateInput = {
    id?: string
    routeOfAdministration?: string | null
    dosage_unit?: string | null
    dosage_amount?: number | null
    isEstimatedDosage?: boolean | null
    date?: Date | string | null
    Subject?: SubjectCreateNestedOneWithoutIngestionsInput
    Substance?: SubstanceCreateNestedOneWithoutIngestionInput
    Stash?: StashCreateNestedOneWithoutIngestionsInput
  }

  export type IngestionUncheckedCreateInput = {
    id?: string
    substanceName?: string | null
    routeOfAdministration?: string | null
    dosage_unit?: string | null
    dosage_amount?: number | null
    isEstimatedDosage?: boolean | null
    date?: Date | string | null
    subject_id?: string | null
    stashId?: string | null
  }

  export type IngestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    Subject?: SubjectUpdateOneWithoutIngestionsNestedInput
    Substance?: SubstanceUpdateOneWithoutIngestionNestedInput
    Stash?: StashUpdateOneWithoutIngestionsNestedInput
  }

  export type IngestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
    stashId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IngestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IngestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
    stashId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StashCreateInput = {
    id?: string
    addedDate?: Date | string | null
    expiration?: Date | string | null
    amount?: number | null
    price?: string | null
    vendor?: string | null
    description?: string | null
    purity?: number | null
    Subject?: SubjectCreateNestedOneWithoutStashInput
    Substance: SubstanceCreateNestedOneWithoutStashInput
    ingestions?: IngestionCreateNestedManyWithoutStashInput
  }

  export type StashUncheckedCreateInput = {
    id?: string
    owner_id: string
    substance_id: string
    addedDate?: Date | string | null
    expiration?: Date | string | null
    amount?: number | null
    price?: string | null
    vendor?: string | null
    description?: string | null
    purity?: number | null
    ingestions?: IngestionUncheckedCreateNestedManyWithoutStashInput
  }

  export type StashUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
    Subject?: SubjectUpdateOneWithoutStashNestedInput
    Substance?: SubstanceUpdateOneRequiredWithoutStashNestedInput
    ingestions?: IngestionUpdateManyWithoutStashNestedInput
  }

  export type StashUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner_id?: StringFieldUpdateOperationsInput | string
    substance_id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
    ingestions?: IngestionUncheckedUpdateManyWithoutStashNestedInput
  }

  export type StashUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type StashUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner_id?: StringFieldUpdateOperationsInput | string
    substance_id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SubstanceInteractionCreateInput = {
    id?: string
    Substance?: SubstanceCreateNestedOneWithoutSubstanceInteractionInput
  }

  export type SubstanceInteractionUncheckedCreateInput = {
    id?: string
    substanceId?: string | null
  }

  export type SubstanceInteractionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    Substance?: SubstanceUpdateOneWithoutSubstanceInteractionNestedInput
  }

  export type SubstanceInteractionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubstanceInteractionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type SubstanceInteractionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type SubjectListRelationFilter = {
    every?: SubjectWhereInput
    some?: SubjectWhereInput
    none?: SubjectWhereInput
  }

  export type SubjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type AccountNullableRelationFilter = {
    is?: AccountWhereInput | null
    isNot?: AccountWhereInput | null
  }

  export type IngestionListRelationFilter = {
    every?: IngestionWhereInput
    some?: IngestionWhereInput
    none?: IngestionWhereInput
  }

  export type StashListRelationFilter = {
    every?: StashWhereInput
    some?: StashWhereInput
    none?: StashWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type IngestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StashOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubjectCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    dateOfBirth?: SortOrder
    weight?: SortOrder
    height?: SortOrder
    account_id?: SortOrder
  }

  export type SubjectAvgOrderByAggregateInput = {
    weight?: SortOrder
    height?: SortOrder
  }

  export type SubjectMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    dateOfBirth?: SortOrder
    weight?: SortOrder
    height?: SortOrder
    account_id?: SortOrder
  }

  export type SubjectMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    dateOfBirth?: SortOrder
    weight?: SortOrder
    height?: SortOrder
    account_id?: SortOrder
  }

  export type SubjectSumOrderByAggregateInput = {
    weight?: SortOrder
    height?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type RouteOfAdministrationListRelationFilter = {
    every?: RouteOfAdministrationWhereInput
    some?: RouteOfAdministrationWhereInput
    none?: RouteOfAdministrationWhereInput
  }

  export type SubstanceInteractionListRelationFilter = {
    every?: SubstanceInteractionWhereInput
    some?: SubstanceInteractionWhereInput
    none?: SubstanceInteractionWhereInput
  }

  export type RouteOfAdministrationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubstanceInteractionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubstanceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    common_names?: SortOrder
    brand_names?: SortOrder
    substitutive_name?: SortOrder
    systematic_name?: SortOrder
    unii?: SortOrder
    cas_number?: SortOrder
    inchi_key?: SortOrder
    iupac?: SortOrder
    smiles?: SortOrder
    psychoactive_class?: SortOrder
    chemical_class?: SortOrder
    description?: SortOrder
  }

  export type SubstanceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    common_names?: SortOrder
    brand_names?: SortOrder
    substitutive_name?: SortOrder
    systematic_name?: SortOrder
    unii?: SortOrder
    cas_number?: SortOrder
    inchi_key?: SortOrder
    iupac?: SortOrder
    smiles?: SortOrder
    psychoactive_class?: SortOrder
    chemical_class?: SortOrder
    description?: SortOrder
  }

  export type SubstanceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    common_names?: SortOrder
    brand_names?: SortOrder
    substitutive_name?: SortOrder
    systematic_name?: SortOrder
    unii?: SortOrder
    cas_number?: SortOrder
    inchi_key?: SortOrder
    iupac?: SortOrder
    smiles?: SortOrder
    psychoactive_class?: SortOrder
    chemical_class?: SortOrder
    description?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DosageListRelationFilter = {
    every?: DosageWhereInput
    some?: DosageWhereInput
    none?: DosageWhereInput
  }

  export type PhaseListRelationFilter = {
    every?: PhaseWhereInput
    some?: PhaseWhereInput
    none?: PhaseWhereInput
  }

  export type SubstanceNullableRelationFilter = {
    is?: SubstanceWhereInput | null
    isNot?: SubstanceWhereInput | null
  }

  export type DosageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PhaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RouteOfAdministrationNameSubstanceNameCompoundUniqueInput = {
    name: string
    substanceName: string
  }

  export type RouteOfAdministrationCountOrderByAggregateInput = {
    id?: SortOrder
    substanceName?: SortOrder
    name?: SortOrder
    bioavailability?: SortOrder
  }

  export type RouteOfAdministrationAvgOrderByAggregateInput = {
    bioavailability?: SortOrder
  }

  export type RouteOfAdministrationMaxOrderByAggregateInput = {
    id?: SortOrder
    substanceName?: SortOrder
    name?: SortOrder
    bioavailability?: SortOrder
  }

  export type RouteOfAdministrationMinOrderByAggregateInput = {
    id?: SortOrder
    substanceName?: SortOrder
    name?: SortOrder
    bioavailability?: SortOrder
  }

  export type RouteOfAdministrationSumOrderByAggregateInput = {
    bioavailability?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type RouteOfAdministrationNullableRelationFilter = {
    is?: RouteOfAdministrationWhereInput | null
    isNot?: RouteOfAdministrationWhereInput | null
  }

  export type EffectListRelationFilter = {
    every?: EffectWhereInput
    some?: EffectWhereInput
    none?: EffectWhereInput
  }

  export type EffectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PhaseCountOrderByAggregateInput = {
    id?: SortOrder
    from?: SortOrder
    to?: SortOrder
    routeOfAdministrationId?: SortOrder
  }

  export type PhaseAvgOrderByAggregateInput = {
    from?: SortOrder
    to?: SortOrder
  }

  export type PhaseMaxOrderByAggregateInput = {
    id?: SortOrder
    from?: SortOrder
    to?: SortOrder
    routeOfAdministrationId?: SortOrder
  }

  export type PhaseMinOrderByAggregateInput = {
    id?: SortOrder
    from?: SortOrder
    to?: SortOrder
    routeOfAdministrationId?: SortOrder
  }

  export type PhaseSumOrderByAggregateInput = {
    from?: SortOrder
    to?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DosageIntensivityRouteOfAdministrationIdCompoundUniqueInput = {
    intensivity: string
    routeOfAdministrationId: string
  }

  export type DosageCountOrderByAggregateInput = {
    id?: SortOrder
    intensivity?: SortOrder
    amount_min?: SortOrder
    amount_max?: SortOrder
    unit?: SortOrder
    perKilogram?: SortOrder
    routeOfAdministrationId?: SortOrder
  }

  export type DosageAvgOrderByAggregateInput = {
    amount_min?: SortOrder
    amount_max?: SortOrder
  }

  export type DosageMaxOrderByAggregateInput = {
    id?: SortOrder
    intensivity?: SortOrder
    amount_min?: SortOrder
    amount_max?: SortOrder
    unit?: SortOrder
    perKilogram?: SortOrder
    routeOfAdministrationId?: SortOrder
  }

  export type DosageMinOrderByAggregateInput = {
    id?: SortOrder
    intensivity?: SortOrder
    amount_min?: SortOrder
    amount_max?: SortOrder
    unit?: SortOrder
    perKilogram?: SortOrder
    routeOfAdministrationId?: SortOrder
  }

  export type DosageSumOrderByAggregateInput = {
    amount_min?: SortOrder
    amount_max?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EffectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    category?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    parameters?: SortOrder
    see_also?: SortOrder
    effectindex?: SortOrder
    psychonautwiki?: SortOrder
  }

  export type EffectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    category?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    parameters?: SortOrder
    see_also?: SortOrder
    effectindex?: SortOrder
    psychonautwiki?: SortOrder
  }

  export type EffectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    category?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    parameters?: SortOrder
    see_also?: SortOrder
    effectindex?: SortOrder
    psychonautwiki?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type SubjectNullableRelationFilter = {
    is?: SubjectWhereInput | null
    isNot?: SubjectWhereInput | null
  }

  export type StashNullableRelationFilter = {
    is?: StashWhereInput | null
    isNot?: StashWhereInput | null
  }

  export type IngestionCountOrderByAggregateInput = {
    id?: SortOrder
    substanceName?: SortOrder
    routeOfAdministration?: SortOrder
    dosage_unit?: SortOrder
    dosage_amount?: SortOrder
    isEstimatedDosage?: SortOrder
    date?: SortOrder
    subject_id?: SortOrder
    stashId?: SortOrder
  }

  export type IngestionAvgOrderByAggregateInput = {
    dosage_amount?: SortOrder
  }

  export type IngestionMaxOrderByAggregateInput = {
    id?: SortOrder
    substanceName?: SortOrder
    routeOfAdministration?: SortOrder
    dosage_unit?: SortOrder
    dosage_amount?: SortOrder
    isEstimatedDosage?: SortOrder
    date?: SortOrder
    subject_id?: SortOrder
    stashId?: SortOrder
  }

  export type IngestionMinOrderByAggregateInput = {
    id?: SortOrder
    substanceName?: SortOrder
    routeOfAdministration?: SortOrder
    dosage_unit?: SortOrder
    dosage_amount?: SortOrder
    isEstimatedDosage?: SortOrder
    date?: SortOrder
    subject_id?: SortOrder
    stashId?: SortOrder
  }

  export type IngestionSumOrderByAggregateInput = {
    dosage_amount?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type SubstanceRelationFilter = {
    is?: SubstanceWhereInput
    isNot?: SubstanceWhereInput
  }

  export type StashCountOrderByAggregateInput = {
    id?: SortOrder
    owner_id?: SortOrder
    substance_id?: SortOrder
    addedDate?: SortOrder
    expiration?: SortOrder
    amount?: SortOrder
    price?: SortOrder
    vendor?: SortOrder
    description?: SortOrder
    purity?: SortOrder
  }

  export type StashAvgOrderByAggregateInput = {
    amount?: SortOrder
    purity?: SortOrder
  }

  export type StashMaxOrderByAggregateInput = {
    id?: SortOrder
    owner_id?: SortOrder
    substance_id?: SortOrder
    addedDate?: SortOrder
    expiration?: SortOrder
    amount?: SortOrder
    price?: SortOrder
    vendor?: SortOrder
    description?: SortOrder
    purity?: SortOrder
  }

  export type StashMinOrderByAggregateInput = {
    id?: SortOrder
    owner_id?: SortOrder
    substance_id?: SortOrder
    addedDate?: SortOrder
    expiration?: SortOrder
    amount?: SortOrder
    price?: SortOrder
    vendor?: SortOrder
    description?: SortOrder
    purity?: SortOrder
  }

  export type StashSumOrderByAggregateInput = {
    amount?: SortOrder
    purity?: SortOrder
  }

  export type SubstanceInteractionCountOrderByAggregateInput = {
    id?: SortOrder
    substanceId?: SortOrder
  }

  export type SubstanceInteractionMaxOrderByAggregateInput = {
    id?: SortOrder
    substanceId?: SortOrder
  }

  export type SubstanceInteractionMinOrderByAggregateInput = {
    id?: SortOrder
    substanceId?: SortOrder
  }

  export type SubjectCreateNestedManyWithoutAccountInput = {
    create?: XOR<SubjectCreateWithoutAccountInput, SubjectUncheckedCreateWithoutAccountInput> | SubjectCreateWithoutAccountInput[] | SubjectUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: SubjectCreateOrConnectWithoutAccountInput | SubjectCreateOrConnectWithoutAccountInput[]
    connect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
  }

  export type SubjectUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<SubjectCreateWithoutAccountInput, SubjectUncheckedCreateWithoutAccountInput> | SubjectCreateWithoutAccountInput[] | SubjectUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: SubjectCreateOrConnectWithoutAccountInput | SubjectCreateOrConnectWithoutAccountInput[]
    connect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type SubjectUpdateManyWithoutAccountNestedInput = {
    create?: XOR<SubjectCreateWithoutAccountInput, SubjectUncheckedCreateWithoutAccountInput> | SubjectCreateWithoutAccountInput[] | SubjectUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: SubjectCreateOrConnectWithoutAccountInput | SubjectCreateOrConnectWithoutAccountInput[]
    upsert?: SubjectUpsertWithWhereUniqueWithoutAccountInput | SubjectUpsertWithWhereUniqueWithoutAccountInput[]
    set?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    disconnect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    delete?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    connect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    update?: SubjectUpdateWithWhereUniqueWithoutAccountInput | SubjectUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: SubjectUpdateManyWithWhereWithoutAccountInput | SubjectUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: SubjectScalarWhereInput | SubjectScalarWhereInput[]
  }

  export type SubjectUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<SubjectCreateWithoutAccountInput, SubjectUncheckedCreateWithoutAccountInput> | SubjectCreateWithoutAccountInput[] | SubjectUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: SubjectCreateOrConnectWithoutAccountInput | SubjectCreateOrConnectWithoutAccountInput[]
    upsert?: SubjectUpsertWithWhereUniqueWithoutAccountInput | SubjectUpsertWithWhereUniqueWithoutAccountInput[]
    set?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    disconnect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    delete?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    connect?: SubjectWhereUniqueInput | SubjectWhereUniqueInput[]
    update?: SubjectUpdateWithWhereUniqueWithoutAccountInput | SubjectUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: SubjectUpdateManyWithWhereWithoutAccountInput | SubjectUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: SubjectScalarWhereInput | SubjectScalarWhereInput[]
  }

  export type AccountCreateNestedOneWithoutSubjectInput = {
    create?: XOR<AccountCreateWithoutSubjectInput, AccountUncheckedCreateWithoutSubjectInput>
    connectOrCreate?: AccountCreateOrConnectWithoutSubjectInput
    connect?: AccountWhereUniqueInput
  }

  export type IngestionCreateNestedManyWithoutSubjectInput = {
    create?: XOR<IngestionCreateWithoutSubjectInput, IngestionUncheckedCreateWithoutSubjectInput> | IngestionCreateWithoutSubjectInput[] | IngestionUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutSubjectInput | IngestionCreateOrConnectWithoutSubjectInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
  }

  export type StashCreateNestedManyWithoutSubjectInput = {
    create?: XOR<StashCreateWithoutSubjectInput, StashUncheckedCreateWithoutSubjectInput> | StashCreateWithoutSubjectInput[] | StashUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: StashCreateOrConnectWithoutSubjectInput | StashCreateOrConnectWithoutSubjectInput[]
    connect?: StashWhereUniqueInput | StashWhereUniqueInput[]
  }

  export type IngestionUncheckedCreateNestedManyWithoutSubjectInput = {
    create?: XOR<IngestionCreateWithoutSubjectInput, IngestionUncheckedCreateWithoutSubjectInput> | IngestionCreateWithoutSubjectInput[] | IngestionUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutSubjectInput | IngestionCreateOrConnectWithoutSubjectInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
  }

  export type StashUncheckedCreateNestedManyWithoutSubjectInput = {
    create?: XOR<StashCreateWithoutSubjectInput, StashUncheckedCreateWithoutSubjectInput> | StashCreateWithoutSubjectInput[] | StashUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: StashCreateOrConnectWithoutSubjectInput | StashCreateOrConnectWithoutSubjectInput[]
    connect?: StashWhereUniqueInput | StashWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AccountUpdateOneWithoutSubjectNestedInput = {
    create?: XOR<AccountCreateWithoutSubjectInput, AccountUncheckedCreateWithoutSubjectInput>
    connectOrCreate?: AccountCreateOrConnectWithoutSubjectInput
    upsert?: AccountUpsertWithoutSubjectInput
    disconnect?: AccountWhereInput | boolean
    delete?: AccountWhereInput | boolean
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutSubjectInput, AccountUpdateWithoutSubjectInput>, AccountUncheckedUpdateWithoutSubjectInput>
  }

  export type IngestionUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<IngestionCreateWithoutSubjectInput, IngestionUncheckedCreateWithoutSubjectInput> | IngestionCreateWithoutSubjectInput[] | IngestionUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutSubjectInput | IngestionCreateOrConnectWithoutSubjectInput[]
    upsert?: IngestionUpsertWithWhereUniqueWithoutSubjectInput | IngestionUpsertWithWhereUniqueWithoutSubjectInput[]
    set?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    disconnect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    delete?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    update?: IngestionUpdateWithWhereUniqueWithoutSubjectInput | IngestionUpdateWithWhereUniqueWithoutSubjectInput[]
    updateMany?: IngestionUpdateManyWithWhereWithoutSubjectInput | IngestionUpdateManyWithWhereWithoutSubjectInput[]
    deleteMany?: IngestionScalarWhereInput | IngestionScalarWhereInput[]
  }

  export type StashUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<StashCreateWithoutSubjectInput, StashUncheckedCreateWithoutSubjectInput> | StashCreateWithoutSubjectInput[] | StashUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: StashCreateOrConnectWithoutSubjectInput | StashCreateOrConnectWithoutSubjectInput[]
    upsert?: StashUpsertWithWhereUniqueWithoutSubjectInput | StashUpsertWithWhereUniqueWithoutSubjectInput[]
    set?: StashWhereUniqueInput | StashWhereUniqueInput[]
    disconnect?: StashWhereUniqueInput | StashWhereUniqueInput[]
    delete?: StashWhereUniqueInput | StashWhereUniqueInput[]
    connect?: StashWhereUniqueInput | StashWhereUniqueInput[]
    update?: StashUpdateWithWhereUniqueWithoutSubjectInput | StashUpdateWithWhereUniqueWithoutSubjectInput[]
    updateMany?: StashUpdateManyWithWhereWithoutSubjectInput | StashUpdateManyWithWhereWithoutSubjectInput[]
    deleteMany?: StashScalarWhereInput | StashScalarWhereInput[]
  }

  export type IngestionUncheckedUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<IngestionCreateWithoutSubjectInput, IngestionUncheckedCreateWithoutSubjectInput> | IngestionCreateWithoutSubjectInput[] | IngestionUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutSubjectInput | IngestionCreateOrConnectWithoutSubjectInput[]
    upsert?: IngestionUpsertWithWhereUniqueWithoutSubjectInput | IngestionUpsertWithWhereUniqueWithoutSubjectInput[]
    set?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    disconnect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    delete?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    update?: IngestionUpdateWithWhereUniqueWithoutSubjectInput | IngestionUpdateWithWhereUniqueWithoutSubjectInput[]
    updateMany?: IngestionUpdateManyWithWhereWithoutSubjectInput | IngestionUpdateManyWithWhereWithoutSubjectInput[]
    deleteMany?: IngestionScalarWhereInput | IngestionScalarWhereInput[]
  }

  export type StashUncheckedUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<StashCreateWithoutSubjectInput, StashUncheckedCreateWithoutSubjectInput> | StashCreateWithoutSubjectInput[] | StashUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: StashCreateOrConnectWithoutSubjectInput | StashCreateOrConnectWithoutSubjectInput[]
    upsert?: StashUpsertWithWhereUniqueWithoutSubjectInput | StashUpsertWithWhereUniqueWithoutSubjectInput[]
    set?: StashWhereUniqueInput | StashWhereUniqueInput[]
    disconnect?: StashWhereUniqueInput | StashWhereUniqueInput[]
    delete?: StashWhereUniqueInput | StashWhereUniqueInput[]
    connect?: StashWhereUniqueInput | StashWhereUniqueInput[]
    update?: StashUpdateWithWhereUniqueWithoutSubjectInput | StashUpdateWithWhereUniqueWithoutSubjectInput[]
    updateMany?: StashUpdateManyWithWhereWithoutSubjectInput | StashUpdateManyWithWhereWithoutSubjectInput[]
    deleteMany?: StashScalarWhereInput | StashScalarWhereInput[]
  }

  export type RouteOfAdministrationCreateNestedManyWithoutSubstanceInput = {
    create?: XOR<RouteOfAdministrationCreateWithoutSubstanceInput, RouteOfAdministrationUncheckedCreateWithoutSubstanceInput> | RouteOfAdministrationCreateWithoutSubstanceInput[] | RouteOfAdministrationUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: RouteOfAdministrationCreateOrConnectWithoutSubstanceInput | RouteOfAdministrationCreateOrConnectWithoutSubstanceInput[]
    connect?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
  }

  export type IngestionCreateNestedManyWithoutSubstanceInput = {
    create?: XOR<IngestionCreateWithoutSubstanceInput, IngestionUncheckedCreateWithoutSubstanceInput> | IngestionCreateWithoutSubstanceInput[] | IngestionUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutSubstanceInput | IngestionCreateOrConnectWithoutSubstanceInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
  }

  export type StashCreateNestedManyWithoutSubstanceInput = {
    create?: XOR<StashCreateWithoutSubstanceInput, StashUncheckedCreateWithoutSubstanceInput> | StashCreateWithoutSubstanceInput[] | StashUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: StashCreateOrConnectWithoutSubstanceInput | StashCreateOrConnectWithoutSubstanceInput[]
    connect?: StashWhereUniqueInput | StashWhereUniqueInput[]
  }

  export type SubstanceInteractionCreateNestedManyWithoutSubstanceInput = {
    create?: XOR<SubstanceInteractionCreateWithoutSubstanceInput, SubstanceInteractionUncheckedCreateWithoutSubstanceInput> | SubstanceInteractionCreateWithoutSubstanceInput[] | SubstanceInteractionUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: SubstanceInteractionCreateOrConnectWithoutSubstanceInput | SubstanceInteractionCreateOrConnectWithoutSubstanceInput[]
    connect?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
  }

  export type RouteOfAdministrationUncheckedCreateNestedManyWithoutSubstanceInput = {
    create?: XOR<RouteOfAdministrationCreateWithoutSubstanceInput, RouteOfAdministrationUncheckedCreateWithoutSubstanceInput> | RouteOfAdministrationCreateWithoutSubstanceInput[] | RouteOfAdministrationUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: RouteOfAdministrationCreateOrConnectWithoutSubstanceInput | RouteOfAdministrationCreateOrConnectWithoutSubstanceInput[]
    connect?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
  }

  export type IngestionUncheckedCreateNestedManyWithoutSubstanceInput = {
    create?: XOR<IngestionCreateWithoutSubstanceInput, IngestionUncheckedCreateWithoutSubstanceInput> | IngestionCreateWithoutSubstanceInput[] | IngestionUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutSubstanceInput | IngestionCreateOrConnectWithoutSubstanceInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
  }

  export type StashUncheckedCreateNestedManyWithoutSubstanceInput = {
    create?: XOR<StashCreateWithoutSubstanceInput, StashUncheckedCreateWithoutSubstanceInput> | StashCreateWithoutSubstanceInput[] | StashUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: StashCreateOrConnectWithoutSubstanceInput | StashCreateOrConnectWithoutSubstanceInput[]
    connect?: StashWhereUniqueInput | StashWhereUniqueInput[]
  }

  export type SubstanceInteractionUncheckedCreateNestedManyWithoutSubstanceInput = {
    create?: XOR<SubstanceInteractionCreateWithoutSubstanceInput, SubstanceInteractionUncheckedCreateWithoutSubstanceInput> | SubstanceInteractionCreateWithoutSubstanceInput[] | SubstanceInteractionUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: SubstanceInteractionCreateOrConnectWithoutSubstanceInput | SubstanceInteractionCreateOrConnectWithoutSubstanceInput[]
    connect?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
  }

  export type RouteOfAdministrationUpdateManyWithoutSubstanceNestedInput = {
    create?: XOR<RouteOfAdministrationCreateWithoutSubstanceInput, RouteOfAdministrationUncheckedCreateWithoutSubstanceInput> | RouteOfAdministrationCreateWithoutSubstanceInput[] | RouteOfAdministrationUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: RouteOfAdministrationCreateOrConnectWithoutSubstanceInput | RouteOfAdministrationCreateOrConnectWithoutSubstanceInput[]
    upsert?: RouteOfAdministrationUpsertWithWhereUniqueWithoutSubstanceInput | RouteOfAdministrationUpsertWithWhereUniqueWithoutSubstanceInput[]
    set?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
    disconnect?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
    delete?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
    connect?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
    update?: RouteOfAdministrationUpdateWithWhereUniqueWithoutSubstanceInput | RouteOfAdministrationUpdateWithWhereUniqueWithoutSubstanceInput[]
    updateMany?: RouteOfAdministrationUpdateManyWithWhereWithoutSubstanceInput | RouteOfAdministrationUpdateManyWithWhereWithoutSubstanceInput[]
    deleteMany?: RouteOfAdministrationScalarWhereInput | RouteOfAdministrationScalarWhereInput[]
  }

  export type IngestionUpdateManyWithoutSubstanceNestedInput = {
    create?: XOR<IngestionCreateWithoutSubstanceInput, IngestionUncheckedCreateWithoutSubstanceInput> | IngestionCreateWithoutSubstanceInput[] | IngestionUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutSubstanceInput | IngestionCreateOrConnectWithoutSubstanceInput[]
    upsert?: IngestionUpsertWithWhereUniqueWithoutSubstanceInput | IngestionUpsertWithWhereUniqueWithoutSubstanceInput[]
    set?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    disconnect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    delete?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    update?: IngestionUpdateWithWhereUniqueWithoutSubstanceInput | IngestionUpdateWithWhereUniqueWithoutSubstanceInput[]
    updateMany?: IngestionUpdateManyWithWhereWithoutSubstanceInput | IngestionUpdateManyWithWhereWithoutSubstanceInput[]
    deleteMany?: IngestionScalarWhereInput | IngestionScalarWhereInput[]
  }

  export type StashUpdateManyWithoutSubstanceNestedInput = {
    create?: XOR<StashCreateWithoutSubstanceInput, StashUncheckedCreateWithoutSubstanceInput> | StashCreateWithoutSubstanceInput[] | StashUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: StashCreateOrConnectWithoutSubstanceInput | StashCreateOrConnectWithoutSubstanceInput[]
    upsert?: StashUpsertWithWhereUniqueWithoutSubstanceInput | StashUpsertWithWhereUniqueWithoutSubstanceInput[]
    set?: StashWhereUniqueInput | StashWhereUniqueInput[]
    disconnect?: StashWhereUniqueInput | StashWhereUniqueInput[]
    delete?: StashWhereUniqueInput | StashWhereUniqueInput[]
    connect?: StashWhereUniqueInput | StashWhereUniqueInput[]
    update?: StashUpdateWithWhereUniqueWithoutSubstanceInput | StashUpdateWithWhereUniqueWithoutSubstanceInput[]
    updateMany?: StashUpdateManyWithWhereWithoutSubstanceInput | StashUpdateManyWithWhereWithoutSubstanceInput[]
    deleteMany?: StashScalarWhereInput | StashScalarWhereInput[]
  }

  export type SubstanceInteractionUpdateManyWithoutSubstanceNestedInput = {
    create?: XOR<SubstanceInteractionCreateWithoutSubstanceInput, SubstanceInteractionUncheckedCreateWithoutSubstanceInput> | SubstanceInteractionCreateWithoutSubstanceInput[] | SubstanceInteractionUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: SubstanceInteractionCreateOrConnectWithoutSubstanceInput | SubstanceInteractionCreateOrConnectWithoutSubstanceInput[]
    upsert?: SubstanceInteractionUpsertWithWhereUniqueWithoutSubstanceInput | SubstanceInteractionUpsertWithWhereUniqueWithoutSubstanceInput[]
    set?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
    disconnect?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
    delete?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
    connect?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
    update?: SubstanceInteractionUpdateWithWhereUniqueWithoutSubstanceInput | SubstanceInteractionUpdateWithWhereUniqueWithoutSubstanceInput[]
    updateMany?: SubstanceInteractionUpdateManyWithWhereWithoutSubstanceInput | SubstanceInteractionUpdateManyWithWhereWithoutSubstanceInput[]
    deleteMany?: SubstanceInteractionScalarWhereInput | SubstanceInteractionScalarWhereInput[]
  }

  export type RouteOfAdministrationUncheckedUpdateManyWithoutSubstanceNestedInput = {
    create?: XOR<RouteOfAdministrationCreateWithoutSubstanceInput, RouteOfAdministrationUncheckedCreateWithoutSubstanceInput> | RouteOfAdministrationCreateWithoutSubstanceInput[] | RouteOfAdministrationUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: RouteOfAdministrationCreateOrConnectWithoutSubstanceInput | RouteOfAdministrationCreateOrConnectWithoutSubstanceInput[]
    upsert?: RouteOfAdministrationUpsertWithWhereUniqueWithoutSubstanceInput | RouteOfAdministrationUpsertWithWhereUniqueWithoutSubstanceInput[]
    set?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
    disconnect?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
    delete?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
    connect?: RouteOfAdministrationWhereUniqueInput | RouteOfAdministrationWhereUniqueInput[]
    update?: RouteOfAdministrationUpdateWithWhereUniqueWithoutSubstanceInput | RouteOfAdministrationUpdateWithWhereUniqueWithoutSubstanceInput[]
    updateMany?: RouteOfAdministrationUpdateManyWithWhereWithoutSubstanceInput | RouteOfAdministrationUpdateManyWithWhereWithoutSubstanceInput[]
    deleteMany?: RouteOfAdministrationScalarWhereInput | RouteOfAdministrationScalarWhereInput[]
  }

  export type IngestionUncheckedUpdateManyWithoutSubstanceNestedInput = {
    create?: XOR<IngestionCreateWithoutSubstanceInput, IngestionUncheckedCreateWithoutSubstanceInput> | IngestionCreateWithoutSubstanceInput[] | IngestionUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutSubstanceInput | IngestionCreateOrConnectWithoutSubstanceInput[]
    upsert?: IngestionUpsertWithWhereUniqueWithoutSubstanceInput | IngestionUpsertWithWhereUniqueWithoutSubstanceInput[]
    set?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    disconnect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    delete?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    update?: IngestionUpdateWithWhereUniqueWithoutSubstanceInput | IngestionUpdateWithWhereUniqueWithoutSubstanceInput[]
    updateMany?: IngestionUpdateManyWithWhereWithoutSubstanceInput | IngestionUpdateManyWithWhereWithoutSubstanceInput[]
    deleteMany?: IngestionScalarWhereInput | IngestionScalarWhereInput[]
  }

  export type StashUncheckedUpdateManyWithoutSubstanceNestedInput = {
    create?: XOR<StashCreateWithoutSubstanceInput, StashUncheckedCreateWithoutSubstanceInput> | StashCreateWithoutSubstanceInput[] | StashUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: StashCreateOrConnectWithoutSubstanceInput | StashCreateOrConnectWithoutSubstanceInput[]
    upsert?: StashUpsertWithWhereUniqueWithoutSubstanceInput | StashUpsertWithWhereUniqueWithoutSubstanceInput[]
    set?: StashWhereUniqueInput | StashWhereUniqueInput[]
    disconnect?: StashWhereUniqueInput | StashWhereUniqueInput[]
    delete?: StashWhereUniqueInput | StashWhereUniqueInput[]
    connect?: StashWhereUniqueInput | StashWhereUniqueInput[]
    update?: StashUpdateWithWhereUniqueWithoutSubstanceInput | StashUpdateWithWhereUniqueWithoutSubstanceInput[]
    updateMany?: StashUpdateManyWithWhereWithoutSubstanceInput | StashUpdateManyWithWhereWithoutSubstanceInput[]
    deleteMany?: StashScalarWhereInput | StashScalarWhereInput[]
  }

  export type SubstanceInteractionUncheckedUpdateManyWithoutSubstanceNestedInput = {
    create?: XOR<SubstanceInteractionCreateWithoutSubstanceInput, SubstanceInteractionUncheckedCreateWithoutSubstanceInput> | SubstanceInteractionCreateWithoutSubstanceInput[] | SubstanceInteractionUncheckedCreateWithoutSubstanceInput[]
    connectOrCreate?: SubstanceInteractionCreateOrConnectWithoutSubstanceInput | SubstanceInteractionCreateOrConnectWithoutSubstanceInput[]
    upsert?: SubstanceInteractionUpsertWithWhereUniqueWithoutSubstanceInput | SubstanceInteractionUpsertWithWhereUniqueWithoutSubstanceInput[]
    set?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
    disconnect?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
    delete?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
    connect?: SubstanceInteractionWhereUniqueInput | SubstanceInteractionWhereUniqueInput[]
    update?: SubstanceInteractionUpdateWithWhereUniqueWithoutSubstanceInput | SubstanceInteractionUpdateWithWhereUniqueWithoutSubstanceInput[]
    updateMany?: SubstanceInteractionUpdateManyWithWhereWithoutSubstanceInput | SubstanceInteractionUpdateManyWithWhereWithoutSubstanceInput[]
    deleteMany?: SubstanceInteractionScalarWhereInput | SubstanceInteractionScalarWhereInput[]
  }

  export type DosageCreateNestedManyWithoutRouteOfAdministrationInput = {
    create?: XOR<DosageCreateWithoutRouteOfAdministrationInput, DosageUncheckedCreateWithoutRouteOfAdministrationInput> | DosageCreateWithoutRouteOfAdministrationInput[] | DosageUncheckedCreateWithoutRouteOfAdministrationInput[]
    connectOrCreate?: DosageCreateOrConnectWithoutRouteOfAdministrationInput | DosageCreateOrConnectWithoutRouteOfAdministrationInput[]
    connect?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
  }

  export type PhaseCreateNestedManyWithoutRouteOfAdministrationInput = {
    create?: XOR<PhaseCreateWithoutRouteOfAdministrationInput, PhaseUncheckedCreateWithoutRouteOfAdministrationInput> | PhaseCreateWithoutRouteOfAdministrationInput[] | PhaseUncheckedCreateWithoutRouteOfAdministrationInput[]
    connectOrCreate?: PhaseCreateOrConnectWithoutRouteOfAdministrationInput | PhaseCreateOrConnectWithoutRouteOfAdministrationInput[]
    connect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
  }

  export type SubstanceCreateNestedOneWithoutRoutes_of_administrationInput = {
    create?: XOR<SubstanceCreateWithoutRoutes_of_administrationInput, SubstanceUncheckedCreateWithoutRoutes_of_administrationInput>
    connectOrCreate?: SubstanceCreateOrConnectWithoutRoutes_of_administrationInput
    connect?: SubstanceWhereUniqueInput
  }

  export type DosageUncheckedCreateNestedManyWithoutRouteOfAdministrationInput = {
    create?: XOR<DosageCreateWithoutRouteOfAdministrationInput, DosageUncheckedCreateWithoutRouteOfAdministrationInput> | DosageCreateWithoutRouteOfAdministrationInput[] | DosageUncheckedCreateWithoutRouteOfAdministrationInput[]
    connectOrCreate?: DosageCreateOrConnectWithoutRouteOfAdministrationInput | DosageCreateOrConnectWithoutRouteOfAdministrationInput[]
    connect?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
  }

  export type PhaseUncheckedCreateNestedManyWithoutRouteOfAdministrationInput = {
    create?: XOR<PhaseCreateWithoutRouteOfAdministrationInput, PhaseUncheckedCreateWithoutRouteOfAdministrationInput> | PhaseCreateWithoutRouteOfAdministrationInput[] | PhaseUncheckedCreateWithoutRouteOfAdministrationInput[]
    connectOrCreate?: PhaseCreateOrConnectWithoutRouteOfAdministrationInput | PhaseCreateOrConnectWithoutRouteOfAdministrationInput[]
    connect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DosageUpdateManyWithoutRouteOfAdministrationNestedInput = {
    create?: XOR<DosageCreateWithoutRouteOfAdministrationInput, DosageUncheckedCreateWithoutRouteOfAdministrationInput> | DosageCreateWithoutRouteOfAdministrationInput[] | DosageUncheckedCreateWithoutRouteOfAdministrationInput[]
    connectOrCreate?: DosageCreateOrConnectWithoutRouteOfAdministrationInput | DosageCreateOrConnectWithoutRouteOfAdministrationInput[]
    upsert?: DosageUpsertWithWhereUniqueWithoutRouteOfAdministrationInput | DosageUpsertWithWhereUniqueWithoutRouteOfAdministrationInput[]
    set?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
    disconnect?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
    delete?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
    connect?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
    update?: DosageUpdateWithWhereUniqueWithoutRouteOfAdministrationInput | DosageUpdateWithWhereUniqueWithoutRouteOfAdministrationInput[]
    updateMany?: DosageUpdateManyWithWhereWithoutRouteOfAdministrationInput | DosageUpdateManyWithWhereWithoutRouteOfAdministrationInput[]
    deleteMany?: DosageScalarWhereInput | DosageScalarWhereInput[]
  }

  export type PhaseUpdateManyWithoutRouteOfAdministrationNestedInput = {
    create?: XOR<PhaseCreateWithoutRouteOfAdministrationInput, PhaseUncheckedCreateWithoutRouteOfAdministrationInput> | PhaseCreateWithoutRouteOfAdministrationInput[] | PhaseUncheckedCreateWithoutRouteOfAdministrationInput[]
    connectOrCreate?: PhaseCreateOrConnectWithoutRouteOfAdministrationInput | PhaseCreateOrConnectWithoutRouteOfAdministrationInput[]
    upsert?: PhaseUpsertWithWhereUniqueWithoutRouteOfAdministrationInput | PhaseUpsertWithWhereUniqueWithoutRouteOfAdministrationInput[]
    set?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    disconnect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    delete?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    connect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    update?: PhaseUpdateWithWhereUniqueWithoutRouteOfAdministrationInput | PhaseUpdateWithWhereUniqueWithoutRouteOfAdministrationInput[]
    updateMany?: PhaseUpdateManyWithWhereWithoutRouteOfAdministrationInput | PhaseUpdateManyWithWhereWithoutRouteOfAdministrationInput[]
    deleteMany?: PhaseScalarWhereInput | PhaseScalarWhereInput[]
  }

  export type SubstanceUpdateOneWithoutRoutes_of_administrationNestedInput = {
    create?: XOR<SubstanceCreateWithoutRoutes_of_administrationInput, SubstanceUncheckedCreateWithoutRoutes_of_administrationInput>
    connectOrCreate?: SubstanceCreateOrConnectWithoutRoutes_of_administrationInput
    upsert?: SubstanceUpsertWithoutRoutes_of_administrationInput
    disconnect?: SubstanceWhereInput | boolean
    delete?: SubstanceWhereInput | boolean
    connect?: SubstanceWhereUniqueInput
    update?: XOR<XOR<SubstanceUpdateToOneWithWhereWithoutRoutes_of_administrationInput, SubstanceUpdateWithoutRoutes_of_administrationInput>, SubstanceUncheckedUpdateWithoutRoutes_of_administrationInput>
  }

  export type DosageUncheckedUpdateManyWithoutRouteOfAdministrationNestedInput = {
    create?: XOR<DosageCreateWithoutRouteOfAdministrationInput, DosageUncheckedCreateWithoutRouteOfAdministrationInput> | DosageCreateWithoutRouteOfAdministrationInput[] | DosageUncheckedCreateWithoutRouteOfAdministrationInput[]
    connectOrCreate?: DosageCreateOrConnectWithoutRouteOfAdministrationInput | DosageCreateOrConnectWithoutRouteOfAdministrationInput[]
    upsert?: DosageUpsertWithWhereUniqueWithoutRouteOfAdministrationInput | DosageUpsertWithWhereUniqueWithoutRouteOfAdministrationInput[]
    set?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
    disconnect?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
    delete?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
    connect?: DosageWhereUniqueInput | DosageWhereUniqueInput[]
    update?: DosageUpdateWithWhereUniqueWithoutRouteOfAdministrationInput | DosageUpdateWithWhereUniqueWithoutRouteOfAdministrationInput[]
    updateMany?: DosageUpdateManyWithWhereWithoutRouteOfAdministrationInput | DosageUpdateManyWithWhereWithoutRouteOfAdministrationInput[]
    deleteMany?: DosageScalarWhereInput | DosageScalarWhereInput[]
  }

  export type PhaseUncheckedUpdateManyWithoutRouteOfAdministrationNestedInput = {
    create?: XOR<PhaseCreateWithoutRouteOfAdministrationInput, PhaseUncheckedCreateWithoutRouteOfAdministrationInput> | PhaseCreateWithoutRouteOfAdministrationInput[] | PhaseUncheckedCreateWithoutRouteOfAdministrationInput[]
    connectOrCreate?: PhaseCreateOrConnectWithoutRouteOfAdministrationInput | PhaseCreateOrConnectWithoutRouteOfAdministrationInput[]
    upsert?: PhaseUpsertWithWhereUniqueWithoutRouteOfAdministrationInput | PhaseUpsertWithWhereUniqueWithoutRouteOfAdministrationInput[]
    set?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    disconnect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    delete?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    connect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    update?: PhaseUpdateWithWhereUniqueWithoutRouteOfAdministrationInput | PhaseUpdateWithWhereUniqueWithoutRouteOfAdministrationInput[]
    updateMany?: PhaseUpdateManyWithWhereWithoutRouteOfAdministrationInput | PhaseUpdateManyWithWhereWithoutRouteOfAdministrationInput[]
    deleteMany?: PhaseScalarWhereInput | PhaseScalarWhereInput[]
  }

  export type RouteOfAdministrationCreateNestedOneWithoutPhasesInput = {
    create?: XOR<RouteOfAdministrationCreateWithoutPhasesInput, RouteOfAdministrationUncheckedCreateWithoutPhasesInput>
    connectOrCreate?: RouteOfAdministrationCreateOrConnectWithoutPhasesInput
    connect?: RouteOfAdministrationWhereUniqueInput
  }

  export type EffectCreateNestedManyWithoutPhaseInput = {
    create?: XOR<EffectCreateWithoutPhaseInput, EffectUncheckedCreateWithoutPhaseInput> | EffectCreateWithoutPhaseInput[] | EffectUncheckedCreateWithoutPhaseInput[]
    connectOrCreate?: EffectCreateOrConnectWithoutPhaseInput | EffectCreateOrConnectWithoutPhaseInput[]
    connect?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
  }

  export type EffectUncheckedCreateNestedManyWithoutPhaseInput = {
    create?: XOR<EffectCreateWithoutPhaseInput, EffectUncheckedCreateWithoutPhaseInput> | EffectCreateWithoutPhaseInput[] | EffectUncheckedCreateWithoutPhaseInput[]
    connectOrCreate?: EffectCreateOrConnectWithoutPhaseInput | EffectCreateOrConnectWithoutPhaseInput[]
    connect?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
  }

  export type RouteOfAdministrationUpdateOneWithoutPhasesNestedInput = {
    create?: XOR<RouteOfAdministrationCreateWithoutPhasesInput, RouteOfAdministrationUncheckedCreateWithoutPhasesInput>
    connectOrCreate?: RouteOfAdministrationCreateOrConnectWithoutPhasesInput
    upsert?: RouteOfAdministrationUpsertWithoutPhasesInput
    disconnect?: RouteOfAdministrationWhereInput | boolean
    delete?: RouteOfAdministrationWhereInput | boolean
    connect?: RouteOfAdministrationWhereUniqueInput
    update?: XOR<XOR<RouteOfAdministrationUpdateToOneWithWhereWithoutPhasesInput, RouteOfAdministrationUpdateWithoutPhasesInput>, RouteOfAdministrationUncheckedUpdateWithoutPhasesInput>
  }

  export type EffectUpdateManyWithoutPhaseNestedInput = {
    create?: XOR<EffectCreateWithoutPhaseInput, EffectUncheckedCreateWithoutPhaseInput> | EffectCreateWithoutPhaseInput[] | EffectUncheckedCreateWithoutPhaseInput[]
    connectOrCreate?: EffectCreateOrConnectWithoutPhaseInput | EffectCreateOrConnectWithoutPhaseInput[]
    upsert?: EffectUpsertWithWhereUniqueWithoutPhaseInput | EffectUpsertWithWhereUniqueWithoutPhaseInput[]
    set?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
    disconnect?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
    delete?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
    connect?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
    update?: EffectUpdateWithWhereUniqueWithoutPhaseInput | EffectUpdateWithWhereUniqueWithoutPhaseInput[]
    updateMany?: EffectUpdateManyWithWhereWithoutPhaseInput | EffectUpdateManyWithWhereWithoutPhaseInput[]
    deleteMany?: EffectScalarWhereInput | EffectScalarWhereInput[]
  }

  export type EffectUncheckedUpdateManyWithoutPhaseNestedInput = {
    create?: XOR<EffectCreateWithoutPhaseInput, EffectUncheckedCreateWithoutPhaseInput> | EffectCreateWithoutPhaseInput[] | EffectUncheckedCreateWithoutPhaseInput[]
    connectOrCreate?: EffectCreateOrConnectWithoutPhaseInput | EffectCreateOrConnectWithoutPhaseInput[]
    upsert?: EffectUpsertWithWhereUniqueWithoutPhaseInput | EffectUpsertWithWhereUniqueWithoutPhaseInput[]
    set?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
    disconnect?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
    delete?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
    connect?: EffectWhereUniqueInput | EffectWhereUniqueInput[]
    update?: EffectUpdateWithWhereUniqueWithoutPhaseInput | EffectUpdateWithWhereUniqueWithoutPhaseInput[]
    updateMany?: EffectUpdateManyWithWhereWithoutPhaseInput | EffectUpdateManyWithWhereWithoutPhaseInput[]
    deleteMany?: EffectScalarWhereInput | EffectScalarWhereInput[]
  }

  export type RouteOfAdministrationCreateNestedOneWithoutDosageInput = {
    create?: XOR<RouteOfAdministrationCreateWithoutDosageInput, RouteOfAdministrationUncheckedCreateWithoutDosageInput>
    connectOrCreate?: RouteOfAdministrationCreateOrConnectWithoutDosageInput
    connect?: RouteOfAdministrationWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RouteOfAdministrationUpdateOneWithoutDosageNestedInput = {
    create?: XOR<RouteOfAdministrationCreateWithoutDosageInput, RouteOfAdministrationUncheckedCreateWithoutDosageInput>
    connectOrCreate?: RouteOfAdministrationCreateOrConnectWithoutDosageInput
    upsert?: RouteOfAdministrationUpsertWithoutDosageInput
    disconnect?: RouteOfAdministrationWhereInput | boolean
    delete?: RouteOfAdministrationWhereInput | boolean
    connect?: RouteOfAdministrationWhereUniqueInput
    update?: XOR<XOR<RouteOfAdministrationUpdateToOneWithWhereWithoutDosageInput, RouteOfAdministrationUpdateWithoutDosageInput>, RouteOfAdministrationUncheckedUpdateWithoutDosageInput>
  }

  export type PhaseCreateNestedManyWithoutEffectsInput = {
    create?: XOR<PhaseCreateWithoutEffectsInput, PhaseUncheckedCreateWithoutEffectsInput> | PhaseCreateWithoutEffectsInput[] | PhaseUncheckedCreateWithoutEffectsInput[]
    connectOrCreate?: PhaseCreateOrConnectWithoutEffectsInput | PhaseCreateOrConnectWithoutEffectsInput[]
    connect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
  }

  export type PhaseUncheckedCreateNestedManyWithoutEffectsInput = {
    create?: XOR<PhaseCreateWithoutEffectsInput, PhaseUncheckedCreateWithoutEffectsInput> | PhaseCreateWithoutEffectsInput[] | PhaseUncheckedCreateWithoutEffectsInput[]
    connectOrCreate?: PhaseCreateOrConnectWithoutEffectsInput | PhaseCreateOrConnectWithoutEffectsInput[]
    connect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
  }

  export type PhaseUpdateManyWithoutEffectsNestedInput = {
    create?: XOR<PhaseCreateWithoutEffectsInput, PhaseUncheckedCreateWithoutEffectsInput> | PhaseCreateWithoutEffectsInput[] | PhaseUncheckedCreateWithoutEffectsInput[]
    connectOrCreate?: PhaseCreateOrConnectWithoutEffectsInput | PhaseCreateOrConnectWithoutEffectsInput[]
    upsert?: PhaseUpsertWithWhereUniqueWithoutEffectsInput | PhaseUpsertWithWhereUniqueWithoutEffectsInput[]
    set?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    disconnect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    delete?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    connect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    update?: PhaseUpdateWithWhereUniqueWithoutEffectsInput | PhaseUpdateWithWhereUniqueWithoutEffectsInput[]
    updateMany?: PhaseUpdateManyWithWhereWithoutEffectsInput | PhaseUpdateManyWithWhereWithoutEffectsInput[]
    deleteMany?: PhaseScalarWhereInput | PhaseScalarWhereInput[]
  }

  export type PhaseUncheckedUpdateManyWithoutEffectsNestedInput = {
    create?: XOR<PhaseCreateWithoutEffectsInput, PhaseUncheckedCreateWithoutEffectsInput> | PhaseCreateWithoutEffectsInput[] | PhaseUncheckedCreateWithoutEffectsInput[]
    connectOrCreate?: PhaseCreateOrConnectWithoutEffectsInput | PhaseCreateOrConnectWithoutEffectsInput[]
    upsert?: PhaseUpsertWithWhereUniqueWithoutEffectsInput | PhaseUpsertWithWhereUniqueWithoutEffectsInput[]
    set?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    disconnect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    delete?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    connect?: PhaseWhereUniqueInput | PhaseWhereUniqueInput[]
    update?: PhaseUpdateWithWhereUniqueWithoutEffectsInput | PhaseUpdateWithWhereUniqueWithoutEffectsInput[]
    updateMany?: PhaseUpdateManyWithWhereWithoutEffectsInput | PhaseUpdateManyWithWhereWithoutEffectsInput[]
    deleteMany?: PhaseScalarWhereInput | PhaseScalarWhereInput[]
  }

  export type SubjectCreateNestedOneWithoutIngestionsInput = {
    create?: XOR<SubjectCreateWithoutIngestionsInput, SubjectUncheckedCreateWithoutIngestionsInput>
    connectOrCreate?: SubjectCreateOrConnectWithoutIngestionsInput
    connect?: SubjectWhereUniqueInput
  }

  export type SubstanceCreateNestedOneWithoutIngestionInput = {
    create?: XOR<SubstanceCreateWithoutIngestionInput, SubstanceUncheckedCreateWithoutIngestionInput>
    connectOrCreate?: SubstanceCreateOrConnectWithoutIngestionInput
    connect?: SubstanceWhereUniqueInput
  }

  export type StashCreateNestedOneWithoutIngestionsInput = {
    create?: XOR<StashCreateWithoutIngestionsInput, StashUncheckedCreateWithoutIngestionsInput>
    connectOrCreate?: StashCreateOrConnectWithoutIngestionsInput
    connect?: StashWhereUniqueInput
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type SubjectUpdateOneWithoutIngestionsNestedInput = {
    create?: XOR<SubjectCreateWithoutIngestionsInput, SubjectUncheckedCreateWithoutIngestionsInput>
    connectOrCreate?: SubjectCreateOrConnectWithoutIngestionsInput
    upsert?: SubjectUpsertWithoutIngestionsInput
    disconnect?: SubjectWhereInput | boolean
    delete?: SubjectWhereInput | boolean
    connect?: SubjectWhereUniqueInput
    update?: XOR<XOR<SubjectUpdateToOneWithWhereWithoutIngestionsInput, SubjectUpdateWithoutIngestionsInput>, SubjectUncheckedUpdateWithoutIngestionsInput>
  }

  export type SubstanceUpdateOneWithoutIngestionNestedInput = {
    create?: XOR<SubstanceCreateWithoutIngestionInput, SubstanceUncheckedCreateWithoutIngestionInput>
    connectOrCreate?: SubstanceCreateOrConnectWithoutIngestionInput
    upsert?: SubstanceUpsertWithoutIngestionInput
    disconnect?: SubstanceWhereInput | boolean
    delete?: SubstanceWhereInput | boolean
    connect?: SubstanceWhereUniqueInput
    update?: XOR<XOR<SubstanceUpdateToOneWithWhereWithoutIngestionInput, SubstanceUpdateWithoutIngestionInput>, SubstanceUncheckedUpdateWithoutIngestionInput>
  }

  export type StashUpdateOneWithoutIngestionsNestedInput = {
    create?: XOR<StashCreateWithoutIngestionsInput, StashUncheckedCreateWithoutIngestionsInput>
    connectOrCreate?: StashCreateOrConnectWithoutIngestionsInput
    upsert?: StashUpsertWithoutIngestionsInput
    disconnect?: StashWhereInput | boolean
    delete?: StashWhereInput | boolean
    connect?: StashWhereUniqueInput
    update?: XOR<XOR<StashUpdateToOneWithWhereWithoutIngestionsInput, StashUpdateWithoutIngestionsInput>, StashUncheckedUpdateWithoutIngestionsInput>
  }

  export type SubjectCreateNestedOneWithoutStashInput = {
    create?: XOR<SubjectCreateWithoutStashInput, SubjectUncheckedCreateWithoutStashInput>
    connectOrCreate?: SubjectCreateOrConnectWithoutStashInput
    connect?: SubjectWhereUniqueInput
  }

  export type SubstanceCreateNestedOneWithoutStashInput = {
    create?: XOR<SubstanceCreateWithoutStashInput, SubstanceUncheckedCreateWithoutStashInput>
    connectOrCreate?: SubstanceCreateOrConnectWithoutStashInput
    connect?: SubstanceWhereUniqueInput
  }

  export type IngestionCreateNestedManyWithoutStashInput = {
    create?: XOR<IngestionCreateWithoutStashInput, IngestionUncheckedCreateWithoutStashInput> | IngestionCreateWithoutStashInput[] | IngestionUncheckedCreateWithoutStashInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutStashInput | IngestionCreateOrConnectWithoutStashInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
  }

  export type IngestionUncheckedCreateNestedManyWithoutStashInput = {
    create?: XOR<IngestionCreateWithoutStashInput, IngestionUncheckedCreateWithoutStashInput> | IngestionCreateWithoutStashInput[] | IngestionUncheckedCreateWithoutStashInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutStashInput | IngestionCreateOrConnectWithoutStashInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
  }

  export type SubjectUpdateOneWithoutStashNestedInput = {
    create?: XOR<SubjectCreateWithoutStashInput, SubjectUncheckedCreateWithoutStashInput>
    connectOrCreate?: SubjectCreateOrConnectWithoutStashInput
    upsert?: SubjectUpsertWithoutStashInput
    disconnect?: SubjectWhereInput | boolean
    delete?: SubjectWhereInput | boolean
    connect?: SubjectWhereUniqueInput
    update?: XOR<XOR<SubjectUpdateToOneWithWhereWithoutStashInput, SubjectUpdateWithoutStashInput>, SubjectUncheckedUpdateWithoutStashInput>
  }

  export type SubstanceUpdateOneRequiredWithoutStashNestedInput = {
    create?: XOR<SubstanceCreateWithoutStashInput, SubstanceUncheckedCreateWithoutStashInput>
    connectOrCreate?: SubstanceCreateOrConnectWithoutStashInput
    upsert?: SubstanceUpsertWithoutStashInput
    connect?: SubstanceWhereUniqueInput
    update?: XOR<XOR<SubstanceUpdateToOneWithWhereWithoutStashInput, SubstanceUpdateWithoutStashInput>, SubstanceUncheckedUpdateWithoutStashInput>
  }

  export type IngestionUpdateManyWithoutStashNestedInput = {
    create?: XOR<IngestionCreateWithoutStashInput, IngestionUncheckedCreateWithoutStashInput> | IngestionCreateWithoutStashInput[] | IngestionUncheckedCreateWithoutStashInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutStashInput | IngestionCreateOrConnectWithoutStashInput[]
    upsert?: IngestionUpsertWithWhereUniqueWithoutStashInput | IngestionUpsertWithWhereUniqueWithoutStashInput[]
    set?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    disconnect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    delete?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    update?: IngestionUpdateWithWhereUniqueWithoutStashInput | IngestionUpdateWithWhereUniqueWithoutStashInput[]
    updateMany?: IngestionUpdateManyWithWhereWithoutStashInput | IngestionUpdateManyWithWhereWithoutStashInput[]
    deleteMany?: IngestionScalarWhereInput | IngestionScalarWhereInput[]
  }

  export type IngestionUncheckedUpdateManyWithoutStashNestedInput = {
    create?: XOR<IngestionCreateWithoutStashInput, IngestionUncheckedCreateWithoutStashInput> | IngestionCreateWithoutStashInput[] | IngestionUncheckedCreateWithoutStashInput[]
    connectOrCreate?: IngestionCreateOrConnectWithoutStashInput | IngestionCreateOrConnectWithoutStashInput[]
    upsert?: IngestionUpsertWithWhereUniqueWithoutStashInput | IngestionUpsertWithWhereUniqueWithoutStashInput[]
    set?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    disconnect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    delete?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    connect?: IngestionWhereUniqueInput | IngestionWhereUniqueInput[]
    update?: IngestionUpdateWithWhereUniqueWithoutStashInput | IngestionUpdateWithWhereUniqueWithoutStashInput[]
    updateMany?: IngestionUpdateManyWithWhereWithoutStashInput | IngestionUpdateManyWithWhereWithoutStashInput[]
    deleteMany?: IngestionScalarWhereInput | IngestionScalarWhereInput[]
  }

  export type SubstanceCreateNestedOneWithoutSubstanceInteractionInput = {
    create?: XOR<SubstanceCreateWithoutSubstanceInteractionInput, SubstanceUncheckedCreateWithoutSubstanceInteractionInput>
    connectOrCreate?: SubstanceCreateOrConnectWithoutSubstanceInteractionInput
    connect?: SubstanceWhereUniqueInput
  }

  export type SubstanceUpdateOneWithoutSubstanceInteractionNestedInput = {
    create?: XOR<SubstanceCreateWithoutSubstanceInteractionInput, SubstanceUncheckedCreateWithoutSubstanceInteractionInput>
    connectOrCreate?: SubstanceCreateOrConnectWithoutSubstanceInteractionInput
    upsert?: SubstanceUpsertWithoutSubstanceInteractionInput
    disconnect?: SubstanceWhereInput | boolean
    delete?: SubstanceWhereInput | boolean
    connect?: SubstanceWhereUniqueInput
    update?: XOR<XOR<SubstanceUpdateToOneWithWhereWithoutSubstanceInteractionInput, SubstanceUpdateWithoutSubstanceInteractionInput>, SubstanceUncheckedUpdateWithoutSubstanceInteractionInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type SubjectCreateWithoutAccountInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    dateOfBirth?: Date | string | null
    weight?: number | null
    height?: number | null
    Ingestions?: IngestionCreateNestedManyWithoutSubjectInput
    Stash?: StashCreateNestedManyWithoutSubjectInput
  }

  export type SubjectUncheckedCreateWithoutAccountInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    dateOfBirth?: Date | string | null
    weight?: number | null
    height?: number | null
    Ingestions?: IngestionUncheckedCreateNestedManyWithoutSubjectInput
    Stash?: StashUncheckedCreateNestedManyWithoutSubjectInput
  }

  export type SubjectCreateOrConnectWithoutAccountInput = {
    where: SubjectWhereUniqueInput
    create: XOR<SubjectCreateWithoutAccountInput, SubjectUncheckedCreateWithoutAccountInput>
  }

  export type SubjectUpsertWithWhereUniqueWithoutAccountInput = {
    where: SubjectWhereUniqueInput
    update: XOR<SubjectUpdateWithoutAccountInput, SubjectUncheckedUpdateWithoutAccountInput>
    create: XOR<SubjectCreateWithoutAccountInput, SubjectUncheckedCreateWithoutAccountInput>
  }

  export type SubjectUpdateWithWhereUniqueWithoutAccountInput = {
    where: SubjectWhereUniqueInput
    data: XOR<SubjectUpdateWithoutAccountInput, SubjectUncheckedUpdateWithoutAccountInput>
  }

  export type SubjectUpdateManyWithWhereWithoutAccountInput = {
    where: SubjectScalarWhereInput
    data: XOR<SubjectUpdateManyMutationInput, SubjectUncheckedUpdateManyWithoutAccountInput>
  }

  export type SubjectScalarWhereInput = {
    AND?: SubjectScalarWhereInput | SubjectScalarWhereInput[]
    OR?: SubjectScalarWhereInput[]
    NOT?: SubjectScalarWhereInput | SubjectScalarWhereInput[]
    id?: StringFilter<"Subject"> | string
    firstName?: StringNullableFilter<"Subject"> | string | null
    lastName?: StringNullableFilter<"Subject"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"Subject"> | Date | string | null
    weight?: IntNullableFilter<"Subject"> | number | null
    height?: IntNullableFilter<"Subject"> | number | null
    account_id?: StringNullableFilter<"Subject"> | string | null
  }

  export type AccountCreateWithoutSubjectInput = {
    id?: string
    username: string
    password: string
  }

  export type AccountUncheckedCreateWithoutSubjectInput = {
    id?: string
    username: string
    password: string
  }

  export type AccountCreateOrConnectWithoutSubjectInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutSubjectInput, AccountUncheckedCreateWithoutSubjectInput>
  }

  export type IngestionCreateWithoutSubjectInput = {
    id?: string
    routeOfAdministration?: string | null
    dosage_unit?: string | null
    dosage_amount?: number | null
    isEstimatedDosage?: boolean | null
    date?: Date | string | null
    Substance?: SubstanceCreateNestedOneWithoutIngestionInput
    Stash?: StashCreateNestedOneWithoutIngestionsInput
  }

  export type IngestionUncheckedCreateWithoutSubjectInput = {
    id?: string
    substanceName?: string | null
    routeOfAdministration?: string | null
    dosage_unit?: string | null
    dosage_amount?: number | null
    isEstimatedDosage?: boolean | null
    date?: Date | string | null
    stashId?: string | null
  }

  export type IngestionCreateOrConnectWithoutSubjectInput = {
    where: IngestionWhereUniqueInput
    create: XOR<IngestionCreateWithoutSubjectInput, IngestionUncheckedCreateWithoutSubjectInput>
  }

  export type StashCreateWithoutSubjectInput = {
    id?: string
    addedDate?: Date | string | null
    expiration?: Date | string | null
    amount?: number | null
    price?: string | null
    vendor?: string | null
    description?: string | null
    purity?: number | null
    Substance: SubstanceCreateNestedOneWithoutStashInput
    ingestions?: IngestionCreateNestedManyWithoutStashInput
  }

  export type StashUncheckedCreateWithoutSubjectInput = {
    id?: string
    substance_id: string
    addedDate?: Date | string | null
    expiration?: Date | string | null
    amount?: number | null
    price?: string | null
    vendor?: string | null
    description?: string | null
    purity?: number | null
    ingestions?: IngestionUncheckedCreateNestedManyWithoutStashInput
  }

  export type StashCreateOrConnectWithoutSubjectInput = {
    where: StashWhereUniqueInput
    create: XOR<StashCreateWithoutSubjectInput, StashUncheckedCreateWithoutSubjectInput>
  }

  export type AccountUpsertWithoutSubjectInput = {
    update: XOR<AccountUpdateWithoutSubjectInput, AccountUncheckedUpdateWithoutSubjectInput>
    create: XOR<AccountCreateWithoutSubjectInput, AccountUncheckedCreateWithoutSubjectInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutSubjectInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutSubjectInput, AccountUncheckedUpdateWithoutSubjectInput>
  }

  export type AccountUpdateWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type AccountUncheckedUpdateWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type IngestionUpsertWithWhereUniqueWithoutSubjectInput = {
    where: IngestionWhereUniqueInput
    update: XOR<IngestionUpdateWithoutSubjectInput, IngestionUncheckedUpdateWithoutSubjectInput>
    create: XOR<IngestionCreateWithoutSubjectInput, IngestionUncheckedCreateWithoutSubjectInput>
  }

  export type IngestionUpdateWithWhereUniqueWithoutSubjectInput = {
    where: IngestionWhereUniqueInput
    data: XOR<IngestionUpdateWithoutSubjectInput, IngestionUncheckedUpdateWithoutSubjectInput>
  }

  export type IngestionUpdateManyWithWhereWithoutSubjectInput = {
    where: IngestionScalarWhereInput
    data: XOR<IngestionUpdateManyMutationInput, IngestionUncheckedUpdateManyWithoutSubjectInput>
  }

  export type IngestionScalarWhereInput = {
    AND?: IngestionScalarWhereInput | IngestionScalarWhereInput[]
    OR?: IngestionScalarWhereInput[]
    NOT?: IngestionScalarWhereInput | IngestionScalarWhereInput[]
    id?: StringFilter<"Ingestion"> | string
    substanceName?: StringNullableFilter<"Ingestion"> | string | null
    routeOfAdministration?: StringNullableFilter<"Ingestion"> | string | null
    dosage_unit?: StringNullableFilter<"Ingestion"> | string | null
    dosage_amount?: IntNullableFilter<"Ingestion"> | number | null
    isEstimatedDosage?: BoolNullableFilter<"Ingestion"> | boolean | null
    date?: DateTimeNullableFilter<"Ingestion"> | Date | string | null
    subject_id?: StringNullableFilter<"Ingestion"> | string | null
    stashId?: StringNullableFilter<"Ingestion"> | string | null
  }

  export type StashUpsertWithWhereUniqueWithoutSubjectInput = {
    where: StashWhereUniqueInput
    update: XOR<StashUpdateWithoutSubjectInput, StashUncheckedUpdateWithoutSubjectInput>
    create: XOR<StashCreateWithoutSubjectInput, StashUncheckedCreateWithoutSubjectInput>
  }

  export type StashUpdateWithWhereUniqueWithoutSubjectInput = {
    where: StashWhereUniqueInput
    data: XOR<StashUpdateWithoutSubjectInput, StashUncheckedUpdateWithoutSubjectInput>
  }

  export type StashUpdateManyWithWhereWithoutSubjectInput = {
    where: StashScalarWhereInput
    data: XOR<StashUpdateManyMutationInput, StashUncheckedUpdateManyWithoutSubjectInput>
  }

  export type StashScalarWhereInput = {
    AND?: StashScalarWhereInput | StashScalarWhereInput[]
    OR?: StashScalarWhereInput[]
    NOT?: StashScalarWhereInput | StashScalarWhereInput[]
    id?: StringFilter<"Stash"> | string
    owner_id?: StringFilter<"Stash"> | string
    substance_id?: StringFilter<"Stash"> | string
    addedDate?: DateTimeNullableFilter<"Stash"> | Date | string | null
    expiration?: DateTimeNullableFilter<"Stash"> | Date | string | null
    amount?: IntNullableFilter<"Stash"> | number | null
    price?: StringNullableFilter<"Stash"> | string | null
    vendor?: StringNullableFilter<"Stash"> | string | null
    description?: StringNullableFilter<"Stash"> | string | null
    purity?: IntNullableFilter<"Stash"> | number | null
  }

  export type RouteOfAdministrationCreateWithoutSubstanceInput = {
    id?: string
    name: string
    bioavailability: number
    dosage?: DosageCreateNestedManyWithoutRouteOfAdministrationInput
    phases?: PhaseCreateNestedManyWithoutRouteOfAdministrationInput
  }

  export type RouteOfAdministrationUncheckedCreateWithoutSubstanceInput = {
    id?: string
    name: string
    bioavailability: number
    dosage?: DosageUncheckedCreateNestedManyWithoutRouteOfAdministrationInput
    phases?: PhaseUncheckedCreateNestedManyWithoutRouteOfAdministrationInput
  }

  export type RouteOfAdministrationCreateOrConnectWithoutSubstanceInput = {
    where: RouteOfAdministrationWhereUniqueInput
    create: XOR<RouteOfAdministrationCreateWithoutSubstanceInput, RouteOfAdministrationUncheckedCreateWithoutSubstanceInput>
  }

  export type IngestionCreateWithoutSubstanceInput = {
    id?: string
    routeOfAdministration?: string | null
    dosage_unit?: string | null
    dosage_amount?: number | null
    isEstimatedDosage?: boolean | null
    date?: Date | string | null
    Subject?: SubjectCreateNestedOneWithoutIngestionsInput
    Stash?: StashCreateNestedOneWithoutIngestionsInput
  }

  export type IngestionUncheckedCreateWithoutSubstanceInput = {
    id?: string
    routeOfAdministration?: string | null
    dosage_unit?: string | null
    dosage_amount?: number | null
    isEstimatedDosage?: boolean | null
    date?: Date | string | null
    subject_id?: string | null
    stashId?: string | null
  }

  export type IngestionCreateOrConnectWithoutSubstanceInput = {
    where: IngestionWhereUniqueInput
    create: XOR<IngestionCreateWithoutSubstanceInput, IngestionUncheckedCreateWithoutSubstanceInput>
  }

  export type StashCreateWithoutSubstanceInput = {
    id?: string
    addedDate?: Date | string | null
    expiration?: Date | string | null
    amount?: number | null
    price?: string | null
    vendor?: string | null
    description?: string | null
    purity?: number | null
    Subject?: SubjectCreateNestedOneWithoutStashInput
    ingestions?: IngestionCreateNestedManyWithoutStashInput
  }

  export type StashUncheckedCreateWithoutSubstanceInput = {
    id?: string
    owner_id: string
    addedDate?: Date | string | null
    expiration?: Date | string | null
    amount?: number | null
    price?: string | null
    vendor?: string | null
    description?: string | null
    purity?: number | null
    ingestions?: IngestionUncheckedCreateNestedManyWithoutStashInput
  }

  export type StashCreateOrConnectWithoutSubstanceInput = {
    where: StashWhereUniqueInput
    create: XOR<StashCreateWithoutSubstanceInput, StashUncheckedCreateWithoutSubstanceInput>
  }

  export type SubstanceInteractionCreateWithoutSubstanceInput = {
    id?: string
  }

  export type SubstanceInteractionUncheckedCreateWithoutSubstanceInput = {
    id?: string
  }

  export type SubstanceInteractionCreateOrConnectWithoutSubstanceInput = {
    where: SubstanceInteractionWhereUniqueInput
    create: XOR<SubstanceInteractionCreateWithoutSubstanceInput, SubstanceInteractionUncheckedCreateWithoutSubstanceInput>
  }

  export type RouteOfAdministrationUpsertWithWhereUniqueWithoutSubstanceInput = {
    where: RouteOfAdministrationWhereUniqueInput
    update: XOR<RouteOfAdministrationUpdateWithoutSubstanceInput, RouteOfAdministrationUncheckedUpdateWithoutSubstanceInput>
    create: XOR<RouteOfAdministrationCreateWithoutSubstanceInput, RouteOfAdministrationUncheckedCreateWithoutSubstanceInput>
  }

  export type RouteOfAdministrationUpdateWithWhereUniqueWithoutSubstanceInput = {
    where: RouteOfAdministrationWhereUniqueInput
    data: XOR<RouteOfAdministrationUpdateWithoutSubstanceInput, RouteOfAdministrationUncheckedUpdateWithoutSubstanceInput>
  }

  export type RouteOfAdministrationUpdateManyWithWhereWithoutSubstanceInput = {
    where: RouteOfAdministrationScalarWhereInput
    data: XOR<RouteOfAdministrationUpdateManyMutationInput, RouteOfAdministrationUncheckedUpdateManyWithoutSubstanceInput>
  }

  export type RouteOfAdministrationScalarWhereInput = {
    AND?: RouteOfAdministrationScalarWhereInput | RouteOfAdministrationScalarWhereInput[]
    OR?: RouteOfAdministrationScalarWhereInput[]
    NOT?: RouteOfAdministrationScalarWhereInput | RouteOfAdministrationScalarWhereInput[]
    id?: StringFilter<"RouteOfAdministration"> | string
    substanceName?: StringNullableFilter<"RouteOfAdministration"> | string | null
    name?: StringFilter<"RouteOfAdministration"> | string
    bioavailability?: FloatFilter<"RouteOfAdministration"> | number
  }

  export type IngestionUpsertWithWhereUniqueWithoutSubstanceInput = {
    where: IngestionWhereUniqueInput
    update: XOR<IngestionUpdateWithoutSubstanceInput, IngestionUncheckedUpdateWithoutSubstanceInput>
    create: XOR<IngestionCreateWithoutSubstanceInput, IngestionUncheckedCreateWithoutSubstanceInput>
  }

  export type IngestionUpdateWithWhereUniqueWithoutSubstanceInput = {
    where: IngestionWhereUniqueInput
    data: XOR<IngestionUpdateWithoutSubstanceInput, IngestionUncheckedUpdateWithoutSubstanceInput>
  }

  export type IngestionUpdateManyWithWhereWithoutSubstanceInput = {
    where: IngestionScalarWhereInput
    data: XOR<IngestionUpdateManyMutationInput, IngestionUncheckedUpdateManyWithoutSubstanceInput>
  }

  export type StashUpsertWithWhereUniqueWithoutSubstanceInput = {
    where: StashWhereUniqueInput
    update: XOR<StashUpdateWithoutSubstanceInput, StashUncheckedUpdateWithoutSubstanceInput>
    create: XOR<StashCreateWithoutSubstanceInput, StashUncheckedCreateWithoutSubstanceInput>
  }

  export type StashUpdateWithWhereUniqueWithoutSubstanceInput = {
    where: StashWhereUniqueInput
    data: XOR<StashUpdateWithoutSubstanceInput, StashUncheckedUpdateWithoutSubstanceInput>
  }

  export type StashUpdateManyWithWhereWithoutSubstanceInput = {
    where: StashScalarWhereInput
    data: XOR<StashUpdateManyMutationInput, StashUncheckedUpdateManyWithoutSubstanceInput>
  }

  export type SubstanceInteractionUpsertWithWhereUniqueWithoutSubstanceInput = {
    where: SubstanceInteractionWhereUniqueInput
    update: XOR<SubstanceInteractionUpdateWithoutSubstanceInput, SubstanceInteractionUncheckedUpdateWithoutSubstanceInput>
    create: XOR<SubstanceInteractionCreateWithoutSubstanceInput, SubstanceInteractionUncheckedCreateWithoutSubstanceInput>
  }

  export type SubstanceInteractionUpdateWithWhereUniqueWithoutSubstanceInput = {
    where: SubstanceInteractionWhereUniqueInput
    data: XOR<SubstanceInteractionUpdateWithoutSubstanceInput, SubstanceInteractionUncheckedUpdateWithoutSubstanceInput>
  }

  export type SubstanceInteractionUpdateManyWithWhereWithoutSubstanceInput = {
    where: SubstanceInteractionScalarWhereInput
    data: XOR<SubstanceInteractionUpdateManyMutationInput, SubstanceInteractionUncheckedUpdateManyWithoutSubstanceInput>
  }

  export type SubstanceInteractionScalarWhereInput = {
    AND?: SubstanceInteractionScalarWhereInput | SubstanceInteractionScalarWhereInput[]
    OR?: SubstanceInteractionScalarWhereInput[]
    NOT?: SubstanceInteractionScalarWhereInput | SubstanceInteractionScalarWhereInput[]
    id?: StringFilter<"SubstanceInteraction"> | string
    substanceId?: StringNullableFilter<"SubstanceInteraction"> | string | null
  }

  export type DosageCreateWithoutRouteOfAdministrationInput = {
    id?: string
    intensivity: string
    amount_min: number
    amount_max: number
    unit: string
    perKilogram?: boolean
  }

  export type DosageUncheckedCreateWithoutRouteOfAdministrationInput = {
    id?: string
    intensivity: string
    amount_min: number
    amount_max: number
    unit: string
    perKilogram?: boolean
  }

  export type DosageCreateOrConnectWithoutRouteOfAdministrationInput = {
    where: DosageWhereUniqueInput
    create: XOR<DosageCreateWithoutRouteOfAdministrationInput, DosageUncheckedCreateWithoutRouteOfAdministrationInput>
  }

  export type PhaseCreateWithoutRouteOfAdministrationInput = {
    id?: string
    from?: number | null
    to?: number | null
    effects?: EffectCreateNestedManyWithoutPhaseInput
  }

  export type PhaseUncheckedCreateWithoutRouteOfAdministrationInput = {
    id?: string
    from?: number | null
    to?: number | null
    effects?: EffectUncheckedCreateNestedManyWithoutPhaseInput
  }

  export type PhaseCreateOrConnectWithoutRouteOfAdministrationInput = {
    where: PhaseWhereUniqueInput
    create: XOR<PhaseCreateWithoutRouteOfAdministrationInput, PhaseUncheckedCreateWithoutRouteOfAdministrationInput>
  }

  export type SubstanceCreateWithoutRoutes_of_administrationInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    Ingestion?: IngestionCreateNestedManyWithoutSubstanceInput
    Stash?: StashCreateNestedManyWithoutSubstanceInput
    SubstanceInteraction?: SubstanceInteractionCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceUncheckedCreateWithoutRoutes_of_administrationInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    Ingestion?: IngestionUncheckedCreateNestedManyWithoutSubstanceInput
    Stash?: StashUncheckedCreateNestedManyWithoutSubstanceInput
    SubstanceInteraction?: SubstanceInteractionUncheckedCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceCreateOrConnectWithoutRoutes_of_administrationInput = {
    where: SubstanceWhereUniqueInput
    create: XOR<SubstanceCreateWithoutRoutes_of_administrationInput, SubstanceUncheckedCreateWithoutRoutes_of_administrationInput>
  }

  export type DosageUpsertWithWhereUniqueWithoutRouteOfAdministrationInput = {
    where: DosageWhereUniqueInput
    update: XOR<DosageUpdateWithoutRouteOfAdministrationInput, DosageUncheckedUpdateWithoutRouteOfAdministrationInput>
    create: XOR<DosageCreateWithoutRouteOfAdministrationInput, DosageUncheckedCreateWithoutRouteOfAdministrationInput>
  }

  export type DosageUpdateWithWhereUniqueWithoutRouteOfAdministrationInput = {
    where: DosageWhereUniqueInput
    data: XOR<DosageUpdateWithoutRouteOfAdministrationInput, DosageUncheckedUpdateWithoutRouteOfAdministrationInput>
  }

  export type DosageUpdateManyWithWhereWithoutRouteOfAdministrationInput = {
    where: DosageScalarWhereInput
    data: XOR<DosageUpdateManyMutationInput, DosageUncheckedUpdateManyWithoutRouteOfAdministrationInput>
  }

  export type DosageScalarWhereInput = {
    AND?: DosageScalarWhereInput | DosageScalarWhereInput[]
    OR?: DosageScalarWhereInput[]
    NOT?: DosageScalarWhereInput | DosageScalarWhereInput[]
    id?: StringFilter<"Dosage"> | string
    intensivity?: StringFilter<"Dosage"> | string
    amount_min?: FloatFilter<"Dosage"> | number
    amount_max?: FloatFilter<"Dosage"> | number
    unit?: StringFilter<"Dosage"> | string
    perKilogram?: BoolFilter<"Dosage"> | boolean
    routeOfAdministrationId?: StringNullableFilter<"Dosage"> | string | null
  }

  export type PhaseUpsertWithWhereUniqueWithoutRouteOfAdministrationInput = {
    where: PhaseWhereUniqueInput
    update: XOR<PhaseUpdateWithoutRouteOfAdministrationInput, PhaseUncheckedUpdateWithoutRouteOfAdministrationInput>
    create: XOR<PhaseCreateWithoutRouteOfAdministrationInput, PhaseUncheckedCreateWithoutRouteOfAdministrationInput>
  }

  export type PhaseUpdateWithWhereUniqueWithoutRouteOfAdministrationInput = {
    where: PhaseWhereUniqueInput
    data: XOR<PhaseUpdateWithoutRouteOfAdministrationInput, PhaseUncheckedUpdateWithoutRouteOfAdministrationInput>
  }

  export type PhaseUpdateManyWithWhereWithoutRouteOfAdministrationInput = {
    where: PhaseScalarWhereInput
    data: XOR<PhaseUpdateManyMutationInput, PhaseUncheckedUpdateManyWithoutRouteOfAdministrationInput>
  }

  export type PhaseScalarWhereInput = {
    AND?: PhaseScalarWhereInput | PhaseScalarWhereInput[]
    OR?: PhaseScalarWhereInput[]
    NOT?: PhaseScalarWhereInput | PhaseScalarWhereInput[]
    id?: StringFilter<"Phase"> | string
    from?: IntNullableFilter<"Phase"> | number | null
    to?: IntNullableFilter<"Phase"> | number | null
    routeOfAdministrationId?: StringNullableFilter<"Phase"> | string | null
  }

  export type SubstanceUpsertWithoutRoutes_of_administrationInput = {
    update: XOR<SubstanceUpdateWithoutRoutes_of_administrationInput, SubstanceUncheckedUpdateWithoutRoutes_of_administrationInput>
    create: XOR<SubstanceCreateWithoutRoutes_of_administrationInput, SubstanceUncheckedCreateWithoutRoutes_of_administrationInput>
    where?: SubstanceWhereInput
  }

  export type SubstanceUpdateToOneWithWhereWithoutRoutes_of_administrationInput = {
    where?: SubstanceWhereInput
    data: XOR<SubstanceUpdateWithoutRoutes_of_administrationInput, SubstanceUncheckedUpdateWithoutRoutes_of_administrationInput>
  }

  export type SubstanceUpdateWithoutRoutes_of_administrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    Ingestion?: IngestionUpdateManyWithoutSubstanceNestedInput
    Stash?: StashUpdateManyWithoutSubstanceNestedInput
    SubstanceInteraction?: SubstanceInteractionUpdateManyWithoutSubstanceNestedInput
  }

  export type SubstanceUncheckedUpdateWithoutRoutes_of_administrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    Ingestion?: IngestionUncheckedUpdateManyWithoutSubstanceNestedInput
    Stash?: StashUncheckedUpdateManyWithoutSubstanceNestedInput
    SubstanceInteraction?: SubstanceInteractionUncheckedUpdateManyWithoutSubstanceNestedInput
  }

  export type RouteOfAdministrationCreateWithoutPhasesInput = {
    id?: string
    name: string
    bioavailability: number
    dosage?: DosageCreateNestedManyWithoutRouteOfAdministrationInput
    Substance?: SubstanceCreateNestedOneWithoutRoutes_of_administrationInput
  }

  export type RouteOfAdministrationUncheckedCreateWithoutPhasesInput = {
    id?: string
    substanceName?: string | null
    name: string
    bioavailability: number
    dosage?: DosageUncheckedCreateNestedManyWithoutRouteOfAdministrationInput
  }

  export type RouteOfAdministrationCreateOrConnectWithoutPhasesInput = {
    where: RouteOfAdministrationWhereUniqueInput
    create: XOR<RouteOfAdministrationCreateWithoutPhasesInput, RouteOfAdministrationUncheckedCreateWithoutPhasesInput>
  }

  export type EffectCreateWithoutPhaseInput = {
    id?: string
    name: string
    slug: string
    category?: string | null
    type?: string | null
    tags: string
    summary?: string | null
    description: string
    parameters: string
    see_also: string
    effectindex?: string | null
    psychonautwiki?: string | null
  }

  export type EffectUncheckedCreateWithoutPhaseInput = {
    id?: string
    name: string
    slug: string
    category?: string | null
    type?: string | null
    tags: string
    summary?: string | null
    description: string
    parameters: string
    see_also: string
    effectindex?: string | null
    psychonautwiki?: string | null
  }

  export type EffectCreateOrConnectWithoutPhaseInput = {
    where: EffectWhereUniqueInput
    create: XOR<EffectCreateWithoutPhaseInput, EffectUncheckedCreateWithoutPhaseInput>
  }

  export type RouteOfAdministrationUpsertWithoutPhasesInput = {
    update: XOR<RouteOfAdministrationUpdateWithoutPhasesInput, RouteOfAdministrationUncheckedUpdateWithoutPhasesInput>
    create: XOR<RouteOfAdministrationCreateWithoutPhasesInput, RouteOfAdministrationUncheckedCreateWithoutPhasesInput>
    where?: RouteOfAdministrationWhereInput
  }

  export type RouteOfAdministrationUpdateToOneWithWhereWithoutPhasesInput = {
    where?: RouteOfAdministrationWhereInput
    data: XOR<RouteOfAdministrationUpdateWithoutPhasesInput, RouteOfAdministrationUncheckedUpdateWithoutPhasesInput>
  }

  export type RouteOfAdministrationUpdateWithoutPhasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
    dosage?: DosageUpdateManyWithoutRouteOfAdministrationNestedInput
    Substance?: SubstanceUpdateOneWithoutRoutes_of_administrationNestedInput
  }

  export type RouteOfAdministrationUncheckedUpdateWithoutPhasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
    dosage?: DosageUncheckedUpdateManyWithoutRouteOfAdministrationNestedInput
  }

  export type EffectUpsertWithWhereUniqueWithoutPhaseInput = {
    where: EffectWhereUniqueInput
    update: XOR<EffectUpdateWithoutPhaseInput, EffectUncheckedUpdateWithoutPhaseInput>
    create: XOR<EffectCreateWithoutPhaseInput, EffectUncheckedCreateWithoutPhaseInput>
  }

  export type EffectUpdateWithWhereUniqueWithoutPhaseInput = {
    where: EffectWhereUniqueInput
    data: XOR<EffectUpdateWithoutPhaseInput, EffectUncheckedUpdateWithoutPhaseInput>
  }

  export type EffectUpdateManyWithWhereWithoutPhaseInput = {
    where: EffectScalarWhereInput
    data: XOR<EffectUpdateManyMutationInput, EffectUncheckedUpdateManyWithoutPhaseInput>
  }

  export type EffectScalarWhereInput = {
    AND?: EffectScalarWhereInput | EffectScalarWhereInput[]
    OR?: EffectScalarWhereInput[]
    NOT?: EffectScalarWhereInput | EffectScalarWhereInput[]
    id?: StringFilter<"Effect"> | string
    name?: StringFilter<"Effect"> | string
    slug?: StringFilter<"Effect"> | string
    category?: StringNullableFilter<"Effect"> | string | null
    type?: StringNullableFilter<"Effect"> | string | null
    tags?: StringFilter<"Effect"> | string
    summary?: StringNullableFilter<"Effect"> | string | null
    description?: StringFilter<"Effect"> | string
    parameters?: StringFilter<"Effect"> | string
    see_also?: StringFilter<"Effect"> | string
    effectindex?: StringNullableFilter<"Effect"> | string | null
    psychonautwiki?: StringNullableFilter<"Effect"> | string | null
  }

  export type RouteOfAdministrationCreateWithoutDosageInput = {
    id?: string
    name: string
    bioavailability: number
    phases?: PhaseCreateNestedManyWithoutRouteOfAdministrationInput
    Substance?: SubstanceCreateNestedOneWithoutRoutes_of_administrationInput
  }

  export type RouteOfAdministrationUncheckedCreateWithoutDosageInput = {
    id?: string
    substanceName?: string | null
    name: string
    bioavailability: number
    phases?: PhaseUncheckedCreateNestedManyWithoutRouteOfAdministrationInput
  }

  export type RouteOfAdministrationCreateOrConnectWithoutDosageInput = {
    where: RouteOfAdministrationWhereUniqueInput
    create: XOR<RouteOfAdministrationCreateWithoutDosageInput, RouteOfAdministrationUncheckedCreateWithoutDosageInput>
  }

  export type RouteOfAdministrationUpsertWithoutDosageInput = {
    update: XOR<RouteOfAdministrationUpdateWithoutDosageInput, RouteOfAdministrationUncheckedUpdateWithoutDosageInput>
    create: XOR<RouteOfAdministrationCreateWithoutDosageInput, RouteOfAdministrationUncheckedCreateWithoutDosageInput>
    where?: RouteOfAdministrationWhereInput
  }

  export type RouteOfAdministrationUpdateToOneWithWhereWithoutDosageInput = {
    where?: RouteOfAdministrationWhereInput
    data: XOR<RouteOfAdministrationUpdateWithoutDosageInput, RouteOfAdministrationUncheckedUpdateWithoutDosageInput>
  }

  export type RouteOfAdministrationUpdateWithoutDosageInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
    phases?: PhaseUpdateManyWithoutRouteOfAdministrationNestedInput
    Substance?: SubstanceUpdateOneWithoutRoutes_of_administrationNestedInput
  }

  export type RouteOfAdministrationUncheckedUpdateWithoutDosageInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
    phases?: PhaseUncheckedUpdateManyWithoutRouteOfAdministrationNestedInput
  }

  export type PhaseCreateWithoutEffectsInput = {
    id?: string
    from?: number | null
    to?: number | null
    RouteOfAdministration?: RouteOfAdministrationCreateNestedOneWithoutPhasesInput
  }

  export type PhaseUncheckedCreateWithoutEffectsInput = {
    id?: string
    from?: number | null
    to?: number | null
    routeOfAdministrationId?: string | null
  }

  export type PhaseCreateOrConnectWithoutEffectsInput = {
    where: PhaseWhereUniqueInput
    create: XOR<PhaseCreateWithoutEffectsInput, PhaseUncheckedCreateWithoutEffectsInput>
  }

  export type PhaseUpsertWithWhereUniqueWithoutEffectsInput = {
    where: PhaseWhereUniqueInput
    update: XOR<PhaseUpdateWithoutEffectsInput, PhaseUncheckedUpdateWithoutEffectsInput>
    create: XOR<PhaseCreateWithoutEffectsInput, PhaseUncheckedCreateWithoutEffectsInput>
  }

  export type PhaseUpdateWithWhereUniqueWithoutEffectsInput = {
    where: PhaseWhereUniqueInput
    data: XOR<PhaseUpdateWithoutEffectsInput, PhaseUncheckedUpdateWithoutEffectsInput>
  }

  export type PhaseUpdateManyWithWhereWithoutEffectsInput = {
    where: PhaseScalarWhereInput
    data: XOR<PhaseUpdateManyMutationInput, PhaseUncheckedUpdateManyWithoutEffectsInput>
  }

  export type SubjectCreateWithoutIngestionsInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    dateOfBirth?: Date | string | null
    weight?: number | null
    height?: number | null
    account?: AccountCreateNestedOneWithoutSubjectInput
    Stash?: StashCreateNestedManyWithoutSubjectInput
  }

  export type SubjectUncheckedCreateWithoutIngestionsInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    dateOfBirth?: Date | string | null
    weight?: number | null
    height?: number | null
    account_id?: string | null
    Stash?: StashUncheckedCreateNestedManyWithoutSubjectInput
  }

  export type SubjectCreateOrConnectWithoutIngestionsInput = {
    where: SubjectWhereUniqueInput
    create: XOR<SubjectCreateWithoutIngestionsInput, SubjectUncheckedCreateWithoutIngestionsInput>
  }

  export type SubstanceCreateWithoutIngestionInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    routes_of_administration?: RouteOfAdministrationCreateNestedManyWithoutSubstanceInput
    Stash?: StashCreateNestedManyWithoutSubstanceInput
    SubstanceInteraction?: SubstanceInteractionCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceUncheckedCreateWithoutIngestionInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    routes_of_administration?: RouteOfAdministrationUncheckedCreateNestedManyWithoutSubstanceInput
    Stash?: StashUncheckedCreateNestedManyWithoutSubstanceInput
    SubstanceInteraction?: SubstanceInteractionUncheckedCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceCreateOrConnectWithoutIngestionInput = {
    where: SubstanceWhereUniqueInput
    create: XOR<SubstanceCreateWithoutIngestionInput, SubstanceUncheckedCreateWithoutIngestionInput>
  }

  export type StashCreateWithoutIngestionsInput = {
    id?: string
    addedDate?: Date | string | null
    expiration?: Date | string | null
    amount?: number | null
    price?: string | null
    vendor?: string | null
    description?: string | null
    purity?: number | null
    Subject?: SubjectCreateNestedOneWithoutStashInput
    Substance: SubstanceCreateNestedOneWithoutStashInput
  }

  export type StashUncheckedCreateWithoutIngestionsInput = {
    id?: string
    owner_id: string
    substance_id: string
    addedDate?: Date | string | null
    expiration?: Date | string | null
    amount?: number | null
    price?: string | null
    vendor?: string | null
    description?: string | null
    purity?: number | null
  }

  export type StashCreateOrConnectWithoutIngestionsInput = {
    where: StashWhereUniqueInput
    create: XOR<StashCreateWithoutIngestionsInput, StashUncheckedCreateWithoutIngestionsInput>
  }

  export type SubjectUpsertWithoutIngestionsInput = {
    update: XOR<SubjectUpdateWithoutIngestionsInput, SubjectUncheckedUpdateWithoutIngestionsInput>
    create: XOR<SubjectCreateWithoutIngestionsInput, SubjectUncheckedCreateWithoutIngestionsInput>
    where?: SubjectWhereInput
  }

  export type SubjectUpdateToOneWithWhereWithoutIngestionsInput = {
    where?: SubjectWhereInput
    data: XOR<SubjectUpdateWithoutIngestionsInput, SubjectUncheckedUpdateWithoutIngestionsInput>
  }

  export type SubjectUpdateWithoutIngestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    account?: AccountUpdateOneWithoutSubjectNestedInput
    Stash?: StashUpdateManyWithoutSubjectNestedInput
  }

  export type SubjectUncheckedUpdateWithoutIngestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    account_id?: NullableStringFieldUpdateOperationsInput | string | null
    Stash?: StashUncheckedUpdateManyWithoutSubjectNestedInput
  }

  export type SubstanceUpsertWithoutIngestionInput = {
    update: XOR<SubstanceUpdateWithoutIngestionInput, SubstanceUncheckedUpdateWithoutIngestionInput>
    create: XOR<SubstanceCreateWithoutIngestionInput, SubstanceUncheckedCreateWithoutIngestionInput>
    where?: SubstanceWhereInput
  }

  export type SubstanceUpdateToOneWithWhereWithoutIngestionInput = {
    where?: SubstanceWhereInput
    data: XOR<SubstanceUpdateWithoutIngestionInput, SubstanceUncheckedUpdateWithoutIngestionInput>
  }

  export type SubstanceUpdateWithoutIngestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routes_of_administration?: RouteOfAdministrationUpdateManyWithoutSubstanceNestedInput
    Stash?: StashUpdateManyWithoutSubstanceNestedInput
    SubstanceInteraction?: SubstanceInteractionUpdateManyWithoutSubstanceNestedInput
  }

  export type SubstanceUncheckedUpdateWithoutIngestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routes_of_administration?: RouteOfAdministrationUncheckedUpdateManyWithoutSubstanceNestedInput
    Stash?: StashUncheckedUpdateManyWithoutSubstanceNestedInput
    SubstanceInteraction?: SubstanceInteractionUncheckedUpdateManyWithoutSubstanceNestedInput
  }

  export type StashUpsertWithoutIngestionsInput = {
    update: XOR<StashUpdateWithoutIngestionsInput, StashUncheckedUpdateWithoutIngestionsInput>
    create: XOR<StashCreateWithoutIngestionsInput, StashUncheckedCreateWithoutIngestionsInput>
    where?: StashWhereInput
  }

  export type StashUpdateToOneWithWhereWithoutIngestionsInput = {
    where?: StashWhereInput
    data: XOR<StashUpdateWithoutIngestionsInput, StashUncheckedUpdateWithoutIngestionsInput>
  }

  export type StashUpdateWithoutIngestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
    Subject?: SubjectUpdateOneWithoutStashNestedInput
    Substance?: SubstanceUpdateOneRequiredWithoutStashNestedInput
  }

  export type StashUncheckedUpdateWithoutIngestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner_id?: StringFieldUpdateOperationsInput | string
    substance_id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SubjectCreateWithoutStashInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    dateOfBirth?: Date | string | null
    weight?: number | null
    height?: number | null
    account?: AccountCreateNestedOneWithoutSubjectInput
    Ingestions?: IngestionCreateNestedManyWithoutSubjectInput
  }

  export type SubjectUncheckedCreateWithoutStashInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    dateOfBirth?: Date | string | null
    weight?: number | null
    height?: number | null
    account_id?: string | null
    Ingestions?: IngestionUncheckedCreateNestedManyWithoutSubjectInput
  }

  export type SubjectCreateOrConnectWithoutStashInput = {
    where: SubjectWhereUniqueInput
    create: XOR<SubjectCreateWithoutStashInput, SubjectUncheckedCreateWithoutStashInput>
  }

  export type SubstanceCreateWithoutStashInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    routes_of_administration?: RouteOfAdministrationCreateNestedManyWithoutSubstanceInput
    Ingestion?: IngestionCreateNestedManyWithoutSubstanceInput
    SubstanceInteraction?: SubstanceInteractionCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceUncheckedCreateWithoutStashInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    routes_of_administration?: RouteOfAdministrationUncheckedCreateNestedManyWithoutSubstanceInput
    Ingestion?: IngestionUncheckedCreateNestedManyWithoutSubstanceInput
    SubstanceInteraction?: SubstanceInteractionUncheckedCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceCreateOrConnectWithoutStashInput = {
    where: SubstanceWhereUniqueInput
    create: XOR<SubstanceCreateWithoutStashInput, SubstanceUncheckedCreateWithoutStashInput>
  }

  export type IngestionCreateWithoutStashInput = {
    id?: string
    routeOfAdministration?: string | null
    dosage_unit?: string | null
    dosage_amount?: number | null
    isEstimatedDosage?: boolean | null
    date?: Date | string | null
    Subject?: SubjectCreateNestedOneWithoutIngestionsInput
    Substance?: SubstanceCreateNestedOneWithoutIngestionInput
  }

  export type IngestionUncheckedCreateWithoutStashInput = {
    id?: string
    substanceName?: string | null
    routeOfAdministration?: string | null
    dosage_unit?: string | null
    dosage_amount?: number | null
    isEstimatedDosage?: boolean | null
    date?: Date | string | null
    subject_id?: string | null
  }

  export type IngestionCreateOrConnectWithoutStashInput = {
    where: IngestionWhereUniqueInput
    create: XOR<IngestionCreateWithoutStashInput, IngestionUncheckedCreateWithoutStashInput>
  }

  export type SubjectUpsertWithoutStashInput = {
    update: XOR<SubjectUpdateWithoutStashInput, SubjectUncheckedUpdateWithoutStashInput>
    create: XOR<SubjectCreateWithoutStashInput, SubjectUncheckedCreateWithoutStashInput>
    where?: SubjectWhereInput
  }

  export type SubjectUpdateToOneWithWhereWithoutStashInput = {
    where?: SubjectWhereInput
    data: XOR<SubjectUpdateWithoutStashInput, SubjectUncheckedUpdateWithoutStashInput>
  }

  export type SubjectUpdateWithoutStashInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    account?: AccountUpdateOneWithoutSubjectNestedInput
    Ingestions?: IngestionUpdateManyWithoutSubjectNestedInput
  }

  export type SubjectUncheckedUpdateWithoutStashInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    account_id?: NullableStringFieldUpdateOperationsInput | string | null
    Ingestions?: IngestionUncheckedUpdateManyWithoutSubjectNestedInput
  }

  export type SubstanceUpsertWithoutStashInput = {
    update: XOR<SubstanceUpdateWithoutStashInput, SubstanceUncheckedUpdateWithoutStashInput>
    create: XOR<SubstanceCreateWithoutStashInput, SubstanceUncheckedCreateWithoutStashInput>
    where?: SubstanceWhereInput
  }

  export type SubstanceUpdateToOneWithWhereWithoutStashInput = {
    where?: SubstanceWhereInput
    data: XOR<SubstanceUpdateWithoutStashInput, SubstanceUncheckedUpdateWithoutStashInput>
  }

  export type SubstanceUpdateWithoutStashInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routes_of_administration?: RouteOfAdministrationUpdateManyWithoutSubstanceNestedInput
    Ingestion?: IngestionUpdateManyWithoutSubstanceNestedInput
    SubstanceInteraction?: SubstanceInteractionUpdateManyWithoutSubstanceNestedInput
  }

  export type SubstanceUncheckedUpdateWithoutStashInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routes_of_administration?: RouteOfAdministrationUncheckedUpdateManyWithoutSubstanceNestedInput
    Ingestion?: IngestionUncheckedUpdateManyWithoutSubstanceNestedInput
    SubstanceInteraction?: SubstanceInteractionUncheckedUpdateManyWithoutSubstanceNestedInput
  }

  export type IngestionUpsertWithWhereUniqueWithoutStashInput = {
    where: IngestionWhereUniqueInput
    update: XOR<IngestionUpdateWithoutStashInput, IngestionUncheckedUpdateWithoutStashInput>
    create: XOR<IngestionCreateWithoutStashInput, IngestionUncheckedCreateWithoutStashInput>
  }

  export type IngestionUpdateWithWhereUniqueWithoutStashInput = {
    where: IngestionWhereUniqueInput
    data: XOR<IngestionUpdateWithoutStashInput, IngestionUncheckedUpdateWithoutStashInput>
  }

  export type IngestionUpdateManyWithWhereWithoutStashInput = {
    where: IngestionScalarWhereInput
    data: XOR<IngestionUpdateManyMutationInput, IngestionUncheckedUpdateManyWithoutStashInput>
  }

  export type SubstanceCreateWithoutSubstanceInteractionInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    routes_of_administration?: RouteOfAdministrationCreateNestedManyWithoutSubstanceInput
    Ingestion?: IngestionCreateNestedManyWithoutSubstanceInput
    Stash?: StashCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceUncheckedCreateWithoutSubstanceInteractionInput = {
    id?: string
    name: string
    common_names: string
    brand_names: string
    substitutive_name?: string | null
    systematic_name?: string | null
    unii?: string | null
    cas_number?: string | null
    inchi_key?: string | null
    iupac?: string | null
    smiles?: string | null
    psychoactive_class: string
    chemical_class?: string | null
    description?: string | null
    routes_of_administration?: RouteOfAdministrationUncheckedCreateNestedManyWithoutSubstanceInput
    Ingestion?: IngestionUncheckedCreateNestedManyWithoutSubstanceInput
    Stash?: StashUncheckedCreateNestedManyWithoutSubstanceInput
  }

  export type SubstanceCreateOrConnectWithoutSubstanceInteractionInput = {
    where: SubstanceWhereUniqueInput
    create: XOR<SubstanceCreateWithoutSubstanceInteractionInput, SubstanceUncheckedCreateWithoutSubstanceInteractionInput>
  }

  export type SubstanceUpsertWithoutSubstanceInteractionInput = {
    update: XOR<SubstanceUpdateWithoutSubstanceInteractionInput, SubstanceUncheckedUpdateWithoutSubstanceInteractionInput>
    create: XOR<SubstanceCreateWithoutSubstanceInteractionInput, SubstanceUncheckedCreateWithoutSubstanceInteractionInput>
    where?: SubstanceWhereInput
  }

  export type SubstanceUpdateToOneWithWhereWithoutSubstanceInteractionInput = {
    where?: SubstanceWhereInput
    data: XOR<SubstanceUpdateWithoutSubstanceInteractionInput, SubstanceUncheckedUpdateWithoutSubstanceInteractionInput>
  }

  export type SubstanceUpdateWithoutSubstanceInteractionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routes_of_administration?: RouteOfAdministrationUpdateManyWithoutSubstanceNestedInput
    Ingestion?: IngestionUpdateManyWithoutSubstanceNestedInput
    Stash?: StashUpdateManyWithoutSubstanceNestedInput
  }

  export type SubstanceUncheckedUpdateWithoutSubstanceInteractionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    common_names?: StringFieldUpdateOperationsInput | string
    brand_names?: StringFieldUpdateOperationsInput | string
    substitutive_name?: NullableStringFieldUpdateOperationsInput | string | null
    systematic_name?: NullableStringFieldUpdateOperationsInput | string | null
    unii?: NullableStringFieldUpdateOperationsInput | string | null
    cas_number?: NullableStringFieldUpdateOperationsInput | string | null
    inchi_key?: NullableStringFieldUpdateOperationsInput | string | null
    iupac?: NullableStringFieldUpdateOperationsInput | string | null
    smiles?: NullableStringFieldUpdateOperationsInput | string | null
    psychoactive_class?: StringFieldUpdateOperationsInput | string
    chemical_class?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    routes_of_administration?: RouteOfAdministrationUncheckedUpdateManyWithoutSubstanceNestedInput
    Ingestion?: IngestionUncheckedUpdateManyWithoutSubstanceNestedInput
    Stash?: StashUncheckedUpdateManyWithoutSubstanceNestedInput
  }

  export type SubjectUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    Ingestions?: IngestionUpdateManyWithoutSubjectNestedInput
    Stash?: StashUpdateManyWithoutSubjectNestedInput
  }

  export type SubjectUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    Ingestions?: IngestionUncheckedUpdateManyWithoutSubjectNestedInput
    Stash?: StashUncheckedUpdateManyWithoutSubjectNestedInput
  }

  export type SubjectUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type IngestionUpdateWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    Substance?: SubstanceUpdateOneWithoutIngestionNestedInput
    Stash?: StashUpdateOneWithoutIngestionsNestedInput
  }

  export type IngestionUncheckedUpdateWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stashId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IngestionUncheckedUpdateManyWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stashId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StashUpdateWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
    Substance?: SubstanceUpdateOneRequiredWithoutStashNestedInput
    ingestions?: IngestionUpdateManyWithoutStashNestedInput
  }

  export type StashUncheckedUpdateWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance_id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
    ingestions?: IngestionUncheckedUpdateManyWithoutStashNestedInput
  }

  export type StashUncheckedUpdateManyWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance_id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type RouteOfAdministrationUpdateWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
    dosage?: DosageUpdateManyWithoutRouteOfAdministrationNestedInput
    phases?: PhaseUpdateManyWithoutRouteOfAdministrationNestedInput
  }

  export type RouteOfAdministrationUncheckedUpdateWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
    dosage?: DosageUncheckedUpdateManyWithoutRouteOfAdministrationNestedInput
    phases?: PhaseUncheckedUpdateManyWithoutRouteOfAdministrationNestedInput
  }

  export type RouteOfAdministrationUncheckedUpdateManyWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    bioavailability?: FloatFieldUpdateOperationsInput | number
  }

  export type IngestionUpdateWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    Subject?: SubjectUpdateOneWithoutIngestionsNestedInput
    Stash?: StashUpdateOneWithoutIngestionsNestedInput
  }

  export type IngestionUncheckedUpdateWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
    stashId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IngestionUncheckedUpdateManyWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
    stashId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StashUpdateWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
    Subject?: SubjectUpdateOneWithoutStashNestedInput
    ingestions?: IngestionUpdateManyWithoutStashNestedInput
  }

  export type StashUncheckedUpdateWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner_id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
    ingestions?: IngestionUncheckedUpdateManyWithoutStashNestedInput
  }

  export type StashUncheckedUpdateManyWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    owner_id?: StringFieldUpdateOperationsInput | string
    addedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiration?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purity?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SubstanceInteractionUpdateWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type SubstanceInteractionUncheckedUpdateWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type SubstanceInteractionUncheckedUpdateManyWithoutSubstanceInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type DosageUpdateWithoutRouteOfAdministrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    intensivity?: StringFieldUpdateOperationsInput | string
    amount_min?: FloatFieldUpdateOperationsInput | number
    amount_max?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    perKilogram?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DosageUncheckedUpdateWithoutRouteOfAdministrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    intensivity?: StringFieldUpdateOperationsInput | string
    amount_min?: FloatFieldUpdateOperationsInput | number
    amount_max?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    perKilogram?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DosageUncheckedUpdateManyWithoutRouteOfAdministrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    intensivity?: StringFieldUpdateOperationsInput | string
    amount_min?: FloatFieldUpdateOperationsInput | number
    amount_max?: FloatFieldUpdateOperationsInput | number
    unit?: StringFieldUpdateOperationsInput | string
    perKilogram?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PhaseUpdateWithoutRouteOfAdministrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
    effects?: EffectUpdateManyWithoutPhaseNestedInput
  }

  export type PhaseUncheckedUpdateWithoutRouteOfAdministrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
    effects?: EffectUncheckedUpdateManyWithoutPhaseNestedInput
  }

  export type PhaseUncheckedUpdateManyWithoutRouteOfAdministrationInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type EffectUpdateWithoutPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    see_also?: StringFieldUpdateOperationsInput | string
    effectindex?: NullableStringFieldUpdateOperationsInput | string | null
    psychonautwiki?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EffectUncheckedUpdateWithoutPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    see_also?: StringFieldUpdateOperationsInput | string
    effectindex?: NullableStringFieldUpdateOperationsInput | string | null
    psychonautwiki?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EffectUncheckedUpdateManyWithoutPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    parameters?: StringFieldUpdateOperationsInput | string
    see_also?: StringFieldUpdateOperationsInput | string
    effectindex?: NullableStringFieldUpdateOperationsInput | string | null
    psychonautwiki?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PhaseUpdateWithoutEffectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
    RouteOfAdministration?: RouteOfAdministrationUpdateOneWithoutPhasesNestedInput
  }

  export type PhaseUncheckedUpdateWithoutEffectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
    routeOfAdministrationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PhaseUncheckedUpdateManyWithoutEffectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    from?: NullableIntFieldUpdateOperationsInput | number | null
    to?: NullableIntFieldUpdateOperationsInput | number | null
    routeOfAdministrationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IngestionUpdateWithoutStashInput = {
    id?: StringFieldUpdateOperationsInput | string
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    Subject?: SubjectUpdateOneWithoutIngestionsNestedInput
    Substance?: SubstanceUpdateOneWithoutIngestionNestedInput
  }

  export type IngestionUncheckedUpdateWithoutStashInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IngestionUncheckedUpdateManyWithoutStashInput = {
    id?: StringFieldUpdateOperationsInput | string
    substanceName?: NullableStringFieldUpdateOperationsInput | string | null
    routeOfAdministration?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_unit?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_amount?: NullableIntFieldUpdateOperationsInput | number | null
    isEstimatedDosage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subject_id?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}