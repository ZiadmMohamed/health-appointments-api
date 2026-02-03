import { DocumentBuilder } from '@nestjs/swagger';

export interface ISwaggerConfig {
  title: string;
  description: string;
  version: string;
  tag?: string;
  bearerAuth?: boolean;
}

export const setSwaggerConfig = (config: ISwaggerConfig) => {
  const builder = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version);

  if (config.tag) {
    builder.addTag(config.tag);
  }

  if (config.bearerAuth !== false) {
    builder.addBearerAuth();
  }

  return builder.build();
};
