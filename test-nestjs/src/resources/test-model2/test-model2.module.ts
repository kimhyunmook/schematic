import { Module } from "@nestjs/common";
import { TestModel2Service } from "./test-model2.service";
import { TestModel2Controller } from "./controllers/test-model2.controller";

@Module({
  controllers: [TestModel2Controller],
  providers: [TestModel2Service],
  exports: [TestModel2Service],
})
export class TestModel2Module {}

