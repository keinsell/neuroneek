import {
  EvaluationContext,
  Hook,
  JsonValue,
  Logger,
  Paradigm,
  Provider,
  ProviderMetadata,
  ProviderStatus,
  ResolutionDetails,
} from '@openfeature/server-sdk'



export abstract class FeatureFlagProvider
  implements Provider
  {
	 public abstract events : any


	 public abstract initialize(context? : EvaluationContext) : Promise<void>


	 public readonly abstract metadata : ProviderMetadata


	 public abstract onClose() : Promise<void>


	 public readonly abstract runsOn : Paradigm
	 public readonly abstract status : ProviderStatus
	 public readonly abstract hooks : Hook[]


	 public abstract resolveBooleanEvaluation(
		flagKey : string,
		defaultValue : boolean,
		context : EvaluationContext,
		logger : Logger,
	 ) : Promise<ResolutionDetails<boolean>>


	 public abstract resolveNumberEvaluation(
		flagKey : string,
		defaultValue : number,
		context : EvaluationContext,
		logger : Logger,
	 ) : Promise<ResolutionDetails<number>>


	 public abstract resolveObjectEvaluation<T extends JsonValue>(
		flagKey : string,
		defaultValue : T,
		context : EvaluationContext,
		logger : Logger,
	 ) : Promise<ResolutionDetails<T>>


	 public abstract resolveStringEvaluation(
		flagKey : string,
		defaultValue : string,
		context : EvaluationContext,
		logger : Logger,
	 ) : Promise<ResolutionDetails<string>>

  }