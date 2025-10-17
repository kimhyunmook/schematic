import { OmitType } from "@nestjs/swagger";
import { TestModel2Model } from "../../models/test-model2.model";
import { ResponseDto } from "src/common/dto/response.dto";
import { ListResponseDto } from "src/common/dto/list-response.dto";

class TestModel2ResponseData extends OmitType(TestModel2Model, []) {}

/** Unique */
export class TestModel2FindUniqueResponseDto extends ResponseDto {
  data: TestModel2ResponseData;
}

/** List */
export class TestModel2FindManyResponseDto extends ListResponseDto {
  data: TestModel2ResponseData[];
}

