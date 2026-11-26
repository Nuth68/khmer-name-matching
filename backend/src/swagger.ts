import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configures and mounts the OpenAPI document and Swagger UI at `/api`
 * (with JSON/YAML specs at `/api-json` and `/api-yaml`).
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Khmer Name Matching API')
    .setDescription('API documentation for the Khmer Name Matching backend')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory, {
    customSiteTitle: 'Khmer Name Matching API Docs',
  });
}
