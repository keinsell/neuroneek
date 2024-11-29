import { WriteRepository } from './write-repository.js'



/**
 * `Repository` is a class that serves as a template for repository classes.
 * A repository class serves as a bridge between your application and the data source.
 * This base repository uses a generic type `T`, allowing it to store, access, and manipulate data of any type.
 * Extend this base class in your specific data repositories, providing more concrete implementations or additional
 * methods as your application requires.
 *
 * ### Repository Semantics
 *
 * - `list...` methods should return `Promise<T[]>`
 * - `get...` methods should return `Promise<T>`
 * - `create...` methods should return `Promise<T>`
 * - `update...` methods should return `Promise<T>`
 * - `delete...` methods should return `Promise<void>`
 * - `count...` methods should return `Promise<number>`
 * - `find...` methods should return `Promise<T | null>`
 * - `aggregate<T>...` methods should return `Promise<unknown>`
 *
 * If method is performing dedicated query with predefined conditions, it should return `Promise<T[]>` or
 * `Promise<T>` depending on the query, method should be named `list...` or `get...` respectively and should have
 * information about the query in its name. For example: `listByStatus`, `listByRole`, `listByStatusAndRole`.
 *
 * @template T The type of objects that this repository will manage.
 *
 * @class
 */
export abstract class Repository<T>
  extends WriteRepository<T> {}