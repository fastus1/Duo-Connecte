import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Download, Archive, ArchiveRestore, Trash2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Feedback } from "@shared/schema";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Mappings pour afficher les valeurs lisibles
const helpfulAspectLabels: Record<string, string> = {
    structure: "La structure étape par étape du parcours",
    cadre: "Le cadre sécurisant pour aborder un sujet difficile",
    theorie: "Les explications théoriques (popups \"Plus d'infos\")",
    roles: "La séparation claire des rôles (émetteur/récepteur)",
    intention: "Le rappel de l'intention (\"être bien ensemble\")",
};

const improvementLabels: Record<string, string> = {
    duree: "La durée du parcours (trop long)",
    clarte: "La clarté des instructions",
    navigation: "La navigation entre les étapes",
    equilibre: "L'équilibre entre les rôles émetteur/récepteur",
    interface: "L'interface visuelle de l'application",
    exemples: "Les exemples fournis pour guider les réponses",
};

const durationLabels: Record<string, string> = {
    too_short: "Trop courte",
    adequate: "Adéquate",
    too_long: "Trop longue",
};

export function AdminFeedbacks() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [showArchived, setShowArchived] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

    const getAuthHeader = () => {
        const token = localStorage.getItem('session_token');
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    };

    const { data: feedbacks, isLoading, error } = useQuery<Feedback[]>({
        queryKey: ["/api/admin/feedbacks", showArchived ? "archived" : "active"],
        queryFn: async () => {
            const endpoint = showArchived ? "/api/admin/feedbacks/archived" : "/api/admin/feedbacks";
            const response = await fetch(endpoint, {
                headers: getAuthHeader(),
            });

            if (!response.ok) {
                throw new Error("Accès non autorisé");
            }

            return response.json();
        },
    });

    const archiveMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/admin/feedbacks/${id}/archive`, {
                method: 'PATCH',
                headers: getAuthHeader(),
            });
            if (!response.ok) throw new Error("Erreur lors de l'archivage");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/feedbacks"] });
            toast({
                title: "Feedback archivé",
                description: "Le feedback a été déplacé dans les archives",
            });
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible d'archiver le feedback",
                variant: "destructive",
            });
        },
    });

    const unarchiveMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/admin/feedbacks/${id}/unarchive`, {
                method: 'PATCH',
                headers: getAuthHeader(),
            });
            if (!response.ok) throw new Error("Erreur lors de la restauration");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/feedbacks"] });
            toast({
                title: "Feedback restauré",
                description: "Le feedback a été restauré",
            });
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible de restaurer le feedback",
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/admin/feedbacks/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader(),
            });
            if (!response.ok) throw new Error("Erreur lors de la suppression");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/feedbacks"] });
            toast({
                title: "Feedback supprimé",
                description: "Le feedback a été supprimé définitivement",
            });
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le feedback",
                variant: "destructive",
            });
        },
    });

    useEffect(() => {
        if (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger les feedbacks",
                variant: "destructive",
            });
        }
    }, [error, toast]);

    // Convertir la note stockée (multiplié par 10) en note réelle
    const getRealRating = (rating: number | null) => {
        if (rating === null) return 0;
        // Si la note est > 5, elle a été stockée multipliée par 10
        return rating > 5 ? rating / 10 : rating;
    };

    const generateMarkdown = (feedbacks: Feedback[]) => {
        let markdown = "# Feedbacks Duo-Connecte\n\n";
        markdown += `**Exporté le:** ${new Date().toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}\n\n`;
        markdown += `**Total:** ${feedbacks.length} feedback(s)\n\n`;
        markdown += "---\n\n";

        feedbacks.forEach((feedback, index) => {
            const realRating = getRealRating(feedback.rating);
            markdown += `## Feedback #${index + 1}\n\n`;
            markdown += `**Date:** ${new Date(feedback.createdAt).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}\n\n`;
            markdown += `**Note globale:** ${realRating}/5\n\n`;

            if (feedback.purchaseEase) {
                markdown += `**Facilité d'achat:** ${feedback.purchaseEase}/5\n\n`;
            }
            if (feedback.experienceRating) {
                markdown += `**Expérience:** ${feedback.experienceRating}\n\n`;
            }
            if (feedback.instructionsClarity) {
                markdown += `**Clarté des instructions:** ${feedback.instructionsClarity}/5\n\n`;
            }
            if (feedback.perceivedUtility) {
                markdown += `**Utilité perçue:** ${feedback.perceivedUtility}/5\n\n`;
            }
            if (feedback.helpfulAspect) {
                markdown += `**Ce qui a été utile:** ${helpfulAspectLabels[feedback.helpfulAspect] || feedback.helpfulAspect}\n\n`;
            }
            if (feedback.improvementSuggestion) {
                markdown += `**À améliorer:** ${improvementLabels[feedback.improvementSuggestion] || feedback.improvementSuggestion}\n\n`;
            }
            if (feedback.difficulties) {
                markdown += `**Difficultés:** ${feedback.difficulties}\n\n`;
            }
            if (feedback.confusingElements) {
                markdown += `**Éléments confus:** ${feedback.confusingElements}\n\n`;
            }
            if (feedback.technicalIssues) {
                markdown += `**Problèmes techniques:** ${feedback.technicalIssues}\n\n`;
            }
            if (feedback.missingFeatures) {
                markdown += `**Fonctionnalités manquantes:** ${feedback.missingFeatures}\n\n`;
            }
            if (feedback.durationFeedback) {
                markdown += `**Durée du parcours:** ${durationLabels[feedback.durationFeedback] || feedback.durationFeedback}\n\n`;
            }
            if (feedback.continuedUseLikelihood) {
                markdown += `**Probabilité de réutilisation:** ${feedback.continuedUseLikelihood}/5\n\n`;
            }

            markdown += "---\n\n";
        });

        return markdown;
    };

    const handleDownloadMarkdown = () => {
        if (!feedbacks || feedbacks.length === 0) {
            toast({
                title: "Aucun feedback",
                description: "Il n'y a pas de feedbacks à télécharger.",
                variant: "destructive",
            });
            return;
        }

        const markdown = generateMarkdown(feedbacks);
        const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const filename = `feedbacks-duo-connecte-${showArchived ? 'archives-' : ''}${new Date().toISOString().split('T')[0]}.md`;

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
            title: "Téléchargement réussi",
            description: `${feedbacks.length} feedback(s) exporté(s) en Markdown`,
        });
    };

    // Composant pour afficher une note avec des étoiles
    const StarRating = ({ rating, max = 5 }: { rating: number | null; max?: number }) => {
        const realRating = getRealRating(rating);
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: max }).map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(realRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : realRating > i && realRating < i + 1
                                ? "fill-yellow-400/50 text-yellow-400"
                                : "text-gray-300"
                            }`}
                    />
                ))}
                <span className="ml-1 text-sm font-medium">{realRating}/5</span>
            </div>
        );
    };

    // Composant pour afficher une ligne de détail
    const DetailRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
        if (!value) return null;
        return (
            <div className="py-2 border-b border-border last:border-0">
                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                <p className="text-base">{value}</p>
            </div>
        );
    };

    // Composant pour afficher une note dans le modal
    const RatingRow = ({ label, value }: { label: string; value: number | null | undefined }) => {
        if (!value) return null;
        return (
            <div className="py-2 border-b border-border last:border-0">
                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                <StarRating rating={value} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-semibold">
                        {showArchived ? "Feedbacks archivés" : "Feedbacks des utilisateurs"}
                    </h2>
                    <p className="text-muted-foreground">
                        {feedbacks?.length || 0} feedback(s) {showArchived ? "archivé(s)" : "actif(s)"}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant={showArchived ? "default" : "outline"}
                        onClick={() => setShowArchived(!showArchived)}
                        data-testid="button-toggle-archived"
                    >
                        {showArchived ? (
                            <>
                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                Voir les actifs
                            </>
                        ) : (
                            <>
                                <Archive className="h-4 w-4 mr-2" />
                                Voir les archives
                            </>
                        )}
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleDownloadMarkdown}
                        disabled={!feedbacks || feedbacks.length === 0}
                        data-testid="button-download-markdown"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger Markdown
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Chargement des feedbacks...</p>
                </div>
            )}

            {feedbacks && feedbacks.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            {showArchived ? "Aucun feedback archivé" : "Aucun feedback pour le moment"}
                        </p>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {feedbacks?.map((feedback) => {
                    const realRating = getRealRating(feedback.rating);
                    return (
                        <Card key={feedback.id} data-testid={`card-feedback-${feedback.id}`}>
                            <CardHeader>
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-5 w-5 ${star <= realRating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : realRating > star - 1 && realRating < star
                                                            ? "fill-yellow-400/50 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                            <span className="font-semibold text-lg ml-2">
                                                {realRating}/5
                                            </span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(feedback.createdAt).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedFeedback(feedback)}
                                            data-testid={`button-view-${feedback.id}`}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Voir détails
                                        </Button>
                                        {showArchived ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => unarchiveMutation.mutate(feedback.id)}
                                                disabled={unarchiveMutation.isPending}
                                                data-testid={`button-unarchive-${feedback.id}`}
                                            >
                                                <ArchiveRestore className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => archiveMutation.mutate(feedback.id)}
                                                disabled={archiveMutation.isPending}
                                                data-testid={`button-archive-${feedback.id}`}
                                            >
                                                <Archive className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    data-testid={`button-delete-${feedback.id}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Supprimer ce feedback ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action est irréversible. Le feedback sera définitivement supprimé.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteMutation.mutate(feedback.id)}
                                                        data-testid={`button-confirm-delete-${feedback.id}`}
                                                    >
                                                        Supprimer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>

            {/* Modal de détails */}
            <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Détails du feedback
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Toutes les réponses du feedback sélectionné
                        </DialogDescription>
                    </DialogHeader>

                    {selectedFeedback && (
                        <div className="space-y-4">
                            {/* Note globale */}
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Note globale</p>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const realRating = getRealRating(selectedFeedback.rating);
                                        return (
                                            <Star
                                                key={star}
                                                className={`h-6 w-6 ${star <= realRating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : realRating > star - 1 && realRating < star
                                                        ? "fill-yellow-400/50 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        );
                                    })}
                                    <span className="font-bold text-xl ml-2">
                                        {getRealRating(selectedFeedback.rating)}/5
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(selectedFeedback.createdAt).toLocaleString("fr-FR", {
                                        dateStyle: "full",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>

                            {/* Questions avec échelles */}
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Évaluations
                                </h3>
                                <div className="bg-card border rounded-lg p-4">
                                    <RatingRow label="Facilité du processus d'achat" value={selectedFeedback.purchaseEase} />
                                    {selectedFeedback.experienceRating && (
                                        <div className="py-2 border-b border-border">
                                            <p className="text-sm text-muted-foreground mb-1">Expérience globale</p>
                                            <p className="text-sm font-medium">{selectedFeedback.experienceRating}</p>
                                        </div>
                                    )}
                                    <RatingRow label="Clarté des instructions" value={selectedFeedback.instructionsClarity} />
                                    <RatingRow label="Utilité perçue" value={selectedFeedback.perceivedUtility} />
                                    <RatingRow label="Probabilité de réutilisation" value={selectedFeedback.continuedUseLikelihood} />
                                    {!selectedFeedback.purchaseEase && !selectedFeedback.experienceRating && 
                                     !selectedFeedback.instructionsClarity && !selectedFeedback.perceivedUtility && 
                                     !selectedFeedback.continuedUseLikelihood && (
                                        <p className="text-muted-foreground italic text-sm py-2">Aucune évaluation</p>
                                    )}
                                </div>
                            </div>

                            {/* Questions à choix */}
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Réponses
                                </h3>
                                <div className="bg-card border rounded-lg p-4">
                                    <DetailRow 
                                        label="Ce qui a été le plus utile" 
                                        value={selectedFeedback.helpfulAspect ? helpfulAspectLabels[selectedFeedback.helpfulAspect] || selectedFeedback.helpfulAspect : null} 
                                    />
                                    <DetailRow 
                                        label="Ce qui pourrait être amélioré" 
                                        value={selectedFeedback.improvementSuggestion ? improvementLabels[selectedFeedback.improvementSuggestion] || selectedFeedback.improvementSuggestion : null} 
                                    />
                                    <DetailRow 
                                        label="Durée du parcours" 
                                        value={selectedFeedback.durationFeedback ? durationLabels[selectedFeedback.durationFeedback] || selectedFeedback.durationFeedback : null} 
                                    />
                                    {!selectedFeedback.helpfulAspect && !selectedFeedback.improvementSuggestion && !selectedFeedback.durationFeedback && (
                                        <p className="text-muted-foreground italic text-sm py-2">Aucune réponse</p>
                                    )}
                                </div>
                            </div>

                            {/* Questions texte libre */}
                            {(selectedFeedback.difficulties || selectedFeedback.confusingElements || 
                              selectedFeedback.technicalIssues || selectedFeedback.missingFeatures) && (
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                        Commentaires
                                    </h3>
                                    <div className="bg-card border rounded-lg p-4">
                                        <DetailRow label="Difficultés rencontrées" value={selectedFeedback.difficulties} />
                                        <DetailRow label="Éléments confus" value={selectedFeedback.confusingElements} />
                                        <DetailRow label="Problèmes techniques" value={selectedFeedback.technicalIssues} />
                                        <DetailRow label="Fonctionnalités manquantes" value={selectedFeedback.missingFeatures} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
