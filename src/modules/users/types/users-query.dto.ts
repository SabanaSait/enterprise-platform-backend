import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortDirection {
  ASC = 'asc',
  Desc = 'desc',
}

export enum SortKey {
  NAME = 'name',
  EMAIL = 'email',
  ROLE = 'role',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
}

export class UsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  pageSize?: number;

  @IsOptional()
  @IsEnum(SortKey)
  sortBy?: SortKey;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;

  @IsOptional()
  @IsString()
  search?: string;
}
