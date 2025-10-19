import { Module } from "@nestjs/common";
import { PetActivityService } from "./pet-activity.service";
import { PetActivityController } from "./controllers/pet-activity.controller";

@Module({
  controllers: [PetActivityController],
  providers: [PetActivityService],
  exports: [PetActivityService],
})
export class PetActivityModule {}

