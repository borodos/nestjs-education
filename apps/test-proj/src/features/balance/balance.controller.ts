import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { AuthUser } from '../../common/decorators/authuser.decorator';
import { TransferBodyDto } from './dto/transfer-body.dto';

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
