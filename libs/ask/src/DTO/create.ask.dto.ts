import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class createAskDto{
    @ApiProperty()
    @IsString()
    title : string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    question : string;
}