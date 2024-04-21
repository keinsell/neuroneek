import { UUID }           from '../../../common/libraries/identification/index.js'
import { AuditActor }     from '../value-object/audit-actor.js'
import { AuditOperation } from '../value-object/audit-operation.js'
import { AuditResource }  from '../value-object/audit-resource.js'



export interface AuditLog
  {
	 id : UUID
	 /* "Who?" | The actor who performed the action. See below for the description of its type. */
	 actor : AuditActor
	 operation : AuditOperation
	 resource : AuditResource
	 date : Date
  }