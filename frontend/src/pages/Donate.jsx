import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, CheckCircle, ArrowRight, Gift, Users, GraduationCap, Stethoscope, Info, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { donationTiers, ngoInfo } from '../data/mock';
import { toast } from 'sonner';
import { donationsAPI } from '../services/api';

const Donate = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    address: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const amounts = [500, 1000, 2500, 5000, 10000, 25000];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseInt(value) || 0);
    }
  };

  const getImpactText = (amount) => {
    const tier = donationTiers.find(t => t.amount <= amount);
    return tier ? tier.impact : 'Make a meaningful contribution';
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    
    if (!donorInfo.name || !donorInfo.email || !donorInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedAmount < 100) {
      toast.error('Minimum donation amount is ₹100');
      return;
    }

    setIsProcessing(true);

    try {
      const donationData = {
        ...donorInfo,
        amount: selectedAmount,
        type: donationType
      };
      
      const result = await donationsAPI.createOrder(donationData);
      toast.success('Donation recorded! Payment gateway integration pending. Thank you for your generosity!');
      console.log('Order created:', result);
      
      // Reset form
      setDonorInfo({ name: '', email: '', phone: '', pan: '', address: '' });
      setSelectedAmount(1000);
      setCustomAmount('');
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error('Failed to process donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const impactIcons = [
    { icon: <GraduationCap size={24} />, label: 'Education', amount: '₹500' },
    { icon: <Users size={24} />, label: 'Women', amount: '₹1,000' },
    { icon: <Stethoscope size={24} />, label: 'Healthcare', amount: '₹2,500' },
    { icon: <Gift size={24} />, label: 'Livelihood', amount: '₹5,000' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-terracotta-700 via-terracotta-600 to-ochre-600">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hearts" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M5 2 C3 0, 0 1, 0 3 C0 5, 5 8, 5 8 C5 8, 10 5, 10 3 C10 1, 7 0, 5 2" fill="white" />
            </pattern>
            <rect width="100" height="100" fill="url(#hearts)" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Heart className="text-white" size={18} />
            <span className="text-white/90 text-sm">Every contribution matters</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Transform Lives With Your Gift
          </h1>
          <p className="text-xl text-terracotta-100 max-w-2xl mx-auto">
            Your donation directly supports education, healthcare, and empowerment programs for tribal communities in Rajasthan.
          </p>
        </div>
      </section>

      {/* Impact Visualization */}
      <section className="py-12 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-stone-800">Your Impact at a Glance</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impactIcons.map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-stone-50 to-white border border-stone-100 text-center group hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-terracotta-100 flex items-center justify-center text-terracotta-600 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <p className="text-stone-600 text-sm mb-1">{item.label}</p>
                <p className="font-bold text-terracotta-600">{item.amount}/mo</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Donation Form */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-terracotta-600 to-ochre-600 p-6">
                  <h2 className="font-heading text-2xl font-bold text-white">Make a Donation</h2>
                  <p className="text-terracotta-100 mt-1">Choose your giving preference</p>
                </div>

                <CardContent className="p-6">
                  <form onSubmit={handleDonate} className="space-y-8">
                    {/* Donation Type */}
                    <div>
                      <Label className="text-base font-medium mb-4 block">Donation Type</Label>
                      <Tabs value={donationType} onValueChange={setDonationType} className="w-full">
                        <TabsList className="grid grid-cols-2 w-full">
                          <TabsTrigger value="one-time">One-Time</TabsTrigger>
                          <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      {donationType === 'monthly' && (
                        <p className="text-sm text-sage-600 mt-2 flex items-center gap-1">
                          <CheckCircle size={14} />
                          Recurring donations create sustained impact
                        </p>
                      )}
                    </div>

                    {/* Amount Selection */}
                    <div>
                      <Label className="text-base font-medium mb-4 block">Select Amount (₹)</Label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {amounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handleAmountSelect(amount)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              selectedAmount === amount && !customAmount
                                ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                                : 'border-stone-200 hover:border-terracotta-300 hover:bg-stone-50'
                            }`}
                          >
                            <span className="font-bold text-lg">₹{amount.toLocaleString()}</span>
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">₹</span>
                        <Input
                          type="number"
                          placeholder="Enter custom amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="pl-8"
                          min="100"
                        />
                      </div>
                    </div>

                    {/* Impact Message */}
                    {selectedAmount >= 500 && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-sage-50 to-ochre-50 border border-sage-200">
                        <p className="text-sage-800 font-medium flex items-start gap-2">
                          <Gift className="text-sage-600 flex-shrink-0 mt-0.5" size={18} />
                          <span>Your ₹{selectedAmount.toLocaleString()} can {getImpactText(selectedAmount).toLowerCase()}</span>
                        </p>
                      </div>
                    )}

                    {/* Donor Information */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium block">Your Information</Label>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={donorInfo.name}
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
                            value={donorInfo.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={donorInfo.phone}
                            onChange={handleInputChange}
                            placeholder="+91 XXXXX XXXXX"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pan">PAN (for 80G receipt)</Label>
                          <Input
                            id="pan"
                            name="pan"
                            value={donorInfo.pan}
                            onChange={handleInputChange}
                            placeholder="ABCDE1234F"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={donorInfo.address}
                          onChange={handleInputChange}
                          placeholder="Your address (optional)"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-700 hover:to-terracotta-600 text-white text-lg py-6 shadow-xl shadow-terracotta-500/25"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        'Processing...'
                      ) : (
                        <>
                          <Heart className="mr-2" size={20} />
                          Donate ₹{selectedAmount.toLocaleString()} {donationType === 'monthly' ? '/month' : ''}
                        </>
                      )}
                    </Button>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
                      <Lock size={14} />
                      <span>Secure payment powered by Razorpay</span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trust Badges */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                    <Shield className="text-sage-600" size={20} />
                    Why Donate to RIDS?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      '27+ years of grassroots work',
                      'Direct community impact',
                      'Transparent fund utilization',
                      '80G tax exemption available',
                      'Regular progress updates'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-stone-600">
                        <CheckCircle className="text-sage-500 flex-shrink-0 mt-0.5" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Fund Allocation */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                    <Info className="text-ochre-600" size={20} />
                    How Funds Are Used
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Program Expenses', percentage: 75, color: 'bg-terracotta-500' },
                      { label: 'Operations', percentage: 15, color: 'bg-ochre-500' },
                      { label: 'Administration', percentage: 10, color: 'bg-sage-500' }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-stone-600">{item.label}</span>
                          <span className="font-medium text-stone-800">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact for Large Donations */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-terracotta-50 to-ochre-50">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-bold text-stone-800 mb-2">
                    Planning a Major Gift?
                  </h3>
                  <p className="text-stone-600 text-sm mb-4">
                    For donations above ₹1,00,000 or corporate giving, please contact us directly.
                  </p>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full border-terracotta-200 text-terracotta-600 hover:bg-terracotta-50">
                      Contact Us
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Other Ways to Give */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-bold text-stone-800 mb-4">
                    Other Ways to Give
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-stone-50 rounded-lg">
                      <p className="font-medium text-stone-800">Bank Transfer</p>
                      <p className="text-stone-500">Contact us for bank details</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg">
                      <p className="font-medium text-stone-800">Cheque/DD</p>
                      <p className="text-stone-500">Payable to "Rajasthan Integrated Development Society"</p>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg">
                      <p className="font-medium text-stone-800">In-Kind Donations</p>
                      <p className="text-stone-500">Books, clothes, medical supplies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Tiers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              See Your Impact
            </h2>
            <p className="text-stone-600 text-lg">Every rupee creates real change</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donationTiers.map((tier, index) => (
              <Card key={index} className="border border-stone-100 hover:border-terracotta-200 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-terracotta-100 flex items-center justify-center text-terracotta-600 group-hover:scale-110 transition-transform duration-300">
                      <Heart size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-stone-800">₹{tier.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-stone-600">{tier.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-stone-800 to-stone-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Questions About Donating?
          </h2>
          <p className="text-stone-300 text-lg mb-8">
            We're here to help. Reach out for any queries about donations, tax benefits, or how your funds will be used.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                Contact Us
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <a href={`mailto:${ngoInfo.email}`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
