import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: 'http://localhost:3000/v1/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }
  
  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile || !profile.name || !profile.emails || !profile.id) {
      return done(new Error('Perfil do Google está incompleto ou inválido'), false);
    }

     const email = profile.emails[0].value;

  // Verifica se o email é da faculdade
 const allowedDomain = process.env.ALLOWED_GOOGLE_DOMAIN || '@iesb.edu.br';
if (!email.endsWith(allowedDomain)) {
  return done(new Error(`Apenas contas institucionais ${allowedDomain} são permitidas`), false);
}


    const user = {
      google_id: profile.id,
      email: profile.emails[0].value,
      userName: profile.emails[0].value.split('@')[0],
      name: profile.displayName,
      access_token: accessToken, 
      role: 'USER',
      AuthProvider: 'google',
    };

    done(null, user);
  }
}