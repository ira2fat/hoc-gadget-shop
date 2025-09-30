import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  
  // Company information
  companyName = 'Online Shop';
  foundedYear = 2024;
  currentYear = new Date().getFullYear();
  
  // Mission and values
  mission = 'To provide high-quality products and exceptional customer service to customers worldwide. We strive to make online shopping simple, secure, and enjoyable for everyone.';
  
  // Team members
  teamMembers = [
    {
      name: 'John Smith',
      position: 'CEO & Founder',
      experience: '10+ years in e-commerce'
    },
    {
      name: 'Sarah Johnson',
      position: 'Head of Operations',
      experience: '8+ years in logistics'
    },
    {
      name: 'Mike Davis',
      position: 'Technology Director',
      experience: '12+ years in software development'
    }
  ];
  
  // Company statistics
  stats = [
    { label: 'Happy Customers', value: '50,000+', icon: '👥' },
    { label: 'Products Sold', value: '200,000+', icon: '📦' },
    { label: 'Years of Service', value: `${this.currentYear - this.foundedYear}+`, icon: '🏆' },
    { label: 'Countries Served', value: '25+', icon: '🌍' }
  ];
  
  // Core values
  values = [
    {
      title: 'Quality First',
      description: 'We source only the highest quality products from trusted suppliers worldwide.',
      icon: '⭐'
    },
    {
      title: 'Customer Focus',
      description: 'Our customers are at the heart of everything we do. Your satisfaction is our priority.',
      icon: '❤️'
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform and services using cutting-edge technology.',
      icon: '💡'
    },
    {
      title: 'Trust & Security',
      description: 'Your personal data and transactions are always protected with enterprise-grade security.',
      icon: '🔒'
    }
  ];

  constructor() { }
}
