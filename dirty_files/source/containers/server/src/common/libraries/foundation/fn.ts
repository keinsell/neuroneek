/*
 * MIT License
 *
 * Copyright (c) 2023 Jakub Olan <keinsell@protonmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * A no-arg function, returning T.
 */
export type NoArgFunction<T> = () => T;

/**
 * A single arg function from A to B.
 */
export type SingleArgFunction<A, B> = (a : A) => B;

/**
 * A 2-arg function from A,B to C.
 */
export type DoubleArgFunction<A, B, C> = (
  a : A,
  b : B,
) => C;

/**
 * A 3-arg function from A,B,C to D.
 */
export type TripleArgFunction<A, B, C, D> = (
  a : A,
  b : B,
  c : C,
) => D;

/**
 * A 4-arg function from A,B,C,D to E.
 */
export type QuadrupleArgFunction<A, B, C, D, E> = (
  a : A,
  b : B,
  c : C,
  d : D,
) => E;

/**
 * A 5-arg function from A,B,C,D,E to F.
 */
export type QuintupleArgFunction<A, B, C, D, E, F> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
) => F;

/**
 * A 6-arg function from A,B,C,D,E,F to G.
 */
export type SextupleArgFunction<A, B, C, D, E, F, G> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
) => G;

/**
 * A 7-arg function from A,B,C,D,E,F,G to H.
 */
export type SeptupleArgFunction<A, B, C, D, E, F, G, H> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  g : G,
) => H;

/**
 * A 8-arg function from A,B,C,D,E,F,G,H to I.
 */
export type OctupleArgFunction<A, B, C, D, E, F, G, H, I> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  g : G,
  h : H,
) => I;

/**
 * A 9-arg function from A,B,C,D,E,F,G,H,I to J.
 */
export type NonupleArgFunction<A, B, C, D, E, F, G, H, I, J> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  g : G,
  h : H,
  i : I,
) => J;

/**
 * A 10-arg function from A,B,C,D,E,F,G,H,I,J to K.
 */
export type DecupleArgFunction<A, B, C, D, E, F, G, H, I, J, K> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  g : G,
  h : H,
  i : I,
  j : J,
) => K;

export type UnaryOptFunction<A, B> = (
  a : A,
  ...xs : any[]
) => B;

export type BinaryOptFunction<A, B, C> = (
  a : A,
  b : B,
  ...xs : any[]
) => C;

export type TernaryOptFunction<A, B, C, D> = (
  a : A,
  b : B,
  c : C,
  ...xs : any[]
) => D;

export type QuaternaryOptFunction<A, B, C, D, E> = (
  a : A,
  b : B,
  c : C,
  d : D,
  ...xs : any[]
) => E;

export type QuinaryOptFunction<A, B, C, D, E, F> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  ...xs : any[]
) => F;

export type SenaryOptFunction<A, B, C, D, E, F, G> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  ...xs : any[]
) => G;

export type SeptenaryOptFunction<A, B, C, D, E, F, G, H> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  g : G,
  ...xs : any[]
) => H;

export type OctonaryOptFunction<A, B, C, D, E, F, G, H, I> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  g : G,
  h : H,
  ...xs : any[]
) => I;

export type NonaryOptFunction<A, B, C, D, E, F, G, H, I, J> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  g : G,
  h : H,
  i : I,
  ...xs : any[]
) => J;

export type DenaryOptFunction<A, B, C, D, E, F, G, H, I, J, K> = (
  a : A,
  b : B,
  c : C,
  d : D,
  e : E,
  f : F,
  g : G,
  h : H,
  i : I,
  j : J,
  ...xs : any[]
) => K;

/**
 * An untyped vararg arg function to type T.
 */
export type FnAny<T> = (...xs : any[]) => T;

/**
 * A typed vararg arg function from A to B.
 */
export type FnAnyT<A, B> = (...xs : A[]) => B;

/**
 * 1-arg function with arg of type A and return type B (defaults
 * to A)
 */
export type FnU<A, B = A> = SingleArgFunction<A, B>;

/**
 * 2-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU2<A, B = A> = DoubleArgFunction<A, A, B>;

/**
 * 3-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU3<A, B = A> = TripleArgFunction<A, A, A, B>;

/**
 * 4-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU4<A, B = A> = QuadrupleArgFunction<A, A, A, A, B>;

/**
 * 5-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU5<A, B = A> = QuintupleArgFunction<A, A, A, A, A, B>;

/**
 * 6-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU6<A, B = A> = SextupleArgFunction<A, A, A, A, A, A, B>;

/**
 * 7-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU7<A, B = A> = SeptupleArgFunction<A, A, A, A, A, A, A, B>;

/**
 * 8-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU8<A, B = A> = OctupleArgFunction<A, A, A, A, A, A, A, A, B>;

/**
 * 9-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU9<A, B = A> = NonupleArgFunction<A, A, A, A, A, A, A, A, A, B>;

/**
 * 10-arg function with all args uniformly of type A and return type B (defaults
 * to A)
 */
export type FnU10<A, B = A> = DecupleArgFunction<A, A, A, A, A, A, A, A, A, A, B>;

export type FnN = FnU<number>;

export type FnN2 = FnU2<number>;

export type FnN3 = FnU3<number>;

export type FnN4 = FnU4<number>;

export type FnN5 = FnU5<number>;

export type FnN6 = FnU6<number>;

export type FnN7 = FnU7<number>;

export type FnN8 = FnU8<number>;

export type FnN9 = FnU9<number>;

export type FnN10 = FnU10<number>;

/**
 * Identity function: `(x) => x`
 *
 * @param x
 */
export const identity = <T>(x : T) => x

/**
 * Zero-arg function always returning true.
 */
export const always = () => true

/**
 * Zero-arg function always returning false.
 */
export const never = () => false