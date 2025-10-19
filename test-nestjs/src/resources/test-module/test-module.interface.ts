import { TestModuleCreateDto } from "./dto/request/test-module-create.dto";
import { TestModuleFindManyDto, TestModuleFindUniqueDto } from "./dto/request/test-module-find.dto";
import { TestModuleUpdateDto } from "./dto/request/test-module-update.dto";

/**
 * Service layer interfaces
 * 서비스 계층에서 사용하는 순수 타입 정의
 * DTO와 독립적으로 비즈니스 로직 계층의 계약 정의
 */

/** Create */
export type ITestModuleCreate = TestModuleCreateDto;

/** Find */
export type ITestModuleFindUnique = TestModuleFindUniqueDto;

export type ITestModuleFindMany = TestModuleFindManyDto;

/** Update */
export type ITestModuleUpdate = TestModuleUpdateDto;

