import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TokenService } from 'src/module/token/token.service';

@Injectable()
export class IdGuard implements CanActivate {

  constructor(
    private readonly tokenService: TokenService,
  ) { }

  async checkJWT(req: Request): Promise<boolean> {

    let tokenString = req.headers.authorization

    if (!tokenString)
      return false

    let tokenArr = tokenString.split(' ')

    if (tokenArr.length != 2)
      return false

    let token = await this.tokenService.decode(tokenArr[1])

    req.params['id'] = token.id.toString()

    return true
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    let req: Request = context.switchToHttp().getRequest()

    return this.checkJWT(req);
  }
}
