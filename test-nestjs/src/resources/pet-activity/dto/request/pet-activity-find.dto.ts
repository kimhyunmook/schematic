import { PickType } from "@nestjs/swagger";
import { PetActivityModel } from "../../models/pet-activity.model";
import {
  IPetActivityFindUnique,
  IPetActivityFindMany,
} from "../../pet-activity.interface";
import { createPaginationDto } from "src/common/helpers/find-pagination.dto";
import { CREATED_AT } from "src/common/enums/created-at.enum";

/** Unique */
export class PetActivityFindUniqueDto
  extends PickType(PetActivityModel, ["id"])
  implements IPetActivityFindUnique {}

/** List */
export class PetActivityFindManyDto
  extends createPaginationDto([CREATED_AT])
  implements IPetActivityFindMany {}

