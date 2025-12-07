import { useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Feedback } from "@shared/schema";

export function AdminFeedbacks() {
    const { toast } = useToast();

    const getAuthHeader = () => {
        const token = localStorage.getItem('session_token');
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    };

    const { data: feedbacks, isLoading, error } = useQuery<Feedback[]>({
        queryKey: ["/api/admin/feedbacks"],
        queryFn: async () => {
            const response = await fetch("/api/admin/feedbacks", {
                headers: getAuthHeader(),
            });

            if (!response.ok) {
                throw new Error("Accès non autorisé");
            }

            return response.json();
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

    const generateMarkdown = (feedbacks: Feedback[]) => {
        let markdown = "# Feedbacks Duo-Connecte\n\n";
        markdown += `**Exporté le:** ${new Date().toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}\n\n`;
        markdown += `**Total:** ${feedbacks.length} feedback(s)\n\n`;
        markdown += "---\n\n";

        feedbacks.forEach((feedback, index) => {
            markdown += `## Feedback #${index + 1}\n\n`;
            markdown += `**Date:** ${new Date(feedback.createdAt).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}\n\n`;

            const stars = "⭐".repeat(Math.floor(feedback.rating ?? 0));
            const halfStar = (feedback.rating ?? 0) % 1 !== 0 ? "½" : "";
            markdown += `**Note:** ${stars}${halfStar} (${feedback.rating}/5)\n\n`;

            if (feedback.helpfulAspect) {
                markdown += `### Ce qui a été le plus utile\n\n`;
                markdown += `${feedback.helpfulAspect}\n\n`;
            }

            if (feedback.improvementSuggestion) {
                markdown += `### Ce qui pourrait être amélioré\n\n`;
                markdown += `${feedback.improvementSuggestion}\n\n`;
            }

            if (!feedback.helpfulAspect && !feedback.improvementSuggestion) {
                markdown += `*Aucun commentaire fourni*\n\n`;
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
        const filename = `feedbacks-duo-connecte-${new Date().toISOString().split('T')[0]}.md`;

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Feedbacks des utilisateurs</h2>
                    <p className="text-muted-foreground">
                        {feedbacks?.length || 0} feedback(s) enregistré(s)
                    </p>
                </div>
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

            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Chargement des feedbacks...</p>
                </div>
            )}

            {feedbacks && feedbacks.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Aucun feedback pour le moment</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {feedbacks?.map((feedback) => (
                    <Card key={feedback.id} data-testid={`card-feedback-${feedback.id}`}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${star <= (feedback.rating ?? 0)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                        <span className="font-semibold text-lg ml-2">
                                            {feedback.rating}/5
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(feedback.createdAt).toLocaleString("fr-FR", {
                                            dateStyle: "full",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {feedback.helpfulAspect && (
                                <div>
                                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                                        Ce qui a été le plus utile :
                                    </h3>
                                    <p className="text-base">{feedback.helpfulAspect}</p>
                                </div>
                            )}
                            {feedback.improvementSuggestion && (
                                <div>
                                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                                        Ce qui pourrait être amélioré :
                                    </h3>
                                    <p className="text-base">{feedback.improvementSuggestion}</p>
                                </div>
                            )}
                            {!feedback.helpfulAspect && !feedback.improvementSuggestion && (
                                <p className="text-muted-foreground italic">
                                    Aucun commentaire fourni
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
