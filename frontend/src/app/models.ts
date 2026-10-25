export type TeamRole = 'Admin' | 'Mitglied' | 'Betrachter';
export type ProjectRole = 'Product Owner' | 'Developer' | 'Scrum Master';

export interface MemberDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  projectRole: ProjectRole;
  initials: string;
}

export interface TeamDto {
  id: string;
  name: string;
  projectName: string;
  members: MemberDto[];
}

export interface ProfileDto {
  name: string;
  email: string;
  phone: string;
  course: string;
  semester: string;
  university: string;
  about: string;
}

export interface CreateTeamRequest {
  name: string;
  projectName: string;
  members: Array<Pick<MemberDto, 'email' | 'role'>>;
}
