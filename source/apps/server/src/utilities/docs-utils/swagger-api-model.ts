import { SetMetadata } from '@nestjs/common'



interface IMetadata
  {
	 name : string;
	 description : string;
  }


// This store will keep each DTO's custom metadata in a { DTOName: metadata } format.
const modelMetadataStore : Record<string, IMetadata> = {}

export const ApiModel = ({
									name,
									description,
								 } : { name? : string; description? : string } = {}) : ClassDecorator => {
  return (target : Function) => {
	 if ( !name || !description )
		{
		  return
		}

	 const metadata : IMetadata = {
		name,
		description,
	 }

	 SetMetadata( 'API_MODEL_METADATA', metadata )( target )
	 
	 modelMetadataStore[ target.name ] = metadata
  }
}


// Export this function, we will use it later.
export function getMetadataStore()
  {
	 return modelMetadataStore
  }