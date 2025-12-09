import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Ticket, Clock, CheckCircle, Loader2, Trash2, Mail, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { getSessionToken } from '@/lib/auth';
import type { SupportTicket } from '@shared/schema';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, { label: string; color: string; icon: typeof Ticket }> = {
  new: { label: 'Nouveau', color: 'bg-blue-500', icon: Ticket },
  in_progress: { label: 'En cours', color: 'bg-yellow-500', icon: Clock },
  resolved: { label: 'Résolu', color: 'bg-green-500', icon: CheckCircle },
};

export function AdminSupportTickets() {
  const { toast } = useToast();
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ['/api/admin/support/tickets'],
    queryFn: async () => {
      const token = getSessionToken();
      const response = await fetch('/api/admin/support/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors du chargement');
      return response.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest('PATCH', `/api/admin/support/tickets/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/support/tickets'] });
      toast({ title: "Statut mis à jour" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le statut", variant: "destructive" });
    },
  });

  const deleteTicket = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/admin/support/tickets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/support/tickets'] });
      toast({ title: "Ticket supprimé" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de supprimer le ticket", variant: "destructive" });
    },
  });

  const newTickets = tickets.filter(t => t.status === 'new');
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-500/10">
                <Ticket className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newTickets.length}</p>
                <p className="text-sm text-muted-foreground">Nouveaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressTickets.length}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedTickets.length}</p>
                <p className="text-sm text-muted-foreground">Résolus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucun ticket de support</h3>
            <p className="text-muted-foreground">Les demandes de support apparaîtront ici</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const statusInfo = statusLabels[ticket.status] || statusLabels.new;
            const isExpanded = expandedTicket === ticket.id;
            
            return (
              <Card 
                key={ticket.id} 
                className={cn(
                  "transition-all cursor-pointer",
                  isExpanded && "ring-2 ring-primary"
                )}
                onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                data-testid={`ticket-card-${ticket.id}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn(statusInfo.color, "text-white")}>
                          {statusInfo.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(ticket.createdAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                        </span>
                      </div>
                      <CardTitle className="text-base mt-2 truncate">
                        {ticket.subject}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ticket.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {ticket.email}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0" onClick={(e) => e.stopPropagation()}>
                    <div className="border-t pt-4 mt-2">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {ticket.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Statut :</span>
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => updateStatus.mutate({ id: ticket.id, status: value })}
                          >
                            <SelectTrigger className="w-[140px]" data-testid={`select-status-${ticket.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Nouveau</SelectItem>
                              <SelectItem value="in_progress">En cours</SelectItem>
                              <SelectItem value="resolved">Résolu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={`mailto:${ticket.email}?subject=Re: ${ticket.subject}`} data-testid={`button-reply-${ticket.id}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Répondre
                          </a>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive ml-auto"
                          onClick={() => {
                            if (confirm('Supprimer ce ticket ?')) {
                              deleteTicket.mutate(ticket.id);
                            }
                          }}
                          data-testid={`button-delete-${ticket.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
