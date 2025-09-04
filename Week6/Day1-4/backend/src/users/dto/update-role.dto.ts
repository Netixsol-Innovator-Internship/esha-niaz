import { IsEnum, IsMongoId } from 'class-validator';
import { Role } from '../../common/types/role.enum';

export class UpdateRoleDto {
  @IsMongoId()
  userId: string;

  @IsEnum(Role)
  role: Role;
}
