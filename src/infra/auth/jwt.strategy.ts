import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { z } from 'zod';

const payloadSchema = z.object({
  sub: z.string().uuid(),
  role: z.enum(['EMPLOYEE', 'ADMIN']),
});

export type UserPayload = z.infer<typeof payloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = Buffer.from(env.get('JWT_PUBLIC_KEY'), 'base64');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
    });
  }

  async validate(payload: UserPayload) {
    return payloadSchema.parse(payload);
  }
}
