import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Shield, CheckCircle, ArrowRight, Gift, Users,
  GraduationCap, Stethoscope, Info, Lock, CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  /* ---------------- Razorpay Script ---------------- */
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

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
    if (value) setSelectedAmount(parseInt(value) || 0);
  };

  const getImpactText = (amount) => {
    const tier = donationTiers.find(t => t.amount <= amount);
    return tier ? tier.impact : 'Make a meaningful contribution';
  };

  /* ---------------- DONATE ---------------- */
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

    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderResult = await donationsAPI.createOrder({
        ...donorInfo,
        amount: selectedAmount,
        type: donationType
      });

      console.log('Order created:', orderResult);

      const options = {
        key: orderResult.razorpay_key_id,      // ✅ FIXED
        amount: orderResult.amount_paise,      // ✅ PAISA
        currency: orderResult.currency || 'INR',
        name: 'RIDS - Rajasthan Integrated Development Society',
        description: donationType === 'monthly'
          ? 'Monthly Donation'
          : 'One-time Donation',
        order_id: orderResult.order_id,

        handler: function (response) {
          console.log('Payment success:', response);
          setPaymentSuccess(true);
          toast.success('Thank you for your generous donation! 🙏');

          setDonorInfo({ name: '', email: '', phone: '', pan: '', address: '' });
          setSelectedAmount(1000);
          setCustomAmount('');
        },

        prefill: {
          name: donorInfo.name,
          email: donorInfo.email,
          contact: donorInfo.phone
        },

        theme: { color: '#c87d4a' },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(response.error.description || 'Payment failed');
        setIsProcessing(false);
      });
      razorpay.open();

    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to process donation. Please try again.');
      setIsProcessing(false);
    }
  };

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardContent className="p-8">
            <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-stone-600 mb-6">
              Your donation has been successfully received.
            </p>
            <Link to="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-16 text-center bg-gradient-to-r from-terracotta-600 to-ochre-600 text-white">
        <h1 className="text-4xl font-bold mb-2">Make a Donation</h1>
        <p>Your support changes lives.</p>
      </section>

      <section className="py-12 max-w-xl mx-auto px-4">
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleDonate} className="space-y-6">
              <Label>Donation Type</Label>
              <Tabs value={donationType} onValueChange={setDonationType}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="one-time">One-Time</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>

              <Label>Amount (₹)</Label>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => handleAmountSelect(a)}
                    className={`p-3 rounded border ${
                      selectedAmount === a ? 'border-terracotta-500 bg-terracotta-50' : 'border-stone-200'
                    }`}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>

              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
              />

              <Input name="name" placeholder="Full Name" value={donorInfo.name} onChange={handleInputChange} required />
              <Input name="email" placeholder="Email" value={donorInfo.email} onChange={handleInputChange} required />
              <Input name="phone" placeholder="Phone" value={donorInfo.phone} onChange={handleInputChange} required />

              <Button type="submit" disabled={isProcessing} className="w-full">
                {isProcessing ? 'Processing…' : `Donate ₹${selectedAmount}`}
              </Button>

              <div className="text-center text-sm text-stone-500 flex items-center justify-center gap-2">
                <Lock size={14} /> Secure payment via Razorpay
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Donate;
