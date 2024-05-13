export type SearchSubstanceResponse = {
	elapsed: Elapsed;
	hits:    Hit[];
	count:   number;
}

export type Elapsed = {
	raw:       number;
	formatted: string;
}

export type Hit = {
	id:       string;
	score:    number;
	document: SubstanceDocument;
}

export type SubstanceDocument = {
	id:          string;
	name:        string;
	commonNames: string[];
}
