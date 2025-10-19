import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { TestModuleCreateDto } from "./test-module-create.dto";
import { TestModuleModel } from "../../models/test-module.model";
import { ITestModuleUpdate } from "../../test-module.interface";

export class TestModuleUpdateDto
  extends IntersectionType(
    PickType(TestModuleModel, ["id"]),
    OmitType(PartialType(TestModuleCreateDto), [])
  )
  implements ITestModuleUpdate {}

