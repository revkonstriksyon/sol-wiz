import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Calendar, Users, TrendingUp, Clock, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
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
import { toast } from "sonner";
import { solStorage, Sol } from "@/lib/storage";

const Dashboard = () => {
  const [sols, setSols] = useState<Sol[]>([]);

  useEffect(() => {
    loadSols();
  }, []);

  const loadSols = () => {
    const loadedSols = solStorage.getAllSols();
    setSols(loadedSols);
  };

  const handleDelete = (solId: string, solName: string) => {
    solStorage.deleteSol(solId);
    loadSols();
    toast.success(`Sòl "${solName}" siprime!`);
  };

  const handleEdit = (solId: string) => {
    toast.info("Fonksyon edit ap vini byento!");
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: "Chak Jou",
      weekly: "Chak Semèn",
      biweekly: "Chak 15 Jou",
      monthly: "Chak Mwa",
    };
    return labels[frequency] || frequency;
  };

  const getNextPaymentDate = (sol: Sol) => {
    const startDate = new Date(sol.startDate);
    const daysToAdd = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      monthly: 30,
    }[sol.frequency] || 7;
    
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + (sol.currentRound - 1) * daysToAdd);
    return nextDate.toLocaleDateString('fr-FR');
  };

  const totalMembers = sols.reduce((sum, sol) => sum + sol.memberCount, 0);
  const totalRounds = sols.reduce((sum, sol) => sum + sol.currentRound, 0);
  const totalRoundsAll = sols.reduce((sum, sol) => sum + Math.ceil(sol.memberCount / sol.winnersPerRound), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Dakèy</span>
          </Link>
          <Link to="/create">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Nouvo Sòl
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-lg text-muted-foreground">Jere tout sòl ou yo nan yon sèl kote</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
            <Card className="p-6 space-y-2 hover:shadow-elegant transition-shadow" data-testid="card-active-sols">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <span className="text-3xl font-bold text-foreground" data-testid="text-active-count">{sols.length}</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Sòl Aktif</h3>
            </Card>

            <Card className="p-6 space-y-2 hover:shadow-elegant transition-shadow" data-testid="card-total-members">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <span className="text-3xl font-bold text-foreground" data-testid="text-member-count">{totalMembers}</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Manm</h3>
            </Card>

            <Card className="p-6 space-y-2 hover:shadow-elegant transition-shadow" data-testid="card-total-rounds">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
                <span className="text-3xl font-bold text-foreground" data-testid="text-round-count">{totalRounds}</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Vire Aktif</h3>
            </Card>
          </div>

          {/* Sols List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Sòl Ou yo</h2>
            
            {sols.length === 0 ? (
              <Card className="p-12 text-center space-y-4 animate-scale-in" data-testid="card-no-sols">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Pa gen sòl ankò</h3>
                  <p className="text-muted-foreground">Kreye premye sòl ou a pou kòmanse</p>
                </div>
                <Link to="/create">
                  <Button size="lg" className="gap-2" data-testid="button-create-first-sol">
                    <Plus className="w-5 h-5" />
                    Kreye Sòl
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-6">
                {sols.map((sol, index) => {
                  const totalRounds = Math.ceil(sol.memberCount / sol.winnersPerRound);
                  const nextPaymentDate = getNextPaymentDate(sol);
                  
                  return (
                    <Card key={sol.id} className="p-6 hover:shadow-elegant transition-all animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }} data-testid={`card-sol-${sol.id}`}>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <Link to={`/sol/${sol.id}`} className="space-y-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground hover:text-primary transition-colors" data-testid={`text-sol-name-${sol.id}`}>{sol.name}</h3>
                              <p className="text-muted-foreground">{getFrequencyLabel(sol.frequency)} • {sol.amount} Goud • {sol.winnersPerRound} moun/vire</p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                              Aktif
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              <span className="text-sm text-muted-foreground">
                                {sol.memberCount} manm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-success" />
                              <span className="text-sm text-muted-foreground">
                                Vire {sol.currentRound} / {totalRounds}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-warning" />
                              <span className="text-sm text-muted-foreground">
                                Pwochen: {nextPaymentDate}
                              </span>
                            </div>
                          </div>

                          <div className="lg:w-48">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground">
                                  {Math.round((sol.currentRound / totalRounds) * 100)}%
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-primary transition-all duration-500"
                                  style={{ width: `${(sol.currentRound / totalRounds) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="flex gap-2 lg:flex-col">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(sol.id)}
                            className="gap-2"
                            data-testid={`button-edit-${sol.id}`}
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive" data-testid={`button-delete-${sol.id}`}>
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Ou si ou vle siprime sòl sa a?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Aksyon sa a pa ka retoune. Li pral efase tout done sòl "{sol.name}" definitivman.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Anile</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(sol.id, sol.name)}
                                  className="bg-destructive hover:bg-destructive/90"
                                  data-testid={`button-confirm-delete-${sol.id}`}
                                >
                                  Siprime
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
