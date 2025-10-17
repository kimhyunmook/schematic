import { OmitType } from "@nestjs/swagger";
import { TestModel3Model } from "../../models/test-model3.model";
import { ResponseDto } from "src/common/dto/response.dto";
import { ListResponseDto } from "src/common/dto/list-response.dto";

class TestModel3ResponseData extends OmitType(TestModel3Model, []) {}

/** Unique */
export class TestModel3FindUniqueResponseDto extends ResponseDto {
  data: TestModel3ResponseData;
}

/** List */
export class TestModel3FindManyResponseDto extends ListResponseDto {
  data: TestModel3ResponseData[];
}

