import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { PetActivityCreateDto } from "./pet-activity-create.dto";
import { PetActivityModel } from "../../models/pet-activity.model";
import { IPetActivityUpdate } from "../../pet-activity.interface";

export class PetActivityUpdateDto
  extends IntersectionType(
    PickType(PetActivityModel, ["id"]),
    OmitType(PartialType(PetActivityCreateDto), [])
  )
  implements IPetActivityUpdate {}

