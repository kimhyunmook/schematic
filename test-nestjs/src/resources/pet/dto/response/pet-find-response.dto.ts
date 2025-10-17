import { OmitType } from "@nestjs/swagger";
import { PetModel } from "../../models/pet.model";
import { ResponseDto } from "src/common/dto/response.dto";
import { ListResponseDto } from "src/common/dto/list-response.dto";

class PetResponseData extends OmitType(PetModel, []) {}

/** Unique */
export class PetFindUniqueResponseDto extends ResponseDto {
  data: PetResponseData;
}

/** List */
export class PetFindManyResponseDto extends ListResponseDto {
  data: PetResponseData[];
}

