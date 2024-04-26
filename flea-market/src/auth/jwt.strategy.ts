import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey123'
        })
    }

    async validate(payload: { id: string, username: string }): Promise<User> {
        const { id, username } = payload;
        const user = await this.userRepository.findOne({ id, username });

        if (user) {
            return user;
        }

        throw new UnauthorizedException();
    }
}