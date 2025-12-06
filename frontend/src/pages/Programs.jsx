import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Baby, Heart, Mountain, GraduationCap, Sparkles, ArrowRight, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { programs, focusAreas } from '../data/mock';

const Programs = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const categories = ['All', 'Women Empowerment', 'Child Development', 'Healthcare', 'Tribal Upliftment', 'Education', 'Youth Empowerment'];

  const filteredPrograms = activeFilter === 'All' 
    ? programs 
    : programs.filter(p => p.category === activeFilter);

  const getIcon = (iconName) => {
    const icons = {
      Users: <Users size={24} />,
      Baby: <Baby size={24} />,
      Heart: <Heart size={24} />,
      Mountain: <Mountain size={24} />,
      GraduationCap: <GraduationCap size={24} />,
      Sparkles: <Sparkles size={24} />,
    };
    return icons[iconName] || <Heart size={24} />;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-sage-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1600792174277-8d734290a61f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3NjUwNTY2MDR8MA&ixlib=rb-4.1.0&q=85"
            alt="Programs"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-sage-500/20 text-sage-300 rounded-full text-sm font-medium mb-6">
              Our Programs
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Programs That
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-400 to-ochre-400"> Transform Lives</span>
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              Discover our comprehensive range of development programs designed to uplift communities and create lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Focus Areas Overview */}
      <section className="py-16 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {focusAreas.map((area) => (
              <div
                key={area.id}
                className="group p-4 rounded-xl bg-stone-50 hover:bg-terracotta-50 transition-all duration-300 cursor-pointer text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white shadow-sm flex items-center justify-center text-terracotta-600 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(area.icon)}
                </div>
                <h3 className="text-sm font-medium text-stone-700 group-hover:text-terracotta-700">
                  {area.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Filter & Grid */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800">
                Active Programs
              </h2>
              <p className="text-stone-600 mt-2">Filter by category to explore our initiatives</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilter === category
                      ? 'bg-terracotta-600 text-white shadow-lg shadow-terracotta-500/25'
                      : 'bg-white text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-stone-700">
                      {program.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-heading font-bold text-white">
                      {program.title}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-stone-600 leading-relaxed mb-4">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div>
                      <p className="text-2xl font-bold text-terracotta-600">
                        {program.beneficiaries.toLocaleString()}
                      </p>
                      <p className="text-xs text-stone-500">Beneficiaries</p>
                    </div>
                    <Link to="/donate">
                      <Button size="sm" className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                        Support
                        <ArrowRight className="ml-1" size={14} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Details */}
      {focusAreas.map((area, index) => (
        <section key={area.id} className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className={index % 2 !== 0 ? 'md:order-2' : ''}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                </div>
              </div>
              <div className={index % 2 !== 0 ? 'md:order-1' : ''}>
                <div className="w-14 h-14 rounded-2xl bg-terracotta-100 flex items-center justify-center mb-6 text-terracotta-600">
                  {getIcon(area.icon)}
                </div>
                <h2 className="font-heading text-3xl font-bold text-stone-800 mb-4">
                  {area.title}
                </h2>
                <p className="text-stone-600 leading-relaxed mb-6">
                  {area.description}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-terracotta-500" />
                    <span className="text-stone-600">Community-driven approach for sustainable impact</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-terracotta-500" />
                    <span className="text-stone-600">Regular monitoring and evaluation of outcomes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-terracotta-500" />
                    <span className="text-stone-600">Collaboration with local stakeholders</span>
                  </li>
                </ul>
                <Link to="/donate">
                  <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                    Support This Program
                    <Heart className="ml-2" size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-terracotta-600 to-ochre-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Want to Start a Program in Your Area?
          </h2>
          <p className="text-terracotta-100 text-lg mb-8">
            Partner with us to bring development programs to your community
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

export default Programs;
