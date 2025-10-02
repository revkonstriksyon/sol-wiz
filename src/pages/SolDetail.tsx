import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Check, X, Clock, TrendingUp } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { solStorage, Sol } from "@/lib/storage";
import { toast } from "sonner";

const SolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solData, setSolData] = useState<Sol | null>(null);

  useEffect(() => {
    if (id) {
      const sol = solStorage.getSolById(id);
      if (sol) {
        setSolData(sol);
      } else {
        toast.error("Sòl sa a pa egziste");
        navigate("/dashboard");
      }
    }
  }, [id, navigate]);

  if (!solData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center animate-pulse">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Chaje sòl la...</p>
        </div>
      </div>
    );
  }

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: "Chak Jou",
      weekly: "Chak Semèn",
      biweekly: "Chak 15 Jou",
      monthly: "Chak Mwa",
    };
    return labels[frequency] || frequency;
  };

  const getNextPaymentDate = (roundNumber: number) => {
    const startDate = new Date(solData.startDate);
    const daysToAdd = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      monthly: 30,
    }[solData.frequency] || 7;
    
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + (roundNumber - 1) * daysToAdd);
    return nextDate.toLocaleDateString('fr-FR');
  };

  // Create rounds with multiple winners
  const totalRounds = Math.ceil(solData.memberCount / solData.winnersPerRound);
  const rounds: { roundNumber: number; members: typeof solData.members; date: string }[] = [];
  
  for (let i = 0; i < totalRounds; i++) {
    const startIdx = i * solData.winnersPerRound;
    const endIdx = Math.min(startIdx + solData.winnersPerRound, solData.memberCount);
    const roundMembers = solData.members.slice(startIdx, endIdx);
    
    rounds.push({
      roundNumber: i + 1,
      members: roundMembers,
      date: getNextPaymentDate(i + 1),
    });
  }

  const totalAmount = solData.amount * solData.memberCount;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-dashboard">
            <ArrowLeft className="w-5 h-5" />
            <span>Retounen nan Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Sol Header */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground" data-testid="text-sol-name">{solData.name}</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  {getFrequencyLabel(solData.frequency)} • {solData.amount} Goud pa manm • {solData.winnersPerRound} moun/vire
                </p>
              </div>
              <Badge className="w-fit bg-success text-success-foreground">Aktif</Badge>
            </div>

            {/* Progress */}
            <Card className="p-6 bg-gradient-primary border-0 shadow-elegant">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-primary-foreground">Progress Sòl</h3>
                  <span className="text-2xl font-bold text-primary-foreground">
                    {Math.round((solData.currentRound / totalRounds) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-foreground transition-all duration-500"
                    style={{ width: `${(solData.currentRound / totalRounds) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-primary-foreground/90">
                  <span>Vire {solData.currentRound} / {totalRounds}</span>
                  <span>Pwochen peman: {getNextPaymentDate(solData.currentRound)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
            <Card className="p-6 space-y-2" data-testid="card-total-members">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{solData.memberCount}</p>
              <p className="text-sm text-muted-foreground">Total Manm</p>
            </Card>

            <Card className="p-6 space-y-2" data-testid="card-winners-per-round">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-2">
                <Check className="w-6 h-6 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground">{solData.winnersPerRound}</p>
              <p className="text-sm text-muted-foreground">Resevwa pa Vire</p>
            </Card>

            <Card className="p-6 space-y-2" data-testid="card-total-amount">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <p className="text-3xl font-bold text-foreground">{totalAmount}</p>
              <p className="text-sm text-muted-foreground">Total Vire (Goud)</p>
            </Card>
          </div>

          {/* Calendar Table */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Kalendriye Peman</h2>
            <Card className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Vire</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Dat</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Moun k ap Touche</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Total Peman</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Estati</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round) => {
                    const isPast = round.roundNumber < solData.currentRound;
                    const isCurrent = round.roundNumber === solData.currentRound;
                    const isFuture = round.roundNumber > solData.currentRound;
                    
                    return (
                      <tr
                        key={round.roundNumber}
                        className={`border-b border-border/50 transition-colors ${
                          isCurrent ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        data-testid={`row-round-${round.roundNumber}`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              isCurrent ? "bg-primary text-primary-foreground" :
                              isPast ? "bg-success/20 text-success" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {round.roundNumber}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{round.date}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {round.members.map((member) => (
                              <div key={member.id} className="font-medium text-foreground">
                                {member.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-foreground">{totalAmount} Goud</span>
                        </td>
                        <td className="py-4 px-4">
                          {isPast && (
                            <div className="flex items-center gap-1 text-success">
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">Konplete</span>
                            </div>
                          )}
                          {isCurrent && (
                            <div className="flex items-center gap-1 text-primary">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">An Kou</span>
                            </div>
                          )}
                          {isFuture && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">A Vini</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Tout Manm yo</h2>
            <div className="grid gap-4">
              {solData.members.map((member, index) => {
                const roundNumber = Math.floor(index / solData.winnersPerRound) + 1;
                const isCurrentReceiver = roundNumber === solData.currentRound;
                
                return (
                  <Card
                    key={member.id}
                    className={`p-6 animate-slide-up hover:shadow-card transition-all ${
                      isCurrentReceiver ? "border-2 border-primary" : ""
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`card-member-${member.id}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                          {member.position}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Ap touche nan vire #{roundNumber}
                          </p>
                        </div>
                        {isCurrentReceiver && (
                          <Badge className="bg-primary text-primary-foreground">Ap Touche Kounye a</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Dat: {getNextPaymentDate(roundNumber)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolDetail;
