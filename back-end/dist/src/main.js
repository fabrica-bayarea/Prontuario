"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./modules/app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const common_2 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    const logger = new common_2.Logger('Bootstrap');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
    app.use(cookieParser());
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Prontuário - IESB')
        .setDescription('Documentação')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    })
        .setExternalDoc('Documentação adicional', 'https://github.com/fabrica-bayarea/novoTrello')
        .setContact('BayArea', '', 'nde.ads@iesb.br')
        .setLicense('License GPL-3.0', 'https://github.com/fabrica-bayarea/novoTrello?tab=GPL-3.0-1-ov-file')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Prontuário - IESB',
        customfavIcon: 'https://www.iesb.br/content/themes/iesb-chleba-themosis/favicon.png',
        customCss: `
      .swagger-ui .topbar { 
        background: transparent linear-gradient(96deg, #CC0000 0%, #F00B54 100%) 0% 0% no-repeat padding-box; 
      }
    `,
        swaggerOptions: {
            persistAuthorization: true,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'head'],
        },
    });
    const port = configService.get('PORT') ?? 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map