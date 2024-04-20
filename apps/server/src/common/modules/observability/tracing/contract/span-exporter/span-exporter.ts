import { ExportResult } from '@opentelemetry/core'
import { ReadableSpan } from '@opentelemetry/sdk-trace-base/build/src/export/ReadableSpan.js'



export interface SpanExporter
  {
	 /**
	  * Called to export sampled {@link ReadableSpan}s.
	  * @param spans the list of sampled Spans to be exported.
	  */
	 export(
		spans : ReadableSpan[],
		resultCallback : (result : ExportResult) => void,
	 ) : void;

	 /** Stops the exporter. */
	 shutdown() : Promise<void>;

	 /** Immediately export all spans */
	 forceFlush?() : Promise<void>;
  }