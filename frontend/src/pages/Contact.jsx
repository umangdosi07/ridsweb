import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ngoInfo } from '../data/mock';
import { toast } from 'sonner';
import { inquiriesAPI } from '../services/api';

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setContactForm(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await inquiriesAPI.create(contactForm);
      toast.success('Thank you for your message! We will get back to you soon.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-terracotta-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1689428615940-64d549e2231c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxoZWFsdGhjYXJlJTIwcnVyYWwlMjB2aWxsYWdlfGVufDB8fHx8MTc2NTA1NjYxMHww&ixlib=rb-4.1.0&q=85"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-terracotta-500/20 text-terracotta-300 rounded-full text-sm font-medium mb-6">
              Contact Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-400 to-ochre-400"> Touch</span>
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              Have questions? Want to volunteer or partner with us? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 -mt-20 relative z-10">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-terracotta-100 flex items-center justify-center text-terracotta-600">
                  <MapPin size={24} />
                </div>
                <h3 className="font-heading font-bold text-stone-800 mb-2">Address</h3>
                <p className="text-stone-600 text-sm">{ngoInfo.address}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
                  <Phone size={24} />
                </div>
                <h3 className="font-heading font-bold text-stone-800 mb-2">Phone</h3>
                <a href={`tel:${ngoInfo.phone}`} className="text-stone-600 text-sm hover:text-terracotta-600 transition-colors">
                  {ngoInfo.phone}
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-ochre-100 flex items-center justify-center text-ochre-600">
                  <Mail size={24} />
                </div>
                <h3 className="font-heading font-bold text-stone-800 mb-2">Email</h3>
                <a href={`mailto:${ngoInfo.email}`} className="text-stone-600 text-sm hover:text-terracotta-600 transition-colors break-all">
                  {ngoInfo.email}
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
                  <Clock size={24} />
                </div>
                <h3 className="font-heading font-bold text-stone-800 mb-2">Office Hours</h3>
                <p className="text-stone-600 text-sm">Mon - Sat: 9AM - 6PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 bg-terracotta-100 text-terracotta-700 rounded-full text-sm font-medium mb-4">
                  Send a Message
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                  We'd Love to Hear From You
                </h2>
                <p className="text-stone-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={contactForm.phone}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subject *</Label>
                        <Select onValueChange={handleSelectChange} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="volunteer">Volunteering</SelectItem>
                            <SelectItem value="donate">Donations</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="media">Media Inquiry</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="How can we help you?"
                        rows={5}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="mr-2" size={18} />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-2xl h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58765.95307248698!2d74.40817297143373!3d23.546621618879746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39650102e7000001%3A0xfe8d8e0c63e82190!2sBanswara%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RIDS Location"
                />
              </div>

              {/* Chief Functionary */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-terracotta-50 to-ochre-50">
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-bold text-stone-800 mb-4">
                    Chief Functionary
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-terracotta-200 flex items-center justify-center">
                      <span className="text-2xl font-heading font-bold text-terracotta-600">KD</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-800">{ngoInfo.chiefFunctionary}</p>
                      <p className="text-stone-600 text-sm">Chief Functionary</p>
                      <p className="text-stone-500 text-sm mt-1">{ngoInfo.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Options */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-bold text-stone-800 mb-4">
                    Quick Contact
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={`tel:${ngoInfo.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 hover:bg-terracotta-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-stone-800 group-hover:text-terracotta-600 transition-colors">Call Us</p>
                        <p className="text-stone-500 text-sm">{ngoInfo.phone}</p>
                      </div>
                      <ArrowRight className="ml-auto text-stone-400 group-hover:text-terracotta-600 transition-colors" size={16} />
                    </a>
                    <a
                      href={`mailto:${ngoInfo.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 hover:bg-sage-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center text-sage-600">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-stone-800 group-hover:text-sage-600 transition-colors">Email Us</p>
                        <p className="text-stone-500 text-sm">{ngoInfo.email}</p>
                      </div>
                      <ArrowRight className="ml-auto text-stone-400 group-hover:text-sage-600 transition-colors" size={16} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-stone-800 to-stone-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-stone-300 text-lg mb-8">
            Join us in our mission to transform lives and empower communities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/donate">
              <Button size="lg" className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                Donate Now
              </Button>
            </a>
            <a href="/get-involved">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Volunteer
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
