import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { AnimalCreateDto } from "./animal-create.dto";
import { AnimalModel } from "../../models/animal.model";
import { IAnimalUpdate } from "../../animal.interface";

export class AnimalUpdateDto
  extends IntersectionType(
    PickType(AnimalModel, ["id"]),
    OmitType(PartialType(AnimalCreateDto), [])
  )
  implements IAnimalUpdate {}

