import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Handshake, Calendar, MapPin, Clock, ArrowRight, CheckCircle, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { volunteerOpportunities } from '../data/mock';
import { toast } from 'sonner';

const GetInvolved = () => {
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interest: '',
    availability: '',
    experience: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVolunteerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setVolunteerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission - will be replaced with actual API call
    setTimeout(() => {
      toast.success('Thank you for your interest! We will contact you soon.');
      setVolunteerForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        interest: '',
        availability: '',
        experience: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const partnershipTypes = [
    {
      icon: <Handshake size={32} />,
      title: 'Corporate Partnership',
      description: 'CSR initiatives, employee volunteering programs, and strategic collaborations'
    },
    {
      icon: <Users size={32} />,
      title: 'NGO Collaboration',
      description: 'Joint programs, knowledge sharing, and resource pooling with like-minded organizations'
    },
    {
      icon: <Heart size={32} />,
      title: 'Individual Philanthropy',
      description: 'Major gifts, legacy giving, and sustained support for our programs'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-sage-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/19957638/pexels-photo-19957638.jpeg"
            alt="Volunteers"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-sage-500/20 text-sage-300 rounded-full text-sm font-medium mb-6">
              Get Involved
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Join Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-400 to-ochre-400"> Mission</span>
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              There are many ways to contribute to our cause. Whether you volunteer your time, partner with us, or support our work, every contribution matters.
            </p>
          </div>
        </div>
      </section>

      {/* Ways to Get Involved */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-terracotta-100 to-terracotta-50 flex items-center justify-center text-terracotta-600 group-hover:scale-110 transition-transform duration-300">
                  <Users size={36} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-stone-800 mb-3">Volunteer</h3>
                <p className="text-stone-600 mb-6">Share your skills and time to directly impact communities in need</p>
                <a href="#volunteer-form">
                  <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white w-full">
                    Apply Now
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sage-100 to-sage-50 flex items-center justify-center text-sage-600 group-hover:scale-110 transition-transform duration-300">
                  <Handshake size={36} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-stone-800 mb-3">Partner</h3>
                <p className="text-stone-600 mb-6">Collaborate with us for greater impact through strategic partnerships</p>
                <Link to="/contact">
                  <Button variant="outline" className="border-sage-200 text-sage-600 hover:bg-sage-50 w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-ochre-100 to-ochre-50 flex items-center justify-center text-ochre-600 group-hover:scale-110 transition-transform duration-300">
                  <Heart size={36} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-stone-800 mb-3">Donate</h3>
                <p className="text-stone-600 mb-6">Support our programs financially and help us reach more beneficiaries</p>
                <Link to="/donate">
                  <Button className="bg-ochre-600 hover:bg-ochre-700 text-white w-full">
                    Donate Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-terracotta-100 text-terracotta-700 rounded-full text-sm font-medium mb-4">
              Volunteer Opportunities
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Make a Difference
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Choose from various volunteering roles based on your skills and interests
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {volunteerOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="border border-stone-100 hover:border-terracotta-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-heading text-xl font-bold text-stone-800">
                      {opportunity.title}
                    </h3>
                    <span className="px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-xs font-medium">
                      {opportunity.duration}
                    </span>
                  </div>
                  <p className="text-stone-600 mb-4">{opportunity.description}</p>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {opportunity.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {opportunity.duration}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      <section id="volunteer-form" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
              Apply to Volunteer
            </span>
            <h2 className="font-heading text-4xl font-bold text-stone-800 mb-4">
              Join Our Team
            </h2>
            <p className="text-stone-600 text-lg">
              Fill out the form below and we'll get in touch with you
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
                      value={volunteerForm.name}
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
                      value={volunteerForm.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={volunteerForm.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={volunteerForm.city}
                      onChange={handleInputChange}
                      placeholder="Your city"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Area of Interest *</Label>
                    <Select onValueChange={(value) => handleSelectChange('interest', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your interest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teaching">Teaching & Education</SelectItem>
                        <SelectItem value="healthcare">Healthcare Support</SelectItem>
                        <SelectItem value="skill-training">Skill Training</SelectItem>
                        <SelectItem value="community">Community Outreach</SelectItem>
                        <SelectItem value="admin">Administrative Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Availability *</Label>
                    <Select onValueChange={(value) => handleSelectChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="fulltime">Full Time (3+ months)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={volunteerForm.experience}
                    onChange={handleInputChange}
                    placeholder="Brief description of relevant experience"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Why do you want to volunteer with RIDS?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={volunteerForm.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your motivation..."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="mr-2" size={18} />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20 bg-gradient-to-br from-stone-50 to-sage-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white text-sage-700 rounded-full text-sm font-medium mb-4 shadow-sm">
              Partnership Opportunities
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Partner With Us
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Explore different ways your organization can collaborate with RIDS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-sage-100 flex items-center justify-center text-sage-600 mb-6">
                    {type.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-stone-800 mb-3">
                    {type.title}
                  </h3>
                  <p className="text-stone-600 mb-6">{type.description}</p>
                  <Link to="/contact" className="inline-flex items-center text-sage-600 font-medium hover:gap-3 transition-all gap-2">
                    Contact Us <ArrowRight size={16} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-terracotta-600 to-ochre-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Have Questions?
          </h2>
          <p className="text-terracotta-100 text-lg mb-8">
            We're here to help. Reach out to us for any queries about volunteering or partnerships.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-terracotta-700 hover:bg-white/90">
              Contact Us
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
