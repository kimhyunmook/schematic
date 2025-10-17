import { AnimalCreateDto } from "./dto/request/animal-create.dto";
import { AnimalFindManyDto, AnimalFindUniqueDto } from "./dto/request/animal-find.dto";
import { AnimalUpdateDto } from "./dto/request/animal-update.dto";

/**
 * Service layer interfaces
 * 서비스 계층에서 사용하는 순수 타입 정의
 * DTO와 독립적으로 비즈니스 로직 계층의 계약 정의
 */

/** Create */
export type IAnimalCreate = AnimalCreateDto;

/** Find */
export type IAnimalFindUnique = AnimalFindUniqueDto;

export type IAnimalFindMany = AnimalFindManyDto;

/** Update */
export type IAnimalUpdate = AnimalUpdateDto;

