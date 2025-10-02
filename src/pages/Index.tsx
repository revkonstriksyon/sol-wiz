import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Wallet, Users, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Digital Sòl</h1>
          </div>
          <Link to="/create">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Kreye Sòl
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Jere Sòl Ou a
            <span className="block text-transparent bg-clip-text bg-gradient-primary mt-2">
              San Konplikasyon
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Yon platfòm modèn pou jere tontin ou a. Sivman peman, kalendriye otomatik, e rapò klè pou tout manm yo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/create">
              <Button size="lg" className="gap-2 h-12 px-8 text-lg">
                <Plus className="w-5 h-5" />
                Kreye Premye Sòl Ou
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-lg">
                <Calendar className="w-5 h-5" />
                Wè Sòl Yo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Poukisa Chwazi Digital Sòl?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4 hover:shadow-elegant transition-all duration-300 animate-slide-up border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Kalendriye Otomatik</h4>
              <p className="text-muted-foreground">
                Sistèm nan jenere tout dat pou ou. Chak moun konnen kilè yo pral touche.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-elegant transition-all duration-300 animate-slide-up border-border" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Jesyon Manm</h4>
              <p className="text-muted-foreground">
                Swiv chak manm, peman yo, ak retar yo. Tout bagay klè e transparent.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-elegant transition-all duration-300 animate-slide-up border-border" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Rapò Real-time</h4>
              <p className="text-muted-foreground">
                Wè estatistik, progress, ak rapò detaye sou tout sòl yo an tan reyèl.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-primary border-0 shadow-elegant">
            <h3 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Pare pou Kòmanse?
            </h3>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Kreye premye sòl ou a jodi a e kòmanse jere lajan ou san efò.
            </p>
            <Link to="/create">
              <Button size="lg" variant="secondary" className="gap-2 h-12 px-8 text-lg">
                <Plus className="w-5 h-5" />
                Kreye Sòl Kounye a
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Digital Sòl. Tout dwa rezève.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
