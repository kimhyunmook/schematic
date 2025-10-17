import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { TestModelCreateDto } from "./test-model-create.dto";
import { TestModelModel } from "../../models/test-model.model";
import { ITestModelUpdate } from "../../test-model.interface";

export class TestModelUpdateDto
  extends IntersectionType(
    PickType(TestModelModel, ["id"]),
    OmitType(PartialType(TestModelCreateDto), [])
  )
  implements ITestModelUpdate {}

