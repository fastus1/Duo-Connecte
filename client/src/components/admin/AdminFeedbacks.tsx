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

// Mappings for displaying readable values
const helpfulAspectLabels: Record<string, string> = {
    structure: "Step-by-step structure",
    cadre: "Safe framework for difficult topics",
    theorie: "Theoretical explanations",
    roles: "Clear role separation",
    intention: "Intention reminder",
};

const improvementLabels: Record<string, string> = {
    duree: "Duration (too long)",
    clarte: "Clarity of instructions",
    navigation: "Navigation between steps",
    equilibre: "Role balance",
    interface: "Visual interface",
    exemples: "Examples provided",
};

const durationLabels: Record<string, string> = {
    too_short: "Too short",
    adequate: "Adequate",
    too_long: "Too long",
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
                throw new Error("Unauthorized access");
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
            if (!response.ok) throw new Error("Error archiving feedback");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/feedbacks"] });
            toast({
                title: "Feedback archived",
                description: "The feedback has been moved to archives",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Unable to archive feedback",
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
            if (!response.ok) throw new Error("Error restoring feedback");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/feedbacks"] });
            toast({
                title: "Feedback restored",
                description: "The feedback has been restored",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Unable to restore feedback",
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
            if (!response.ok) throw new Error("Error deleting feedback");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/feedbacks"] });
            toast({
                title: "Feedback deleted",
                description: "The feedback has been permanently deleted",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Unable to delete feedback",
                variant: "destructive",
            });
        },
    });

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: "Unable to load feedbacks",
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
        let markdown = "# App Feedbacks\n\n";
        markdown += `**Exported on:** ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}\n\n`;
        markdown += `**Total:** ${feedbacks.length} feedback(s)\n\n`;
        markdown += "---\n\n";

        feedbacks.forEach((feedback, index) => {
            const realRating = getRealRating(feedback.rating);
            markdown += `## Feedback #${index + 1}\n\n`;
            markdown += `**Date:** ${new Date(feedback.createdAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}\n\n`;
            markdown += `**Overall rating:** ${realRating}/5\n\n`;

            if (feedback.purchaseEase) {
                markdown += `**Purchase ease:** ${feedback.purchaseEase}/5\n\n`;
            }
            if (feedback.experienceRating) {
                markdown += `**Experience:** ${feedback.experienceRating}/5\n\n`;
            }
            if (feedback.instructionsClarity) {
                markdown += `**Instructions clarity:** ${feedback.instructionsClarity}/5\n\n`;
            }
            if (feedback.perceivedUtility) {
                markdown += `**Perceived utility:** ${feedback.perceivedUtility}/5\n\n`;
            }
            if (feedback.helpfulAspect) {
                markdown += `**What was helpful:** ${helpfulAspectLabels[feedback.helpfulAspect] || feedback.helpfulAspect}\n\n`;
            }
            if (feedback.improvementSuggestion) {
                markdown += `**To improve:** ${improvementLabels[feedback.improvementSuggestion] || feedback.improvementSuggestion}\n\n`;
            }
            if (feedback.difficulties) {
                markdown += `**Difficulties:** ${feedback.difficulties}\n\n`;
            }
            if (feedback.confusingElements) {
                markdown += `**Confusing elements:** ${feedback.confusingElements}\n\n`;
            }
            if (feedback.technicalIssues) {
                markdown += `**Technical issues:** ${feedback.technicalIssues}\n\n`;
            }
            if (feedback.missingFeatures) {
                markdown += `**Missing features:** ${feedback.missingFeatures}\n\n`;
            }
            if (feedback.durationFeedback) {
                markdown += `**Duration:** ${durationLabels[feedback.durationFeedback] || feedback.durationFeedback}\n\n`;
            }
            if (feedback.continuedUseLikelihood) {
                markdown += `**Likelihood of continued use:** ${feedback.continuedUseLikelihood}/5\n\n`;
            }

            markdown += "---\n\n";
        });

        return markdown;
    };

    const handleDownloadMarkdown = () => {
        if (!feedbacks || feedbacks.length === 0) {
            toast({
                title: "No feedbacks",
                description: "There are no feedbacks to download.",
                variant: "destructive",
            });
            return;
        }

        const markdown = generateMarkdown(feedbacks);
        const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const filename = `feedbacks-circle-app-${showArchived ? 'archives-' : ''}${new Date().toISOString().split('T')[0]}.md`;

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
            title: "Download successful",
            description: `${feedbacks.length} feedback(s) exported as Markdown`,
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
                        {showArchived ? "Archived Feedbacks" : "User Feedbacks"}
                    </h2>
                    <p className="text-muted-foreground">
                        {feedbacks?.length || 0} {showArchived ? "archived" : "active"} feedback(s)
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
                                View active
                            </>
                        ) : (
                            <>
                                <Archive className="h-4 w-4 mr-2" />
                                View archived
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
                        Download Markdown
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading feedbacks...</p>
                </div>
            )}

            {feedbacks && feedbacks.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            {showArchived ? "No archived feedbacks" : "No feedbacks yet"}
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
                                            {new Date(feedback.createdAt).toLocaleDateString("en-US", {
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
                                            View details
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
                                                    <AlertDialogTitle>Delete this feedback?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action is irreversible. The feedback will be permanently deleted.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteMutation.mutate(feedback.id)}
                                                        data-testid={`button-confirm-delete-${feedback.id}`}
                                                    >
                                                        Delete
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
                            Feedback Details
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            All responses from the selected feedback
                        </DialogDescription>
                    </DialogHeader>

                    {selectedFeedback && (
                        <div className="space-y-4">
                            {/* Note globale */}
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Overall Rating</p>
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
                                    {new Date(selectedFeedback.createdAt).toLocaleString("en-US", {
                                        dateStyle: "full",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>

                            {/* Questions avec échelles */}
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Ratings
                                </h3>
                                <div className="bg-card border rounded-lg p-4">
                                    <RatingRow label="Purchase ease" value={selectedFeedback.purchaseEase} />
                                    <RatingRow label="Overall experience" value={selectedFeedback.experienceRating} />
                                    <RatingRow label="Instructions clarity" value={selectedFeedback.instructionsClarity} />
                                    <RatingRow label="Perceived utility" value={selectedFeedback.perceivedUtility} />
                                    <RatingRow label="Likelihood of continued use" value={selectedFeedback.continuedUseLikelihood} />
                                    {!selectedFeedback.purchaseEase && !selectedFeedback.experienceRating &&
                                     !selectedFeedback.instructionsClarity && !selectedFeedback.perceivedUtility &&
                                     !selectedFeedback.continuedUseLikelihood && (
                                        <p className="text-muted-foreground italic text-sm py-2">No ratings</p>
                                    )}
                                </div>
                            </div>

                            {/* Questions à choix */}
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Responses
                                </h3>
                                <div className="bg-card border rounded-lg p-4">
                                    <DetailRow
                                        label="What was most helpful"
                                        value={selectedFeedback.helpfulAspect ? helpfulAspectLabels[selectedFeedback.helpfulAspect] || selectedFeedback.helpfulAspect : null}
                                    />
                                    <DetailRow
                                        label="What could be improved"
                                        value={selectedFeedback.improvementSuggestion ? improvementLabels[selectedFeedback.improvementSuggestion] || selectedFeedback.improvementSuggestion : null}
                                    />
                                    <DetailRow
                                        label="Duration feedback"
                                        value={selectedFeedback.durationFeedback ? durationLabels[selectedFeedback.durationFeedback] || selectedFeedback.durationFeedback : null}
                                    />
                                    {!selectedFeedback.helpfulAspect && !selectedFeedback.improvementSuggestion && !selectedFeedback.durationFeedback && (
                                        <p className="text-muted-foreground italic text-sm py-2">No responses</p>
                                    )}
                                </div>
                            </div>

                            {/* Questions texte libre */}
                            {(selectedFeedback.difficulties || selectedFeedback.confusingElements || 
                              selectedFeedback.technicalIssues || selectedFeedback.missingFeatures) && (
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                        Comments
                                    </h3>
                                    <div className="bg-card border rounded-lg p-4">
                                        <DetailRow label="Difficulties encountered" value={selectedFeedback.difficulties} />
                                        <DetailRow label="Confusing elements" value={selectedFeedback.confusingElements} />
                                        <DetailRow label="Technical issues" value={selectedFeedback.technicalIssues} />
                                        <DetailRow label="Missing features" value={selectedFeedback.missingFeatures} />
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
