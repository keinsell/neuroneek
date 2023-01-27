import { RouteOfAdministrationClassification } from '../substance/route-of-administration-table/route-of-administration-classification.js'
import { DosageUnit } from '../substance/route-of-administration-table/route-of-administration/dosage-table/dosage-unit/dosage-unit.js'
import { Substance } from '../substance/substance.js'

export interface IngestionProperties {
	substance?: Substance
	dosage?: DosageUnit
	routeOfAdministration?: RouteOfAdministrationClassification
	// TODO: Should this be refactored into DosageUnit (or maybe separate Dosage class)?
	purity?: number
	// TODO: Should this be refactored into DosageUnit (or maybe separate Dosage class)?
	/** This field should be marked if subject isn't sure about measured dosage, thus this should not be taken in exact calculations. */
	isDosageEstimate?: boolean
	// TODO: Add forms of substances ex. powder, liquid, capsule, gel, etc.
	form?: string
	date?: Date
	location?: string
	notes?: string
}
