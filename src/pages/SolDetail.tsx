import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Check, X, Clock, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with real data later
const mockSolData = {
  id: 1,
  name: "Sòl Fanmi",
  frequency: "Chak Semèn",
  amount: 1000,
  memberCount: 10,
  currentRound: 3,
  totalRounds: 10,
  nextPaymentDate: "2025-01-15",
  status: "active",
  startDate: "2025-01-01",
  members: [
    { id: 1, name: "Marie Joseph", position: 1, hasPaid: true, hasReceived: true, nextPaymentDue: "2025-01-08" },
    { id: 2, name: "Jean Pierre", position: 2, hasPaid: true, hasReceived: true, nextPaymentDue: "2025-01-15" },
    { id: 3, name: "Rose Delva", position: 3, hasPaid: true, hasReceived: false, nextPaymentDue: "2025-01-22", isCurrentReceiver: true },
    { id: 4, name: "Paul Laurent", position: 4, hasPaid: false, hasReceived: false, nextPaymentDue: "2025-01-29" },
    { id: 5, name: "Sophie Bernard", position: 5, hasPaid: true, hasReceived: false, nextPaymentDue: "2025-02-05" },
    { id: 6, name: "Marc Antoine", position: 6, hasPaid: true, hasReceived: false, nextPaymentDue: "2025-02-12" },
    { id: 7, name: "Linda Charles", position: 7, hasPaid: false, hasReceived: false, nextPaymentDue: "2025-02-19" },
    { id: 8, name: "Robert Michel", position: 8, hasPaid: true, hasReceived: false, nextPaymentDue: "2025-02-26" },
    { id: 9, name: "Anne Marie", position: 9, hasPaid: false, hasReceived: false, nextPaymentDue: "2025-03-05" },
    { id: 10, name: "Claude Felix", position: 10, hasPaid: true, hasReceived: false, nextPaymentDue: "2025-03-12" },
  ],
};

const SolDetail = () => {
  const { id } = useParams();
  const [solData] = useState(mockSolData);

  const paidCount = solData.members.filter((m) => m.hasPaid).length;
  const unpaidCount = solData.members.filter((m) => !m.hasPaid).length;
  const totalAmount = solData.amount * solData.memberCount;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
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
                <h1 className="text-4xl font-bold text-foreground">{solData.name}</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  {solData.frequency} • {solData.amount} Goud pa manm
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
                    {Math.round((solData.currentRound / solData.totalRounds) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-foreground transition-all duration-500"
                    style={{ width: `${(solData.currentRound / solData.totalRounds) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-primary-foreground/90">
                  <span>Vire {solData.currentRound} / {solData.totalRounds}</span>
                  <span>Pwochen peman: {solData.nextPaymentDate}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="p-6 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{solData.memberCount}</p>
              <p className="text-sm text-muted-foreground">Total Manm</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-2">
                <Check className="w-6 h-6 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground">{paidCount}</p>
              <p className="text-sm text-muted-foreground">Peye</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-2">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-3xl font-bold text-foreground">{unpaidCount}</p>
              <p className="text-sm text-muted-foreground">Pa Peye</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <p className="text-3xl font-bold text-foreground">{totalAmount}</p>
              <p className="text-sm text-muted-foreground">Total Vire (Goud)</p>
            </Card>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Manm yo</h2>
            <div className="grid gap-4">
              {solData.members.map((member, index) => (
                <Card
                  key={member.id}
                  className={`p-6 animate-slide-up hover:shadow-card transition-all ${
                    member.isCurrentReceiver ? "border-2 border-primary" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {member.position}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Ap touche nan vire #{member.position}
                        </p>
                      </div>
                      {member.isCurrentReceiver && (
                        <Badge className="bg-primary text-primary-foreground">Ap Touche Kounye a</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Pwochen: {member.nextPaymentDue}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            {member.hasPaid ? (
                              <>
                                <Check className="w-4 h-4 text-success" />
                                <span className="text-sm text-success">Peye</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-warning" />
                                <span className="text-sm text-warning">An atant</span>
                              </>
                            )}
                          </div>
                          {member.hasReceived && (
                            <div className="flex items-center gap-1">
                              <Check className="w-4 h-4 text-success" />
                              <span className="text-sm text-success">Resevwa</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={member.hasPaid ? "outline" : "default"}
                        className="min-w-24"
                      >
                        {member.hasPaid ? "Peye ✓" : "Make Peye"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolDetail;
