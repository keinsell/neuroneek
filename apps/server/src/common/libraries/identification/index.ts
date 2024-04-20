import type { ApiPropertyOptions } from '@nestjs/swagger'
import type { TagContainer }       from '../opaque.js'
import { ULID }                    from './ulid/ulid.js'



export type TypeID<T extends string = string> =
  `${T}_${string}`
  & TagContainer<T>

export type CUID = string;

export type UUIDV4 = `${string}-${string}-${string}-${string}-${string}`;
export type UUIDV5 = `${string}-${string}-${string}-${string}-${string}`;
export type UUIDV7 = `${string}-${string}-${string}-${string}-${string}`;
export const NIL_UUID = '00000000-0000-0000-0000-000000000000'

export type KSUID = string;

export type UUID =
  UUIDV4
  | UUIDV5
  | UUIDV7
  | typeof NIL_UUID

export type UniqueIdentifier =
  string
  | number
  | TypeID
  | CUID
  | UUID
  | ULID
  | KSUID;

export const UniqueIdentifierApiSpecification : ApiPropertyOptions = {
  name        : 'id',
  description : 'Unique identifier of given resource.',
}