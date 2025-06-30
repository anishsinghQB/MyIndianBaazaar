import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Headphones,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  HelpCircle,
  FileText,
  RefreshCw,
  Truck,
  Package,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function CustomerCare() {
  const helpTopics = [
    {
      icon: Package,
      title: "Order Issues",
      description: "Track orders, delivery issues, and order modifications",
    },
    {
      icon: RefreshCw,
      title: "Returns & Refunds",
      description: "Return policy, refund status, and exchange requests",
    },
    {
      icon: Truck,
      title: "Shipping Info",
      description: "Delivery times, shipping charges, and tracking",
    },
    {
      icon: FileText,
      title: "Account & Billing",
      description: "Account settings, payment issues, and invoices",
    },
  ];

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 hover:underline text-[#1690C7]"
          >
            <ChevronLeft className="h-4 w-4 text-[#1690C7]" />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-[#1690C7]  rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                How can we help you?
              </h1>
              <p className="text-gray-600 text-lg">
                We're here to support you 24/7. Choose how you'd like to get
                help.
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg border p-6 text-center hover:shadow-md transition-shadow">
                <Phone className="h-8 w-8 text-[#1690C7] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Speak with our support team
                </p>
                <Button className="w-full">Call Now</Button>
                <p className="text-xs text-gray-500 mt-2">Available 24/7</p>
              </div>

              <div className="bg-white rounded-lg border p-6 text-center hover:shadow-md transition-shadow">
                <MessageCircle className="h-8 w-8 text-[#1690C7] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Chat with us in real-time
                </p>
                <Button className="w-full">Start Chat</Button>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-green-600">● Online</span> - Avg wait: 2
                  min
                </p>
              </div>

              <div className="bg-white rounded-lg border p-6 text-center hover:shadow-md transition-shadow">
                <Mail className="h-8 w-8 text-[#1690C7] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Email Support
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Send us detailed queries
                </p>
                <Button  className="w-full bg-[#1690C7]">
                  Send Email
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* Help Topics */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Popular Help Topics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {helpTopics.map((topic, index) => {
                  const Icon = topic.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#1690C7] /10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-[#1690C7]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {topic.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg border p-8 mb-8">
              <div className="text-center">
                <HelpCircle className="h-12 w-12 text-[#1690C7] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 mb-6">
                  Find quick answers to common questions about our service
                </p>
                <Button variant="outline" size="lg">
                  Browse FAQ
                </Button>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-[#1690C7]" />
                <h3 className="font-semibold text-gray-900">Business Hours</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone Support:</span> 24/7
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Live Chat:</span> 24/7
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Email Support:</span> 24/7
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Response Time:</span> Within
                    24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
