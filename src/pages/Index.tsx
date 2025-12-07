import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeartPulseIcon, ShieldCheckIcon, QRIcon } from '@/components/icons/MedicalIcons';
import { ArrowRight, Smartphone, Clock, Users } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 medical-gradient-soft" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            {/* Logo */}
            <div className="inline-flex items-center gap-3 p-4 rounded-2xl medical-gradient shadow-medical mb-8">
              <HeartPulseIcon className="h-10 w-10 text-primary-foreground" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Emergency
              <br />
              <span className="text-primary">Medical Profile</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              In Case of Emergency, your vital medical information is just one QR scan away. 
              Fast, secure, and potentially life-saving.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="medical" size="xl" asChild>
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/auth">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose ICE Profile?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <CardContent className="py-8 text-center">
                <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                  <QRIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">QR Code Access</h3>
                <p className="text-muted-foreground">
                  Emergency responders can instantly access your vital medical information by scanning your unique QR code.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardContent className="py-8 text-center">
                <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your medical data is encrypted and only accessible through your personal QR code. No data on your lock screen.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <CardContent className="py-8 text-center">
                <div className="inline-flex p-4 rounded-xl bg-success/10 mb-4">
                  <Clock className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Instant Updates</h3>
                <p className="text-muted-foreground">
                  Update your medical information anytime. Changes are reflected immediately - no need to regenerate QR codes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Create Your Profile',
                  description: 'Sign up and add your medical conditions, allergies, medications, and emergency contacts.',
                  icon: Users
                },
                {
                  step: '2',
                  title: 'Get Your QR Code',
                  description: 'Receive a unique QR code that links to your emergency medical profile.',
                  icon: QRIcon
                },
                {
                  step: '3',
                  title: 'Keep It Accessible',
                  description: 'Add the QR code to your lock screen, wallet, or medical ID bracelet for quick access.',
                  icon: Smartphone
                }
              ].map((item, index) => (
                <div 
                  key={item.step}
                  className="flex gap-6 items-start animate-slide-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full medical-gradient flex items-center justify-center text-primary-foreground font-bold text-lg shadow-medical">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 medical-gradient">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Be Prepared for Any Emergency
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Create your free emergency medical profile today. It takes less than 5 minutes and could save your life.
          </p>
          <Button variant="secondary" size="xl" asChild>
            <Link to="/auth">
              Create Your Profile
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulseIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">ICE Profile</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ICE Profile. Emergency medical information at your fingertips.
          </p>
        </div>
      </footer>
    </div>
  );
}
