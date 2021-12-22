import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/interface/token.interface';

@Injectable()
export class TokenService {

    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async encode(token: Token): Promise<string> {
        let tokenString = this.jwtService.sign(token)
        return tokenString
    }

    async decode(tokenString: string): Promise<Token> {
        let token = this.jwtService.verify<Token>(tokenString)

        return token
    }
}
