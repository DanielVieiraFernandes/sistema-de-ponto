import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from './pagination.dto';
import { validateSync } from 'class-validator';

export const Pagination = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const dto = plainToInstance(PaginationDto, query, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return dto;
  },
);
