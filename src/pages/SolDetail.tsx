import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Calendar, Check, X, Clock, TrendingUp, DollarSign, History, Plus } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { solStorage, Sol, Payment, SolEvent } from "@/lib/storage";
import { toast } from "sonner";

const SolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solData, setSolData] = useState<Sol | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

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

  const refreshSolData = () => {
    if (id) {
      const sol = solStorage.getSolById(id);
      if (sol) {
        setSolData(sol);
      }
    }
  };

  const handleRecordPayment = () => {
    if (!solData || !selectedMemberId || !paymentAmount) {
      toast.error("Tanpri ranpli tout chan yo");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      toast.error("Kantite lajan dwe pi gran pase 0");
      return;
    }

    const member = solData.members.find(m => m.id === selectedMemberId);
    if (!member) return;

    const amountDue = solData.amount;
    const existingPayments = solData.payments.filter(
      p => p.memberId === selectedMemberId && p.round === solData.currentRound
    );
    const totalPaid = existingPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const remainingDue = amountDue - totalPaid;

    // Prevent overpayment
    if (amount > remainingDue) {
      toast.error(`Kantite lajan twò wo. Moun sa dwe ${remainingDue} Goud sèlman`);
      return;
    }

    const newRemainingDue = remainingDue - amount;

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      memberId: selectedMemberId,
      round: solData.currentRound,
      amountPaid: amount,
      amountDue: newRemainingDue,
      date: paymentDate,
    };

    const newEvent: SolEvent = {
      id: `event-${Date.now()}`,
      type: "payment",
      memberId: selectedMemberId,
      amount,
      date: paymentDate,
      round: solData.currentRound,
      description: `${member.name} peye ${amount} Goud`,
    };

    const updatedSol: Sol = {
      ...solData,
      payments: [...solData.payments, newPayment],
      events: [...solData.events, newEvent],
    };

    solStorage.saveSol(updatedSol);
    setSolData(updatedSol);
    setShowPaymentDialog(false);
    setSelectedMemberId("");
    setPaymentAmount("");
    setPaymentDate(new Date().toISOString().split('T')[0]);
    
    if (newRemainingDue > 0) {
      toast.success(`Peman anrejistre! Rete ${newRemainingDue} Goud pou peye`);
    } else {
      toast.success("Peman anrejistre! Konplete!");
    }
  };

  const handleRecordPayout = (memberId: string) => {
    if (!solData) return;

    const member = solData.members.find(m => m.id === memberId);
    if (!member) return;

    const payoutAmount = solData.amount * (solData.memberCount - solData.winnersPerRound);

    const newEvent: SolEvent = {
      id: `event-${Date.now()}`,
      type: "payout",
      memberId,
      amount: payoutAmount,
      date: new Date().toISOString().split('T')[0],
      round: solData.currentRound,
      description: `${member.name} resevwa ${payoutAmount} Goud`,
    };

    const updatedSol: Sol = {
      ...solData,
      events: [...solData.events, newEvent],
    };

    // Check if all recipients have received their payout
    const allRecipients = currentRecipients.map(m => m.id);
    const recipientsWhoReceived = updatedSol.events
      .filter(e => e.type === "payout" && e.round === solData.currentRound)
      .map(e => e.memberId);
    
    const allPaid = allRecipients.every(id => recipientsWhoReceived.includes(id) || id === memberId);

    // If all recipients have been paid, advance to next round
    if (allPaid && solData.currentRound < totalRounds) {
      updatedSol.currentRound = solData.currentRound + 1;
      toast.success(`Peman resevwa anrejistre! Pase nan vire ${updatedSol.currentRound}`);
    } else {
      toast.success("Peman resevwa anrejistre!");
    }

    solStorage.saveSol(updatedSol);
    refreshSolData();
  };

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

  const getMemberPaymentStatus = (memberId: string, round: number) => {
    const payments = solData.payments.filter(p => p.memberId === memberId && p.round === round);
    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const amountDue = solData.amount;
    const remaining = amountDue - totalPaid;

    return {
      totalPaid,
      remaining,
      isPaidInFull: remaining <= 0,
      hasPartialPayment: totalPaid > 0 && remaining > 0,
      payments,
    };
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

  // Get current round recipients
  const currentRound = rounds.find(r => r.roundNumber === solData.currentRound);
  const currentRecipients = currentRound?.members || [];

  // Financial calculations for current round
  const getFinancialSummary = () => {
    const totalExpected = solData.amount * (solData.memberCount - solData.winnersPerRound);
    const paymentsThisRound = solData.payments.filter(p => p.round === solData.currentRound);
    const totalCollected = paymentsThisRound.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalToDistribute = solData.amount * (solData.memberCount - solData.winnersPerRound);
    const payoutsThisRound = solData.events.filter(e => e.type === "payout" && e.round === solData.currentRound);
    const totalDistributed = payoutsThisRound.reduce((sum, e) => sum + e.amount, 0);
    const remainingBalance = totalCollected - totalDistributed;

    return {
      totalExpected,
      totalCollected,
      totalToDistribute,
      totalDistributed,
      remainingBalance,
      collectionProgress: (totalCollected / totalExpected) * 100,
      distributionProgress: (totalDistributed / totalToDistribute) * 100,
    };
  };

  const financialSummary = getFinancialSummary();

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

            {/* Financial Summary for Current Round */}
            <Card className="p-6 bg-card shadow-card border-border">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Kontwòl Finansye - Vire #{solData.currentRound}
                  </h3>
                </div>

                {/* Collection Section */}
                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Pou Kolekte</span>
                    <span className="text-lg font-bold text-foreground">{financialSummary.totalExpected.toFixed(2)} Goud</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Kolekte</span>
                    <span className="text-lg font-bold text-success">{financialSummary.totalCollected.toFixed(2)} Goud</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress Koleksyon</span>
                      <span>{Math.round(financialSummary.collectionProgress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success transition-all duration-500"
                        style={{ width: `${Math.min(financialSummary.collectionProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Distribution Section */}
                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Pou Distribye</span>
                    <span className="text-lg font-bold text-foreground">{financialSummary.totalToDistribute.toFixed(2)} Goud</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Distribye</span>
                    <span className="text-lg font-bold text-primary">{financialSummary.totalDistributed.toFixed(2)} Goud</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress Distribisyon</span>
                      <span>{Math.round(financialSummary.distributionProgress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(financialSummary.distributionProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-foreground">Balans ki Rete</span>
                    <span className={`text-2xl font-bold ${financialSummary.remainingBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {financialSummary.remainingBalance.toFixed(2)} Goud
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lajan ki kolekte men ki poko distribye
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="payments" data-testid="tab-payments">Peman</TabsTrigger>
              <TabsTrigger value="calendar" data-testid="tab-calendar">Kalendriye</TabsTrigger>
              <TabsTrigger value="events" data-testid="tab-events">Istwa</TabsTrigger>
            </TabsList>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Peman Vire #{solData.currentRound}</h2>
                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-payment">
                      <Plus className="w-4 h-4 mr-2" />
                      Anrejistre Peman
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-testid="dialog-payment">
                    <DialogHeader>
                      <DialogTitle>Anrejistre Peman</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="member">Manm</Label>
                        <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                          <SelectTrigger id="member" data-testid="select-member">
                            <SelectValue placeholder="Chwazi yon manm" />
                          </SelectTrigger>
                          <SelectContent>
                            {solData.members.map((member) => {
                              const status = getMemberPaymentStatus(member.id, solData.currentRound);
                              return (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name} - {status.remaining > 0 ? `Rete ${status.remaining} Goud` : 'Konplete'}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedMemberId && (
                        <Card className="p-4 bg-muted/50">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Dwe peye:</span>
                              <span className="font-semibold">{solData.amount} Goud</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Deja peye:</span>
                              <span className="font-semibold">{getMemberPaymentStatus(selectedMemberId, solData.currentRound).totalPaid} Goud</span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-1 mt-1">
                              <span className="text-muted-foreground font-semibold">Rete pou peye:</span>
                              <span className="font-bold text-primary">{getMemberPaymentStatus(selectedMemberId, solData.currentRound).remaining} Goud</span>
                            </div>
                          </div>
                        </Card>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="amount">Kantite Lajan (Goud)</Label>
                        <Input
                          id="amount"
                          data-testid="input-payment-amount"
                          type="number"
                          placeholder={selectedMemberId ? `Max: ${getMemberPaymentStatus(selectedMemberId, solData.currentRound).remaining}` : "Ex: 1000"}
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          min="0"
                          max={selectedMemberId ? getMemberPaymentStatus(selectedMemberId, solData.currentRound).remaining : undefined}
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Dat</Label>
                        <Input
                          id="date"
                          data-testid="input-payment-date"
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleRecordPayment} className="w-full" data-testid="button-save-payment">
                        Anrejistre
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {solData.members.map((member) => {
                  const status = getMemberPaymentStatus(member.id, solData.currentRound);
                  
                  return (
                    <Card
                      key={member.id}
                      className={`p-6 ${status.isPaidInFull ? 'border-success' : status.hasPartialPayment ? 'border-warning' : ''}`}
                      data-testid={`card-payment-${member.id}`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                            {member.position}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Dwe peye: {solData.amount} Goud
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Peye</p>
                            <p className={`text-xl font-bold ${status.isPaidInFull ? 'text-success' : status.hasPartialPayment ? 'text-warning' : 'text-muted-foreground'}`}>
                              {status.totalPaid} Goud
                            </p>
                            {status.remaining > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Rete: {status.remaining} Goud
                              </p>
                            )}
                          </div>
                          {status.isPaidInFull ? (
                            <Badge className="bg-success text-success-foreground">
                              <Check className="w-3 h-3 mr-1" />
                              Konplete
                            </Badge>
                          ) : status.hasPartialPayment ? (
                            <Badge className="bg-warning text-warning-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              Pasyèl
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              <X className="w-3 h-3 mr-1" />
                              Pa Peye
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Current Recipients */}
              {currentRecipients.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Moun k ap Resevwa Vire Sa a</h3>
                  <div className="grid gap-4">
                    {currentRecipients.map((member) => (
                      <Card key={member.id} className="p-6 border-2 border-primary bg-primary/5">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                              {member.position}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Ap resevwa: {totalAmount} Goud
                              </p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleRecordPayout(member.id)}
                            data-testid={`button-record-payout-${member.id}`}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Make Resepsyon
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
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
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Istwa Evènman</h2>
              {solData.events.length === 0 ? (
                <Card className="p-12 text-center">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Pa gen evènman ankò</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tout peman ak resepsyon ap parèt isit la
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {[...solData.events].reverse().map((event) => {
                    const member = solData.members.find(m => m.id === event.memberId);
                    const eventDate = new Date(event.date).toLocaleDateString('fr-FR');
                    
                    return (
                      <Card key={event.id} className="p-6" data-testid={`event-${event.id}`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.type === 'payment' ? 'bg-success/10' : 'bg-primary/10'
                          }`}>
                            {event.type === 'payment' ? (
                              <DollarSign className="w-5 h-5 text-success" />
                            ) : (
                              <TrendingUp className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium text-foreground">{event.description}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Vire #{event.round} • {member?.name}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">{event.amount} Goud</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {eventDate}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SolDetail;
