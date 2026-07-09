import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service.js';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard.js';
import { AuthUser } from '../../common/decorators/authuser.decorator.js';
import { TransferBodyDto } from './dto/transfer-body.dto.js';

@UseGuards(JwtAccessGuard)
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('transfer')
  transfer(@AuthUser() authUser: Express.User, @Body() body: TransferBodyDto) {
    return this.balanceService.transfer(authUser, body);
  }

  @Post('nullify-all')
  nullifyBalances() {
    return this.balanceService.nullifyBalances();
  }
}
