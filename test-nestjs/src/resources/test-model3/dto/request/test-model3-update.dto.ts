import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { TestModel3CreateDto } from "./test-model3-create.dto";
import { TestModel3Model } from "../../models/test-model3.model";
import { ITestModel3Update } from "../../test-model3.interface";

export class TestModel3UpdateDto
  extends IntersectionType(
    PickType(TestModel3Model, ["id"]),
    OmitType(PartialType(TestModel3CreateDto), [])
  )
  implements ITestModel3Update {}

