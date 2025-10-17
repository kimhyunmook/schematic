import { PickType } from "@nestjs/swagger";
import { AnimalModel } from "../../models/animal.model";
import {
  IAnimalFindUnique,
  IAnimalFindMany,
} from "../../animal.interface";
import { createPaginationDto } from "src/common/helpers/find-pagination.dto";
import { CREATED_AT } from "src/common/enums/created-at.enum";

/** Unique */
export class AnimalFindUniqueDto
  extends PickType(AnimalModel, ["id"])
  implements IAnimalFindUnique {}

/** List */
export class AnimalFindManyDto
  extends createPaginationDto([CREATED_AT])
  implements IAnimalFindMany {}

