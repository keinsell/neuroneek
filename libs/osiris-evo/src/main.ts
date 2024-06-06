import {nanoid} from 'nanoid'

// TODO: Should be immutable dataclass
export class Subject
    {
        public readonly username: string

        constructor(
            subject: {
                username: string
            }
        )
            {
                this.username = subject.username
            }
    }

// TODO: Should be immutable dataclass
export class Substance
    {
        /** Unique identifier of Substance, should be starting with "substance_" */
        public readonly id: string
        public readonly name: string

        constructor(substance: { id?: string, name: string })
            {
                this.id   = substance.id ?? `substance_${nanoid(16)}`
                this.name = substance.name
            }
    }

// TODO: This should be immutable dataclass
// TODO: Ffs TypeScript do not have Result types therefore Constructor will throw a error when wrong unit is provided,
// it's not acceptable for me so there should be static method which will provide typesafe validation and error.
/** Dosage is built with amount of unit, to ensure data consistency around
 * ingestion with known dosage and unknown dosage this class was created.
 *
 * @example
 * ```ts
 * const albertHoffman = new Dosage({ unit: "ug", amount: 200 })
 * ```
 */
export class Dosage
    {
        public readonly unitName: string
        public readonly massAmount: number

        constructor(
            dosage: {
                // TODO: What units should be typed/supported? Overall most of shit is in miligrams but when we look at
                // the alcohol there we have mililiters with concentration that can be converted into grams. This class
                // is representation of dosage and I think we should assume all dosages will be in mass units.
                unit: string
                amount: number
            }
        )
            {
                this.massAmount = dosage.amount
                this.unitName   = dosage.unit
            }
    }

// TODO: Probably should be immutable class as initial properties aren't changed at all and additional data can be
// calculated on methods once class was validated and created.
export class Ingestion
    {
        // TODO: What about combined ingestions or mixtures of substances - let's say quilla mind where there are like
        // 50 substances in one cap. Resolving issue described before will be huge stepforward as this is blocker to a
        // lot of features such as supplement reminding.
        public readonly substance: Substance
        public readonly dosage: Dosage
        public readonly subject: Subject
        public readonly ingestedAt: Date
        public readonly notes: string | null

        constructor(ingestion: {
            substance: Substance,
            dosage: Dosage
            subject: Subject
            ingestedAt?: Date
            notes?: string
        })
            {
                this.dosage     = ingestion.dosage
                this.substance  = ingestion.substance
                this.subject    = ingestion.subject
                this.ingestedAt = ingestion.ingestedAt || new Date()
                this.notes      = ingestion.notes ?? null

                // TODO: During creation of ingestion we should classify dosage (ex. light, common)
                // TODO: During creation of ingestion we should calculate all of the data that we may want to get from
                // ingestion, Eventually this can be done with usage of methods to save compute and calculate shit on
                // the fly.
            }
    }

// Example...

const keinsell    = new Subject({username: 'keinsell'})
const caffeine    = new Substance({name: 'caffeine'})
const cupOfCoffee = new Ingestion({
                                      subject  : keinsell,
                                      substance: caffeine,
                                      dosage   : new Dosage({unit: 'mg', amount: 80}),
                                      notes    : 'Standard cup of my favourite coffee just to get started with application that allow me to track when I drink my favourite coffee. #trippingOnTrimetyloxamines'
                                  })

console.log(cupOfCoffee)
