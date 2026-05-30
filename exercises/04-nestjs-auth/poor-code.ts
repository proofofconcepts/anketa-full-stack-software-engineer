import { Controller, Post, Body } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  private users: any[] = [
    { id: 1, email: 'admin@test.com', password: 'admin123' },
  ];

  @Post('login')
  login(@Body() body: any) {
    const user = this.users.find(
      (u) => u.email === body.email && u.password === body.password,
    );

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const token = jwt.sign({ userId: user.id }, 'secret123', {
      expiresIn: '1h',
    });

    return { token };
  }

  @Post('register')
  register(@Body() body: any) {
    const exists = this.users.find((u) => u.email === body.email);
    if (exists) {
      return { error: 'User already exists' };
    }

    const newUser = {
      id: this.users.length + 1,
      email: body.email,
      password: body.password,
    };
    this.users.push(newUser);

    return { message: 'User created', user: newUser };
  }
}
