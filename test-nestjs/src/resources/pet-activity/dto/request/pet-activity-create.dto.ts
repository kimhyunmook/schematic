import { PetActivityModel } from "../../models/pet-activity.model";
import { IPetActivityCreate } from "../../pet-activity.interface";
import { CreateDtoFromModel } from "src/common/helpers/create-from-model.dto";

export class PetActivityCreateDto
  extends CreateDtoFromModel({
    model: PetActivityModel,
    pick: ["petId", "activityType"],
    optional: ["description", "duration"],
  })
  implements IPetActivityCreate {}

