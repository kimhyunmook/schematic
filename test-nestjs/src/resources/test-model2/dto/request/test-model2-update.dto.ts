import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { TestModel2CreateDto } from "./test-model2-create.dto";
import { TestModel2Model } from "../../models/test-model2.model";
import { ITestModel2Update } from "../../test-model2.interface";

export class TestModel2UpdateDto
  extends IntersectionType(
    PickType(TestModel2Model, ["id"]),
    OmitType(PartialType(TestModel2CreateDto), [])
  )
  implements ITestModel2Update {}

