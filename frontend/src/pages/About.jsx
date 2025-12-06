import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Eye, Award, Users, Calendar, MapPin, ArrowRight, Quote } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ngoInfo, impactStats, teamMembers } from '../data/mock';

const About = () => {
  const milestones = [
    { year: '1998', title: 'Foundation', description: 'RIDS established in Banswara, Rajasthan' },
    { year: '2003', title: 'First Major Program', description: 'Launched women self-help group initiative' },
    { year: '2008', title: 'Expansion', description: 'Extended operations to 50+ villages' },
    { year: '2015', title: 'Healthcare Initiative', description: 'Started mobile health clinic program' },
    { year: '2020', title: 'Education Milestone', description: 'Supported 10,000+ students' },
    { year: '2025', title: 'Continuing Growth', description: '27 years of dedicated service' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-terracotta-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1689428615940-64d549e2231c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxoZWFsdGhjYXJlJTIwcnVyYWwlMjB2aWxsYWdlfGVufDB8fHx8MTc2NTA1NjYxMHww&ixlib=rb-4.1.0&q=85"
            alt="Village"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-terracotta-500/20 text-terracotta-300 rounded-full text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Story of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-400 to-ochre-400"> Hope & Change</span>
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              For over 27 years, Rajasthan Integrated Development Society has been at the forefront of community development, empowering thousands of lives across rural Rajasthan.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-terracotta-50 to-white hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-terracotta-100 flex items-center justify-center mb-6">
                  <Target className="text-terracotta-600" size={28} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-stone-800 mb-4">Our Mission</h3>
                <p className="text-stone-600 leading-relaxed">
                  To empower marginalized communities through sustainable development programs, focusing on women empowerment, child welfare, healthcare, and education in rural Rajasthan.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-sage-50 to-white hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center mb-6">
                  <Eye className="text-sage-600" size={28} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-stone-800 mb-4">Our Vision</h3>
                <p className="text-stone-600 leading-relaxed">
                  A society where every individual, especially from tribal and rural communities, has equal opportunities for growth, dignity, and a sustainable livelihood.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-ochre-50 to-white hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-ochre-100 flex items-center justify-center mb-6">
                  <Heart className="text-ochre-600" size={28} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-stone-800 mb-4">Our Values</h3>
                <p className="text-stone-600 leading-relaxed">
                  Integrity, transparency, community participation, and sustainable impact guide everything we do. We believe in empowering communities to lead their own development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chief Functionary Message */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-terracotta-200 to-ochre-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                      <span className="text-5xl font-heading font-bold text-terracotta-600">KD</span>
                    </div>
                    <p className="text-stone-600 text-sm">Photo coming soon</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-terracotta-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Quote className="text-white" size={40} />
              </div>
            </div>

            <div>
              <span className="inline-block px-4 py-1.5 bg-terracotta-100 text-terracotta-700 rounded-full text-sm font-medium mb-6">
                Message from Leadership
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mb-6">
                From the Desk of Chief Functionary
              </h2>
              <blockquote className="text-lg text-stone-600 leading-relaxed mb-6 italic border-l-4 border-terracotta-400 pl-6">
                "{teamMembers[0].message}"
              </blockquote>
              <div>
                <h4 className="font-heading text-xl font-bold text-stone-800">{teamMembers[0].name}</h4>
                <p className="text-terracotta-600">{teamMembers[0].role}</p>
                <p className="text-stone-500 text-sm mt-1">{ngoInfo.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-ochre-100 text-ochre-700 rounded-full text-sm font-medium mb-4">
              Our Journey
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-800">
              Milestones of Impact
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-terracotta-200 via-ochre-200 to-sage-200 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="inline-block border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <span className="text-3xl font-heading font-bold text-terracotta-600">{milestone.year}</span>
                        <h3 className="font-heading text-xl font-bold text-stone-800 mt-2">{milestone.title}</h3>
                        <p className="text-stone-600 mt-2">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-terracotta-500 border-4 border-white shadow-lg z-10 hidden md:block" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-br from-terracotta-600 to-terracotta-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
            <p className="text-terracotta-100 text-lg">Decades of dedicated service, countless lives transformed</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                  {stat.icon === 'Users' && <Users className="text-white" size={28} />}
                  {stat.icon === 'Calendar' && <Calendar className="text-white" size={28} />}
                  {stat.icon === 'MapPin' && <MapPin className="text-white" size={28} />}
                  {stat.icon === 'Heart' && <Heart className="text-white" size={28} />}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white font-heading">{stat.number}</h3>
                <p className="text-terracotta-100 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mb-6">
            Be Part of Our Story
          </h2>
          <p className="text-stone-600 text-lg mb-8">
            Join us in our mission to create lasting change. Your support makes all the difference.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button size="lg" className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                <Heart className="mr-2" size={20} />
                Support Our Cause
              </Button>
            </Link>
            <Link to="/get-involved">
              <Button size="lg" variant="outline" className="border-terracotta-200 text-terracotta-600 hover:bg-terracotta-50">
                Become a Volunteer
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
