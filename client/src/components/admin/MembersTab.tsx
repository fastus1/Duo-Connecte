import { Loader2, Users, Plus, MoreVertical, UserX, Ban } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UseMutationResult } from '@tanstack/react-query';

interface PaidMember {
  id: string;
  email: string;
  paymentDate: string;
  paymentPlan: string | null;
  amountPaid: string | null;
  couponUsed: string | null;
}

interface MembersTabProps {
  paidMembersData: { members: PaidMember[] } | undefined;
  paidMembersLoading: boolean;
  newMemberEmail: string;
  setNewMemberEmail: (value: string) => void;
  addMemberMutation: UseMutationResult<any, Error, string, unknown>;
  deleteMemberMutation: UseMutationResult<any, Error, string, unknown>;
  deleteUserCompleteMutation: UseMutationResult<any, Error, string, unknown>;
  onAddMember: () => void;
}

export function MembersTab({
  paidMembersData,
  paidMembersLoading,
  newMemberEmail,
  setNewMemberEmail,
  addMemberMutation,
  deleteMemberMutation,
  deleteUserCompleteMutation,
  onAddMember,
}: MembersTabProps) {
  return (
    <Card data-testid="card-paid-members">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-teal-500/10">
            <Users className="h-5 w-5 text-teal-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Membres Payants</CardTitle>
            <CardDescription>
              Gérez manuellement les accès payants (le webhook Circle.so ajoute automatiquement les nouveaux paiements)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="email@exemple.com"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAddMember()}
            data-testid="input-new-member-email"
          />
          <Button
            onClick={onAddMember}
            disabled={addMemberMutation.isPending || !newMemberEmail.trim()}
            data-testid="button-add-member"
          >
            {addMemberMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="border rounded-md divide-y max-h-96 overflow-y-auto">
          {paidMembersLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            </div>
          ) : paidMembersData?.members?.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Aucun membre payant enregistré
            </div>
          ) : (
            paidMembersData?.members?.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 gap-2" data-testid={`row-member-${member.id}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.email}</p>
                  <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                    <span>{member.paymentPlan || 'Ajout manuel'}</span>
                    {member.amountPaid && <span>• {member.amountPaid}</span>}
                    {member.couponUsed && <span>• Code: {member.couponUsed}</span>}
                    <span>• {new Date(member.paymentDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleteMemberMutation.isPending || deleteUserCompleteMutation.isPending}
                      data-testid={`button-member-actions-${member.id}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => deleteMemberMutation.mutate(member.email)}
                      data-testid={`button-revoke-access-${member.id}`}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Retirer l'accès payant
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteUserCompleteMutation.mutate(member.email)}
                      className="text-destructive focus:text-destructive"
                      data-testid={`button-delete-user-${member.id}`}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Supprimer complètement
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
