import { TestModuleModel } from "../../models/test-module.model";
import { ITestModuleCreate } from "../../test-module.interface";
import { CreateDtoFromModel } from "src/common/helpers/create-from-model.dto";

export class TestModuleCreateDto
  extends CreateDtoFromModel({
    model: TestModuleModel,
    pick: ["name"],
    optional: ["email", "age"],
  })
  implements ITestModuleCreate {}

