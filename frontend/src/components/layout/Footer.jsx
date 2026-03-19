import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Heart, ArrowRight } from 'lucide-react';
import { ngoInfo } from '../../data/mock';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { newsletterAPI } from '../../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setIsSubscribing(true);
    try {
      await newsletterAPI.subscribe(email);
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      if (error.response?.data?.detail === 'Email already subscribed') {
        toast.info('You are already subscribed!');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/programs', label: 'Our Programs' },
    { path: '/impact', label: 'Impact Stories' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/news', label: 'News & Updates' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const programs = [
    { label: 'Women Empowerment' },
    { label: 'Child Development' },
    { label: 'Healthcare' },
    { label: 'Tribal Upliftment' },
    { label: 'Education' },
    { label: 'Youth Empowerment' },
  ];

  return (
    <footer className="bg-stone-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-terracotta-700 to-ochre-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-heading font-bold text-white">Stay Connected</h3>
              <p className="text-terracotta-100 mt-1">Subscribe to receive updates on our work and impact</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-w-[280px]"
              />
              <Button type="submit" className="bg-white text-terracotta-700 hover:bg-white/90" disabled={isSubscribing}>
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                {!isSubscribing && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-ochre-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-white">{ngoInfo.shortName}</h3>
                <p className="text-xs text-stone-400">Est. {ngoInfo.foundedYear}</p>
              </div>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              {ngoInfo.tagline}. Working towards sustainable development and community empowerment in rural Rajasthan.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-terracotta-600 transition-colors duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-stone-400 hover:text-terracotta-400 transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    <ArrowRight size={14} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Our Programs</h4>
            <ul className="space-y-3">
              {programs.map((program, index) => (
                <li key={index}>
                  <Link
                    to="/programs"
                    className="text-stone-400 hover:text-terracotta-400 transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    <ArrowRight size={14} />
                    {program.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={20} className="text-terracotta-400 flex-shrink-0 mt-1" />
                <span className="text-stone-400 text-sm">{ngoInfo.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={20} className="text-terracotta-400 flex-shrink-0" />
                <a href={`tel:${ngoInfo.phone}`} className="text-stone-400 text-sm hover:text-terracotta-400 transition-colors">
                  {ngoInfo.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={20} className="text-terracotta-400 flex-shrink-0" />
                <a href={`mailto:${ngoInfo.email}`} className="text-stone-400 text-sm hover:text-terracotta-400 transition-colors">
                  {ngoInfo.email}
                </a>
              </li>
            </ul>

            <Link to="/donate" className="inline-block mt-6">
              <Button className="bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-700 hover:to-terracotta-600 text-white">
                <Heart size={16} className="mr-2" />
                Support Our Cause
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm">
              © {new Date().getFullYear()} {ngoInfo.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-stone-500 hover:text-stone-300 transition-colors">
               Privacy Policy & Terms of Use
              </Link>
              <Link to="/terms" className="text-stone-500 hover:text-stone-300 transition-colors">
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
