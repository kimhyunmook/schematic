import { PetModel } from "../../models/pet.model";
import { IPetCreate } from "../../pet.interface";
import { CreateDtoFromModel } from "src/common/helpers/create-from-model.dto";

export class PetCreateDto
  extends CreateDtoFromModel({
    model: PetModel,
    pick: ["name", "species", "ownerId"],
    optional: ["breed", "age"],
  })
  implements IPetCreate {}

