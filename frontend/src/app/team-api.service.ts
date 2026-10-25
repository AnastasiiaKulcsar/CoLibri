import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CreateTeamRequest, MemberDto, ProfileDto, TeamDto } from './models';
import { environment } from '../environments/environment';

const demoTeam: TeamDto = {
  id: 'campus-lab',
  name: 'Team Campus Lab',
  projectName: 'CampusCycle',
  members: [
    { id: 'lena', name: 'Lena Hoffmann', email: 'lena.hoffmann@hs-berlin.de', phone: '+49 30 12345678', role: 'Admin', projectRole: 'Product Owner', initials: 'LH' },
    { id: 'amir', name: 'Amir Yilmaz', email: 'amir.yilmaz@hs-berlin.de', phone: '+49 30 23456781', role: 'Mitglied', projectRole: 'Developer', initials: 'AY' },
    { id: 'mia', name: 'Mia Schneider', email: 'mia.schneider@hs-berlin.de', phone: '+49 30 34567812', role: 'Mitglied', projectRole: 'Scrum Master', initials: 'MS' },
    { id: 'jonas', name: 'Jonas Weber', email: 'jonas.weber@hs-berlin.de', phone: '+49 30 45678123', role: 'Mitglied', projectRole: 'Developer', initials: 'JW' },
  ],
};

const demoProfile: ProfileDto = {
  name: 'Lena Hoffmann',
  email: 'lena.hoffmann@hs-berlin.de',
  phone: '+49 30 12345678',
  course: 'Medieninformatik',
  semester: '5. Semester',
  university: 'HS Berlin',
  about: 'Ich mag gute UX und Ideen, die unseren Campus nachhaltiger machen.',
};

@Injectable({ providedIn: 'root' })
export class TeamApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;
  private teamState = structuredClone(demoTeam);
  private profileState = { ...demoProfile };

  getTeam(): Observable<TeamDto> {
    return environment.useMockData ? of(structuredClone(this.teamState)) : this.http.get<TeamDto>(`${this.baseUrl}/teams/current`);
  }

  createTeam(request: CreateTeamRequest): Observable<TeamDto> {
    if (!environment.useMockData) return this.http.post<TeamDto>(`${this.baseUrl}/teams`, request);
    this.teamState = {
      ...this.teamState,
      name: request.name,
      projectName: request.projectName,
      members: [
        this.teamState.members[0],
        ...request.members.map((member, index) => {
          const name = member.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
          return {
            id: `demo-${index}-${member.email}`,
            name,
            email: member.email,
            phone: '',
            role: member.role,
            projectRole: 'Developer' as const,
            initials: name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase(),
          };
        }),
      ],
    };
    return of(structuredClone(this.teamState));
  }

  getProfile(): Observable<ProfileDto> {
    return environment.useMockData ? of({ ...this.profileState }) : this.http.get<ProfileDto>(`${this.baseUrl}/profile`);
  }

  saveProfile(profile: ProfileDto): Observable<ProfileDto> {
    if (!environment.useMockData) return this.http.put<ProfileDto>(`${this.baseUrl}/profile`, profile);
    this.profileState = { ...profile };
    this.teamState.members[0] = { ...this.teamState.members[0], name: profile.name, email: profile.email, phone: profile.phone };
    return of({ ...this.profileState });
  }

  updateMember(member: MemberDto): Observable<MemberDto> {
    if (!environment.useMockData) return this.http.put<MemberDto>(`${this.baseUrl}/teams/current/members/${member.id}`, member);
    this.teamState.members = this.teamState.members.map((item) => item.id === member.id ? { ...member } : item);
    return of({ ...member });
  }

  deleteMember(memberId: string): Observable<void> {
    if (!environment.useMockData) return this.http.delete<void>(`${this.baseUrl}/teams/current/members/${memberId}`);
    this.teamState.members = this.teamState.members.filter((member) => member.id !== memberId);
    return of(void 0);
  }

  inviteMember(email: string, role: MemberDto['role']): Observable<void> {
    if (!environment.useMockData) return this.http.post<void>(`${this.baseUrl}/teams/current/invitations`, { email, role });
    return of(void 0);
  }
}
