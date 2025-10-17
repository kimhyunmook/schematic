import { AnimalModel } from "../../models/animal.model";
import { IAnimalCreate } from "../../animal.interface";
import { CreateDtoFromModel } from "src/common/helpers/create-from-model.dto";

export class AnimalCreateDto
  extends CreateDtoFromModel({
    model: AnimalModel,
    pick: ["email"],
    optional: ["name"],
  })
  implements IAnimalCreate {}

