'use client';

import { ArrowRight, Shield, TrendingUp, Users, ChevronDown, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/layout/navbar';
import { getDefaultRoute } from '@/hooks/useAuthGuard';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const loggedIn = isAuthenticated() && user;
  
  // Calculator states
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTenure, setLoanTenure] = useState(12);
  

  
  // FAQ state
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // EMI Calculator
  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTenure;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return isFinite(emi) ? emi.toFixed(2) : 0;
  };

  const emi = calculateEMI();

  const faqs = [
    {
      question: 'What is the maximum loan amount I can apply for?',
      answer: 'The maximum loan amount depends on your income, expenses, and credit score. Our eligibility calculator can give you an instant estimate.'
    },
    {
      question: 'How long does the approval process take?',
      answer: 'Most applications are approved within 2-3 business days. The timeline depends on document verification and background checks.'
    },
    {
      question: 'What documents do I need to submit?',
      answer: 'You need to submit: ID proof, address proof, last 3 months salary slip, bank statements, and employment letter.'
    },
    {
      question: 'Can I prepay my loan?',
      answer: 'Yes, you can prepay your loan anytime without any prepayment penalty.'
    },
    {
      question: 'What is your interest rate range?',
      answer: 'Our interest rates range from 9% to 18% per annum, based on your credit profile and loan tenure.'
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Software Engineer',
      content: 'The application process was seamless. I got approved in just 2 days!',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Business Owner',
      content: 'Excellent customer support and transparent process. Highly recommended!',
      rating: 5
    },
    {
      name: 'Amit Patel',
      role: 'Consultant',
      content: 'Quick disbursal and flexible repayment options. Great experience!',
      rating: 4
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-slate-900 dark:text-white">
            Loan Management System
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            End-to-end lending platform for borrowers and internal operations teams.
            Apply, sanction, disburse, and collect — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {loggedIn ? (
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href={getDefaultRoute(user!.role)}>
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader>
              <Users className="h-10 w-10 text-blue-600" />
              <CardTitle className="mt-4 text-slate-900 dark:text-white">Borrower Portal</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Multi-step application with eligibility checks, document upload, and loan tracking.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600" />
              <CardTitle className="mt-4 text-slate-900 dark:text-white">Role-Based Access</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Dedicated modules for Sales, Sanction, Disbursement, and Collection teams.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-blue-600" />
              <CardTitle className="mt-4 text-slate-900 dark:text-white">Full Lifecycle</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                From application to closure with state machine enforcement and audit trails.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Demo Credentials</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">Password for all accounts: Password@123</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-2">
              <p className="text-slate-700 dark:text-slate-300">borrower@test.com — Borrower Portal</p>
              <p className="text-slate-700 dark:text-slate-300">sales@test.com — Sales Module</p>
              <p className="text-slate-700 dark:text-slate-300">sanction@test.com — Sanction Module</p>
              <p className="text-slate-700 dark:text-slate-300">disbursement@test.com — Disbursement Module</p>
              <p className="text-slate-700 dark:text-slate-300">collection@test.com — Collection Module</p>
              <p className="text-slate-700 dark:text-slate-300">admin@test.com — Full Admin Access</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">EMI Calculator</h2>
            <p className="text-slate-600 dark:text-slate-400">Calculate your monthly EMI instantly</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Calculate Your EMI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}
                  </label>
                  <Input
                    type="range"
                    min="10000"
                    max="1000000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full border-slate-300 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Interest Rate: {interestRate}% p.a.
                  </label>
                  <Input
                    type="range"
                    min="5"
                    max="25"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full border-slate-300 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Loan Tenure: {loanTenure} months
                  </label>
                  <Input
                    type="range"
                    min="3"
                    max="60"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-full border-slate-300 dark:border-slate-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Your EMI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-blue-100 dark:to-blue-900/40 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Monthly EMI</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">₹{emi}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Total Amount:</span>
                      <span className="font-medium text-slate-900 dark:text-white">₹{Math.round(Number(emi) * loanTenure).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Total Interest:</span>
                      <span className="font-medium text-slate-900 dark:text-white">₹{Math.round(Number(emi) * loanTenure).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/borrower/apply">Apply Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Reviews Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">What Our Users Say</h2>
            <p className="text-slate-600 dark:text-slate-400">Trusted by thousands of borrowers</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 italic">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-400">Find answers to common questions</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div
                  className="p-6 cursor-pointer flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <h3 className="font-medium text-slate-900 dark:text-white pr-4">{faq.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-500 dark:text-slate-400 flex-shrink-0 transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700 pt-4 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About CreditSea LMS</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                CreditSea is a leading fintech platform dedicated to providing accessible and transparent lending solutions. Our Loan Management System (LMS) streamlines the entire loan lifecycle from application to repayment.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                With cutting-edge technology and a customer-centric approach, we&apos;ve helped thousands of borrowers achieve their financial goals. Our platform ensures quick approvals, transparent terms, and flexible repayment options.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We&apos;re committed to making lending fair, fast, and accessible to everyone.
              </p>
              <div className="flex gap-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/borrower/apply">Learn More</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="#contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center p-6">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Happy Customers</p>
              </Card>
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center p-6">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">₹500Cr+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Loans Disbursed</p>
              </Card>
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center p-6">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Customer Support</p>
              </Card>
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center p-6">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">99%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Customer Satisfaction</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-slate-600 dark:text-slate-400">
          <p>Made by Raman Kirar for CreditSea Loan Management System</p>
        </div>
      </footer>
    </div>
  );
}
