import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { articleStatus } from "../entity/article.entity";

export class UpdateArticleDto{
    @ApiProperty({ example: 'Health Benefits of Regular Exercise' })
    @IsString()
    @IsNotEmpty()
    title?:string;
    @ApiProperty({ example: 'Regular exercise can help improve cardiovascular health, boost mood, and enhance overall well-being.' })
     @IsString()
    @IsNotEmpty()
    
    content?:string;
    @IsEnum(articleStatus)
    status?:articleStatus
}