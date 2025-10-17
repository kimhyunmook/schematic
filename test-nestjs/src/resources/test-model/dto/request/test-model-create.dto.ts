import { TestModelModel } from "../../models/test-model.model";
import { ITestModelCreate } from "../../test-model.interface";
import { CreateDtoFromModel } from "src/common/helpers/create-from-model.dto";

export class TestModelCreateDto
  extends CreateDtoFromModel({
    model: TestModelModel,
    pick: ["name"],
    optional: ["email"],
  })
  implements ITestModelCreate {}

