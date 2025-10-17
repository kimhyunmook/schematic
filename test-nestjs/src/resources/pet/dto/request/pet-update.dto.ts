import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { PetCreateDto } from "./pet-create.dto";
import { PetModel } from "../../models/pet.model";
import { IPetUpdate } from "../../pet.interface";

export class PetUpdateDto
  extends IntersectionType(
    PickType(PetModel, ["id"]),
    OmitType(PartialType(PetCreateDto), [])
  )
  implements IPetUpdate {}

