import { TestModel2Model } from "../../models/test-model2.model";
import { ITestModel2Create } from "../../test-model2.interface";
import { CreateDtoFromModel } from "src/common/helpers/create-from-model.dto";

export class TestModel2CreateDto
  extends CreateDtoFromModel({
    model: TestModel2Model,
    pick: ["email"],
    optional: ["name"],
  })
  implements ITestModel2Create {}

