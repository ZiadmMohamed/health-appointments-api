import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDto {
    @ApiProperty({ example: 'Health Benefits of Regular Exercise' })
    @IsString()
    @IsNotEmpty()
  title: string;
    @ApiProperty({ example: 'Regular exercise can help improve cardiovascular health, boost mood, and enhance overall well-being.' })
    @IsString()
    @IsNotEmpty()
  content: string;
}