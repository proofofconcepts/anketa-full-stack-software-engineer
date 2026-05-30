import { Controller, Get, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  private users = [
    { id: 1, name: 'Andres Rivero', role: 'Frontend Developer' },
    { id: 2, name: 'Carlos Perez', role: 'Backend Developer' },
    { id: 3, name: 'Gabriel Silva', role: 'Full Stack Developer' },
    { id: 4, name: 'Maria Gomez', role: 'Mobile Developer' },
  ];

  @Get('search')
  searchUsers(@Query('q') query: string) {
    const results = this.users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      count: results.length,
      data: results,
    };
  }
}
