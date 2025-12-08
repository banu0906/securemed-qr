import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeartPulseIcon } from '@/components/icons/MedicalIcons';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, QrCode, Home } from 'lucide-react';

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg medical-gradient shadow-medical group-hover:scale-105 transition-transform duration-200">
            <HeartPulseIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">QuickAid</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>

          <Button
            variant={isActive('/profile') ? 'secondary' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>

          <Button
            variant={isActive('/qr-code') ? 'secondary' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/qr-code" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Code</span>
            </Link>
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Sign Out</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
