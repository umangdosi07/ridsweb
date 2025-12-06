import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, Heart, ArrowRight, Play, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { successStories, impactStats } from '../data/mock';

const Impact = () => {
  const beforeAfterStories = [
    {
      title: 'Village Transformation',
      before: 'Limited access to clean water and healthcare',
      after: 'Clean water systems and regular health camps serving 500+ families',
      image: 'https://images.unsplash.com/photo-1689428615940-64d549e2231c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxoZWFsdGhjYXJlJTIwcnVyYWwlMjB2aWxsYWdlfGVufDB8fHx8MTc2NTA1NjYxMHww&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Women Entrepreneurship',
      before: 'Women dependent on seasonal agricultural labor',
      after: '200+ women running successful micro-enterprises',
      image: 'https://images.unsplash.com/photo-1724737419548-1e733c69efd5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHx3b21lbiUyMGVtcG93ZXJtZW50JTIwSW5kaWF8ZW58MHx8fHwxNzY1MDU2NTk5fDA&ixlib=rb-4.1.0&q=85'
    },
    {
      title: 'Education Access',
      before: 'Only 30% children attending school regularly',
      after: '95% enrollment rate with improved learning outcomes',
      image: 'https://images.pexels.com/photos/4314674/pexels-photo-4314674.jpeg'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-ochre-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1601689892697-b64daa00ff6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxydXJhbCUyMEluZGlhJTIwY29tbXVuaXR5fGVufDB8fHx8MTc2NTA1NjU5M3ww&ixlib=rb-4.1.0&q=85"
            alt="Impact"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/70" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-ochre-500/20 text-ochre-300 rounded-full text-sm font-medium mb-6">
              Our Impact
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Stories of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre-400 to-terracotta-400"> Transformation</span>
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              Real stories, real impact. See how your support has transformed lives and communities across rural Rajasthan.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-terracotta-50 to-ochre-50">
                <h3 className="text-4xl md:text-5xl font-bold text-terracotta-600 font-heading">{stat.number}</h3>
                <p className="text-stone-600 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-terracotta-100 text-terracotta-700 rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Voices of Change
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Hear directly from the people whose lives have been transformed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card key={story.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="relative h-72">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 rounded-full bg-terracotta-500 flex items-center justify-center">
                      <Quote className="text-white" size={20} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 bg-terracotta-500 text-white text-xs rounded-full">
                      {story.program}
                    </span>
                    <h3 className="text-2xl font-heading font-bold text-white mt-3">{story.name}</h3>
                    <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {story.location}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-stone-600 italic leading-relaxed text-lg">
                    "{story.story}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
              Transformation
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Before & After
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Witness the tangible changes we've brought to communities
            </p>
          </div>

          <div className="space-y-16">
            {beforeAfterStories.map((item, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
                <div className={index % 2 !== 0 ? 'md:order-2' : ''}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                </div>
                <div className={index % 2 !== 0 ? 'md:order-1' : ''}>
                  <h3 className="font-heading text-2xl font-bold text-stone-800 mb-6">{item.title}</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-red-50 border-l-4 border-red-400">
                      <p className="text-sm font-medium text-red-700 mb-1">Before</p>
                      <p className="text-stone-700">{item.before}</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <ArrowRight className="text-terracotta-500 rotate-90" size={24} />
                    </div>
                    
                    <div className="p-4 rounded-xl bg-green-50 border-l-4 border-green-500">
                      <p className="text-sm font-medium text-green-700 mb-1">After</p>
                      <p className="text-stone-700">{item.after}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas Map Placeholder */}
      <section className="py-20 bg-gradient-to-br from-terracotta-50 via-ochre-50 to-sage-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white text-terracotta-700 rounded-full text-sm font-medium mb-4 shadow-sm">
              Our Reach
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Areas We Serve
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Working across Banswara district and surrounding tribal areas
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-terracotta-50">
                <h3 className="text-3xl font-bold text-terracotta-600 font-heading">150+</h3>
                <p className="text-stone-600 mt-2">Villages Covered</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-ochre-50">
                <h3 className="text-3xl font-bold text-ochre-600 font-heading">5</h3>
                <p className="text-stone-600 mt-2">Blocks in Banswara</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-sage-50">
                <h3 className="text-3xl font-bold text-sage-600 font-heading">3</h3>
                <p className="text-stone-600 mt-2">Neighboring Districts</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-stone-50 rounded-xl">
              <h4 className="font-heading text-lg font-bold text-stone-800 mb-4">Primary Areas of Operation</h4>
              <div className="flex flex-wrap gap-2">
                {['Banswara', 'Kushalgarh', 'Sajjangarh', 'Ghatol', 'Bagidora', 'Anandpuri', 'Talwara'].map((area) => (
                  <span key={area} className="px-4 py-2 bg-white rounded-full text-sm text-stone-600 shadow-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-terracotta-600 to-ochre-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Be Part of These Stories
          </h2>
          <p className="text-terracotta-100 text-lg mb-8">
            Your contribution can help create more success stories and transform more lives
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button size="lg" className="bg-white text-terracotta-700 hover:bg-white/90">
                <Heart className="mr-2" size={20} />
                Donate Now
              </Button>
            </Link>
            <Link to="/get-involved">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Share Your Story
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;
