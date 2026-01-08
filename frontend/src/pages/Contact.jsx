import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { inquiriesAPI } from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value) => {
    setForm((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.name || !form.email || !form.message || !form.subject) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      console.log('📨 Sending inquiry:', form);

      await inquiriesAPI.create({
        name: form.name,
        email: form.email,
        phone: form.phone || '',
        subject: form.subject,
        message: form.message,
      });

      toast.success('Message sent successfully!');

      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('❌ Inquiry error:', error);
      console.error('❌ Backend:', error?.response?.data);

      toast.error(
        error?.response?.data?.detail ||
          'Failed to submit. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-stone-50">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                name="name"
                placeholder="Full Name *"
                value={form.name}
                onChange={handleChange}
              />

              <Input
                name="email"
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={handleChange}
              />

              <Input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />

              <div>
                <Label>Subject *</Label>
                <Select value={form.subject} onValueChange={handleSubjectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="volunteer">Volunteering</SelectItem>
                    <SelectItem value="donation">Donations</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                name="message"
                placeholder="Your message *"
                rows={5}
                value={form.message}
                onChange={handleChange}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white"
              >
                {loading ? 'Sending…' : (
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
    </div>
  );
};

export default Contact;
