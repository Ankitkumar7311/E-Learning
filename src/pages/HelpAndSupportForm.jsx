import { useState, useEffect } from "react";
import { Send, CheckCircle, Lock, X, Loader2 } from 'lucide-react';
import TeacherNavBar from "../modules/faculty/TeacherNavBar";

// Utility function to safely get user details from localStorage
const getUserDetails = () => {
    try {
        const authData = localStorage.getItem('vidyaSarthiAuth');
        if (authData) {
            const parsed = JSON.parse(authData);
            return {
                name: parsed?.user?.name || '',
                email: parsed?.user?.email || '',
            };
        }
    } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
    }
    return { name: '', email: '' };
};

const HelpAndSupportForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        privacyAgreed: false,
    });
    const [formStatus, setFormStatus] = useState({
        isSubmitted: false,
        isSuccess: false,
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-populate form with user data if available
    useEffect(() => {
        const user = getUserDetails();
        setFormData(prev => ({
            ...prev,
            name: user.name,
            email: user.email,
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus({ isSubmitted: false, isSuccess: false, message: '' });

        if (!formData.privacyAgreed) {
            setFormStatus({ isSubmitted: true, isSuccess: false, message: 'Please agree to the privacy policy.' });
            setIsSubmitting(false);
            return;
        }

        try {
            // Simulate API call for 1.5 seconds
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Replace the above line with your actual API endpoint for form submission:
            // const response = await fetch('YOUR_API_ENDPOINT', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData),
            // });
            // if (!response.ok) throw new Error('Failed to submit the form.');

            setFormStatus({
                isSubmitted: true,
                isSuccess: true,
                message: 'Your request has been sent successfully! We will get back to you shortly.'
            });
            // Clear the message and reset the privacy checkbox on success
            setFormData(prev => ({ ...prev, message: '', privacyAgreed: false }));
        } catch (error) {
            setFormStatus({
                isSubmitted: true,
                isSuccess: false,
                message: 'Failed to send your request. Please check your connection and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
            <TeacherNavBar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-6 md:p-8 border border-white/80">
                    {/* Header Section */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100">
                            <Send className="w-7 h-7 text-indigo-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Contact us for any questions, issues, or feedback.
                            </p>
                        </div>
                    </div>

                    {/* Status Message */}
                    {formStatus.isSubmitted && (
                        <div className={`p-4 rounded-xl mb-6 flex items-start space-x-3 ${formStatus.isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {formStatus.isSuccess ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <X className="w-5 h-5 flex-shrink-0" />}
                            <p className="font-medium text-sm">{formStatus.message}</p>
                        </div>
                    )}
                    
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/60 border-2 border-blue-500 rounded-xl px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/60 border-2 border-blue-500 rounded-xl px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Your Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Please describe your issue or question in detail."
                                required
                                className="w-full bg-white/60 border-2 border-blue-500 rounded-xl px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
                            />
                        </div>

                        {/* Privacy Policy Section */}
                        <div className="bg-white/50 p-4 rounded-xl border border-white/80 space-y-2">
                            <div className="flex items-center space-x-2 text-gray-700">
                                <Lock className="w-4 h-4 text-gray-500" />
                                <h3 className="font-semibold text-sm">Privacy Policy</h3>
                            </div>
                            <p className="text-xs text-gray-600">
                                Your personal information is used solely to address your support request and will not be shared with third parties.
                            </p>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="privacyAgreed"
                                    name="privacyAgreed"
                                    checked={formData.privacyAgreed}
                                    onChange={handleChange}
                                    required
                                    className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="privacyAgreed" className="ml-2 block text-xs text-gray-900">
                                    I agree to the privacy policy.
                                </label>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl shadow-lg text-white bg-yellow-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Submit Request</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HelpAndSupportForm;