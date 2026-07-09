import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService extends ConsoleLogger {
  protected getColorByLogLevel(level: LogLevel): (text: string) => string {
    if ((level as string) === 'log') {
      return (text) => `\x1B[96m${text}\x1B[39m`;
    }
    return super.getColorByLogLevel(level);
  }
}
