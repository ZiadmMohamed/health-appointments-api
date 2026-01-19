import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  // Swagger setup
  // if (appConfig?.env !== 'production') {
  //   const documentBuilder = SwaggerModule.createDocument(
  //     app,
  //     swaggerConfigApp(),
  //   );
  //   SwaggerModule.setup('docs', app, documentBuilder);
  // }

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
