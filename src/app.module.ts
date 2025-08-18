import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
        OrderModule, ProductModule, UsersModule, AuthModule],
  controllers: [OrderController, AppController],
  providers: [OrderService, AppService],
})
export class AppModule {}
