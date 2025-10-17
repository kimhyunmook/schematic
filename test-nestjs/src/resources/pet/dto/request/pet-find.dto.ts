import { PickType } from "@nestjs/swagger";
import { PetModel } from "../../models/pet.model";
import {
  IPetFindUnique,
  IPetFindMany,
} from "../../pet.interface";
import { createPaginationDto } from "src/common/helpers/find-pagination.dto";
import { CREATED_AT } from "src/common/enums/created-at.enum";

/** Unique */
export class PetFindUniqueDto
  extends PickType(PetModel, ["id"])
  implements IPetFindUnique {}

/** List */
export class PetFindManyDto
  extends createPaginationDto([CREATED_AT])
  implements IPetFindMany {}

