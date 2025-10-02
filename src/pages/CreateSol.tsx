import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, X, Users, DollarSign, Calendar, Check, GripVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { solStorage, Sol, SolMember } from "@/lib/storage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type FrequencyType = "daily" | "weekly" | "biweekly" | "monthly";

const CreateSol = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [solName, setSolName] = useState("");
  const [frequency, setFrequency] = useState<FrequencyType>("weekly");
  const [amount, setAmount] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [winnersPerRound, setWinnersPerRound] = useState("1");
  const [members, setMembers] = useState<string[]>([]);
  const [currentMember, setCurrentMember] = useState("");

  const frequencyOptions = [
    { value: "daily", label: "Chak Jou" },
    { value: "weekly", label: "Chak Semèn" },
    { value: "biweekly", label: "Chak 15 Jou" },
    { value: "monthly", label: "Chak Mwa" },
  ];

  const handleAddMember = () => {
    if (currentMember.trim() && members.length < parseInt(memberCount)) {
      setMembers([...members, currentMember.trim()]);
      setCurrentMember("");
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMembers((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!solName.trim()) {
        toast.error("Tanpri bay sòl la yon non");
        return;
      }
      if (!frequency || !amount || !memberCount) {
        toast.error("Tanpri ranpli tout chan yo");
        return;
      }
      if (parseInt(amount) <= 0) {
        toast.error("Kantite lajan dwe pi gran pase 0");
        return;
      }
      if (parseInt(memberCount) < 2) {
        toast.error("Ou bezwen omwen 2 manm");
        return;
      }
      if (parseInt(winnersPerRound) < 1 || parseInt(winnersPerRound) > parseInt(memberCount)) {
        toast.error("Kantite moun ki resevwa pa valid");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (members.length !== parseInt(memberCount)) {
        toast.error(`Ou bezwen ajoute ${parseInt(memberCount)} manm`);
        return;
      }
      
      // Save sol data
      const solMembers: SolMember[] = members.map((name, index) => ({
        id: `${Date.now()}-${index}`,
        name,
        position: index + 1,
      }));
      
      const newSol: Sol = {
        id: `sol-${Date.now()}`,
        name: solName.trim(),
        frequency,
        amount: parseInt(amount),
        memberCount: parseInt(memberCount),
        winnersPerRound: parseInt(winnersPerRound),
        members: solMembers,
        currentRound: 1,
        startDate: new Date().toISOString(),
        status: "active",
        payments: [],
        events: [],
      };
      
      solStorage.saveSol(newSol);
      toast.success("Sòl kreye ak siksè!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Retounen</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {step > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <span className="font-medium hidden sm:inline">Konfigirasyon</span>
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  2
                </div>
                <span className="font-medium hidden sm:inline">Manm yo</span>
              </div>
            </div>
          </div>

          <Card className="p-6 md:p-8 shadow-card animate-scale-in">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl font-bold text-foreground">Konfigire Sòl Ou a</h2>
                  <p className="text-muted-foreground">Antre enfòmasyon debaz yo</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="solName" className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Non Sòl La
                    </Label>
                    <Input
                      id="solName"
                      data-testid="input-sol-name"
                      type="text"
                      placeholder="Ex: Sòl Fanmi"
                      value={solName}
                      onChange={(e) => setSolName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Frekans Peman
                    </Label>
                    <Select value={frequency} onValueChange={(value) => setFrequency(value as FrequencyType)}>
                      <SelectTrigger id="frequency" data-testid="select-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-success" />
                      Kantite Lajan (Goud)
                    </Label>
                    <Input
                      id="amount"
                      data-testid="input-amount"
                      type="number"
                      placeholder="Ex: 1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberCount" className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-warning" />
                      Kantite Manm
                    </Label>
                    <Input
                      id="memberCount"
                      data-testid="input-member-count"
                      type="number"
                      placeholder="Ex: 10"
                      value={memberCount}
                      onChange={(e) => setMemberCount(e.target.value)}
                      min="2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="winnersPerRound" className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-success" />
                      Konbyen Moun Resevwa Chak Vire
                    </Label>
                    <Input
                      id="winnersPerRound"
                      data-testid="input-winners-per-round"
                      type="number"
                      placeholder="Ex: 1"
                      value={winnersPerRound}
                      onChange={(e) => setWinnersPerRound(e.target.value)}
                      min="1"
                      max={memberCount || "1"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Ou ka chwazi 1 oswa plizyè moun resevwa lajan nan menm tan
                    </p>
                  </div>

                  {amount && memberCount && winnersPerRound && (
                    <Card className="p-4 bg-accent border-accent-foreground/20 space-y-2">
                      <p className="text-sm text-accent-foreground">
                        <span className="font-semibold">Total chak vire:</span> {parseInt(amount) * parseInt(memberCount || "0")} Goud
                      </p>
                      <p className="text-sm text-accent-foreground">
                        <span className="font-semibold">Chak moun resevwa:</span> {parseInt(amount) * parseInt(memberCount || "0")} Goud
                      </p>
                      <p className="text-sm text-accent-foreground">
                        <span className="font-semibold">Kantite vire total:</span> {Math.ceil(parseInt(memberCount || "0") / parseInt(winnersPerRound || "1"))} vire
                      </p>
                    </Card>
                  )}
                </div>

                <Button onClick={handleNextStep} className="w-full mt-6" size="lg" data-testid="button-continue">
                  Kontinye
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl font-bold text-foreground">Ajoute Manm yo</h2>
                  <p className="text-muted-foreground">
                    {members.length} / {memberCount} manm ajoute
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Non manm (ex: Jean Pierre)"
                      data-testid="input-member-name"
                      value={currentMember}
                      onChange={(e) => setCurrentMember(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddMember();
                        }
                      }}
                      disabled={members.length >= parseInt(memberCount)}
                    />
                    <Button
                      onClick={handleAddMember}
                      data-testid="button-add-member"
                      disabled={members.length >= parseInt(memberCount) || !currentMember.trim()}
                      size="lg"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  {members.length > 0 && (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <p className="text-sm text-muted-foreground mb-2">
                        <GripVertical className="w-4 h-4 inline mr-1" />
                        Kenbe epi deplase pou ranje lòd yo
                      </p>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={members}
                          strategy={verticalListSortingStrategy}
                        >
                          {members.map((member, index) => (
                            <SortableMemberItem
                              key={member}
                              id={member}
                              member={member}
                              index={index}
                              frequency={frequency}
                              onRemove={() => handleRemoveMember(index)}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={() => setStep(1)} variant="outline" size="lg" className="flex-1" data-testid="button-back">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Retounen
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    data-testid="button-create-sol"
                    disabled={members.length !== parseInt(memberCount)}
                    size="lg"
                    className="flex-1"
                  >
                    Kreye Sòl
                    <Check className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

interface SortableMemberItemProps {
  id: string;
  member: string;
  index: number;
  frequency: FrequencyType;
  onRemove: () => void;
}

const SortableMemberItem = ({ id, member, index, frequency, onRemove }: SortableMemberItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 flex items-center justify-between hover:shadow-card transition-shadow cursor-move"
    >
      <div className="flex items-center gap-3 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
          {index + 1}
        </div>
        <div>
          <p className="font-medium text-foreground">{member}</p>
          <p className="text-sm text-muted-foreground">
            Vire #{index + 1} - Ap touche nan {frequency === "weekly" ? `semèn ${index + 1}` : `peryòd ${index + 1}`}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onRemove}>
        <X className="w-4 h-4" />
      </Button>
    </Card>
  );
};

export default CreateSol;
