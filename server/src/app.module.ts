import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration, { validateEnv } from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';
// ── content & catalog resources ──
import { ReviewsModule } from './reviews/reviews.module';
import { BrandsModule } from './brands/brands.module';
import { NewsModule } from './news/news.module';
import { CasesModule } from './cases/cases.module';
import { DocumentsModule } from './documents/documents.module';
import { TeamModule } from './team/team.module';
import { ProductsModule } from './products/products.module';
import { CatalogTypesModule } from './catalog-types/catalog-types.module';
import { CatalogSpecsModule } from './catalog-specs/catalog-specs.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { SettingsModule } from './settings/settings.module';
import { MediaModule } from './media/media.module';
import { CrmModule } from './crm/crm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MediaModule,
    ReviewsModule,
    BrandsModule,
    NewsModule,
    CasesModule,
    DocumentsModule,
    TeamModule,
    CatalogTypesModule,
    CatalogSpecsModule,
    ProductsModule,
    SubmissionsModule,
    SettingsModule,
    CrmModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
