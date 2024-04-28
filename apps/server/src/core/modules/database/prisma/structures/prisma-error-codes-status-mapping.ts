export type PrismaErrorCodesStatusMapping = {
  [ key : string ] : | number | {
	 statusCode? : number; errorMessage? : string;
  };
};