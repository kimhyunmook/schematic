import { PetCreateDto } from "./dto/request/pet-create.dto";
import { PetFindManyDto, PetFindUniqueDto } from "./dto/request/pet-find.dto";
import { PetUpdateDto } from "./dto/request/pet-update.dto";

/**
 * Service layer interfaces
 * 서비스 계층에서 사용하는 순수 타입 정의
 * DTO와 독립적으로 비즈니스 로직 계층의 계약 정의
 */

/** Create */
export type IPetCreate = PetCreateDto;

/** Find */
export type IPetFindUnique = PetFindUniqueDto;

export type IPetFindMany = PetFindManyDto;

/** Update */
export type IPetUpdate = PetUpdateDto;

