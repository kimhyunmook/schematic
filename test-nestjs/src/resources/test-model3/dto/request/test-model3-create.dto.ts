import { TestModel3Model } from "../../models/test-model3.model";
import { ITestModel3Create } from "../../test-model3.interface";
import { CreateDtoFromModel } from "src/common/helpers/create-from-model.dto";

export class TestModel3CreateDto
  extends CreateDtoFromModel({
    model: TestModel3Model,
    pick: ["name"],
    optional: ["email"],
  })
  implements ITestModel3Create {}

