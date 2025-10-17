import { Module } from "@nestjs/common";
import { TestModel3Service } from "./test-model3.service";
import { TestModel3Controller } from "./controllers/test-model3.controller";

@Module({
  controllers: [TestModel3Controller],
  providers: [TestModel3Service],
  exports: [TestModel3Service],
})
export class TestModel3Module {}

